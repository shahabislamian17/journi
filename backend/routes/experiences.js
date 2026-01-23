const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all experiences with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      isNew,
      limit = 10,
      cursor,
      search,
      destination,
      checkInDate,
      checkOutDate,
      adults,
      children
    } = req.query;

    console.log('[Experiences API] Request params:', {
      category,
      featured,
      isNew,
      limit,
      search,
      destination
    });

    const where = {};
    
    if (category) {
      // Support both slug and ID
      // If it looks like a UUID, treat it as categoryId, otherwise as slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (isUUID) {
        where.categoryId = category;
      } else {
        where.category = { slug: category };
      }
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (isNew === 'true') {
      where.isNew = true;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by destination (location)
    if (destination) {
      where.location = { contains: destination, mode: 'insensitive' };
    }

    // Filter by date range and guest capacity (via availability slots) - booking.com style
    const totalGuests = (parseInt(adults) || 1) + (parseInt(children) || 0);
    
    // Build availability filter - experiences must have at least one available slot
    // that matches the date range and guest requirements
    if (checkInDate || checkOutDate || totalGuests > 1) {
      const availabilityFilter = {
        available: true
      };
      
      // Date range filter: if both dates provided, find slots within range
      // If only one date, use that as a constraint
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        // Set time to start/end of day for proper comparison
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(23, 59, 59, 999);
        
        availabilityFilter.date = {
          gte: checkIn,
          lte: checkOut
        };
      } else if (checkInDate) {
        const checkIn = new Date(checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        availabilityFilter.date = { gte: checkIn };
      } else if (checkOutDate) {
        const checkOut = new Date(checkOutDate);
        checkOut.setHours(23, 59, 59, 999);
        availabilityFilter.date = { lte: checkOut };
      }
      
      // Guest capacity filter: slot must accommodate total guests
      if (totalGuests > 1) {
        availabilityFilter.OR = [
          { maxGuests: { gte: totalGuests } },
          { maxGuests: null } // null means unlimited capacity
        ];
      }
      
      where.availabilitySlots = {
        some: availabilityFilter
      };
    }

    const take = parseInt(limit) || 10;
    const skip = cursor ? 1 : 0;
    const cursorObj = cursor ? { id: cursor } : undefined;

    // Get total count for pagination with error handling
    // Skip count if it fails to avoid blocking the response
    // Use timeout to prevent hanging on connection issues
    let totalCount = 0;
    try {
      totalCount = await Promise.race([
        prisma.experience.count({ where }),
        new Promise((resolve) => {
          setTimeout(() => {
            console.warn('[Experiences] Count query timeout, using 0 as default');
            resolve(0);
          }, 5000); // 5 second timeout
        })
      ]);
    } catch (countError) {
      console.error('Error getting experience count:', countError);
      console.error('Count error details:', {
        message: countError.message,
        code: countError.code,
        meta: countError.meta
      });
      // Continue without count if it fails - don't block the response
      totalCount = 0;
    }

    // Fetch experiences with error handling
    let experiences = [];
    try {
      experiences = await prisma.experience.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: [
              { isPrimary: 'desc' },
              { order: 'asc' }
            ],
            take: 5
          },
          reviews: {
            select: {
              rating: true
            }
          },
          availabilitySlots: (checkInDate || checkOutDate || totalGuests > 1) ? {
            where: {
              available: true,
              ...(checkInDate && checkOutDate ? {
                date: {
                  gte: new Date(checkInDate),
                  lte: new Date(checkOutDate)
                }
              } : checkInDate ? {
                date: { gte: new Date(checkInDate) }
              } : checkOutDate ? {
                date: { lte: new Date(checkOutDate) }
              } : {}),
              ...(totalGuests > 1 ? {
                OR: [
                  { maxGuests: { gte: totalGuests } },
                  { maxGuests: null }
                ]
              } : {})
            },
            take: 10
          } : false,
          _count: {
            select: {
              reviews: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: take + 1,
        skip,
        cursor: cursorObj
      });
    } catch (expError) {
      console.error('Error fetching experiences:', expError);
      console.error('Experience error details:', {
        message: expError.message,
        code: expError.code,
        meta: expError.meta
      });
      // Return error response if query fails
      return res.status(500).json({
        error: 'Failed to fetch experiences',
        experiences: { data: [], total: 0, hasMore: false, nextCursor: null }
      });
    }

    const hasMore = experiences.length > take;
    const data = hasMore ? experiences.slice(0, take) : experiences;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    // Use exact rating from database (don't round)
    const experiencesWithRating = data.map(exp => {
      // Always use the database rating field directly (don't calculate from reviews)
      // The database rating is the source of truth
      const rating = exp.rating != null ? exp.rating : 0;

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[Rating Debug]', {
          id: exp.id,
          title: exp.title,
          dbRating: exp.rating,
          reviewsCount: exp.reviews.length,
          calculatedAvg: exp.reviews.length > 0
            ? exp.reviews.reduce((sum, r) => sum + r.rating, 0) / exp.reviews.length
            : null,
          finalRating: rating
        });
      }

      return {
        ...exp,
        rating: rating, // Use exact database value
        reviewCount: exp._count.reviews
      };
    });

    res.json({
      experiences: {
        data: experiencesWithRating,
        hasMore,
        nextCursor,
        total: totalCount
      }
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch experiences',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: {
          code: error.code,
          meta: error.meta
        }
      })
    });
  }
});

// Get experience by ID (for editing)
router.get('/by-id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' }
          ]
        },
        availabilitySlots: {
          orderBy: {
            date: 'asc'
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Verify user is the host
    if (experience.hostId !== req.user.id) {
      return res.status(403).json({ error: 'Only the experience owner can view this' });
    }

    // Parse JSON fields
    let languages = [];
    let includedItems = [];
    try {
      if (experience.languages) languages = JSON.parse(experience.languages);
      if (experience.includedItems) includedItems = JSON.parse(experience.includedItems);
    } catch (e) {
      console.error('Error parsing JSON fields:', e);
    }

    res.json({
      experience: {
        ...experience,
        languages,
        includedItems,
        rating: experience.rating || 0,
        reviewCount: experience._count.reviews
      }
    });
  } catch (error) {
    console.error('Get experience by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Get experience by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { checkInDate, checkOutDate, adults, children } = req.query;
  console.log('[Experience Slug Route] Entry', { slug, method: req.method, query: req.query });
  
  try {
    // Build availability filter based on search parameters (booking.com style)
    const totalGuests = (parseInt(adults) || 1) + (parseInt(children) || 0);
    // Set time to start of today to include today's slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availabilityWhere = {
      available: true,
      date: {
        gte: today // Include today and future dates
      }
    };
    
    // Filter by date range if provided
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(23, 59, 59, 999);
      
      availabilityWhere.date = {
        gte: checkIn,
        lte: checkOut
      };
    } else if (checkInDate) {
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      availabilityWhere.date = {
        ...availabilityWhere.date,
        gte: checkIn
      };
    } else if (checkOutDate) {
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(23, 59, 59, 999);
      availabilityWhere.date = {
        ...availabilityWhere.date,
        lte: checkOut
      };
    }
    
    // Filter by guest capacity
    if (totalGuests > 1) {
      availabilityWhere.OR = [
        { maxGuests: { gte: totalGuests } },
        { maxGuests: null } // null means unlimited
      ];
    }

    // First try to find by exact slug match
    let experience = await prisma.experience.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' }
          ]
        },
        availabilitySlots: {
          where: availabilityWhere,
          orderBy: {
            date: 'asc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    // If not found by slug, try to find by title slug (generated from title)
    if (!experience) {
      const allExperiences = await prisma.experience.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: [
              { isPrimary: 'desc' },
              { order: 'asc' }
            ]
          },
          availabilitySlots: {
            where: availabilityWhere,
            orderBy: {
              date: 'asc'
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              languages: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        }
      });

      // Find experience where title slug matches
      experience = allExperiences.find(exp => {
        const titleSlug = (exp.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return titleSlug === slug;
      });
    }

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Fetch host data if hostId exists
    let host = null;
    if (experience.hostId) {
      try {
        // First try with languages (if column exists)
        host = await prisma.user.findUnique({
          where: { id: experience.hostId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            languages: true
          }
        });
      } catch (e) {
        // If languages column doesn't exist, fetch without it
        if (e.code === 'P2022' || e.message?.includes('languages')) {
          try {
            host = await prisma.user.findUnique({
              where: { id: experience.hostId },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            });
            if (host) {
              host.languages = null;
            }
          } catch (e2) {
            console.error('Error fetching host (fallback):', e2);
          }
        } else {
          console.error('Error fetching host:', e);
        }
      }
    }

    // Use exact rating from database (don't calculate from reviews)
    // The database rating field is the source of truth
    const rating = experience.rating != null ? experience.rating : 0;

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Rating Debug - Slug]', {
        id: experience.id,
        slug: experience.slug,
        dbRating: experience.rating,
        reviewsCount: experience.reviews.length,
        calculatedAvg: experience.reviews.length > 0
          ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
          : null,
        finalRating: rating
      });
    }

    // Parse JSON fields
    let languages = [];
    let includedItems = [];
    try {
      if (experience.languages) languages = JSON.parse(experience.languages);
      if (experience.includedItems) includedItems = JSON.parse(experience.includedItems);
    } catch (e) {
      console.error('Error parsing JSON fields:', e);
    }

    console.log('[Experience Slug Route] Success - sending response', { 
      experienceId: experience.id,
      slug: experience.slug,
      hasHost: !!host,
      rating: rating,
      availabilitySlotsCount: experience.availabilitySlots?.length || 0
    });
    
    // Log availability slots for debugging
    if (experience.availabilitySlots && experience.availabilitySlots.length > 0) {
      console.log('[Experience Slug Route] Availability slots:', experience.availabilitySlots.map(slot => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
        available: slot.available
      })));
    } else {
      console.log('[Experience Slug Route] No availability slots found for experience');
    }
    
    res.json({
      experience: {
        ...experience,
        host, // Include host data if available
        languages,
        includedItems,
        rating: rating, // Use exact database value
        reviewCount: experience._count.reviews
      }
    });
    
    console.log('[Experience Slug Route] Exit - response sent');
  } catch (error) {
    console.error('[Experience Slug Route] Error:', error);
    console.error('[Experience Slug Route] Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
    
    // Ensure response is sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to fetch experience',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
      console.log('[Experience Slug Route] Exit - error response sent');
    } else {
      console.error('[Experience Slug Route] Exit - headers already sent, cannot send error response');
    }
  }
});

// Create experience (host only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is a host
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (user.role !== 'HOST') {
      return res.status(403).json({ error: 'Only hosts can create experiences' });
    }

    const {
      title,
      slug,
      description,
      categoryId,
      duration,
      hours,
      price,
      location,
      itinerary,
      languages,
      includedItems,
      requirements,
      accessibility,
      cancellationPolicy,
      locationDetails,
      latitude,
      longitude,
      availabilitySlots
    } = req.body;

    // Validate required fields
    if (!title || !slug || !categoryId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user info for host
    const hostUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { firstName: true, lastName: true, avatar: true }
    });

    const hostName = `${hostUser.firstName || ''} ${hostUser.lastName || ''}`.trim();

    // Create experience
    const experience = await prisma.experience.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        duration,
        hours: hours ? parseFloat(hours) : null,
        price: parseFloat(price),
        location,
        itinerary,
        hostId: req.user.id,
        hostName: hostName || 'Host',
        hostImage: hostUser.avatar || null,
        languages: languages ? JSON.stringify(languages) : null,
        includedItems: includedItems ? JSON.stringify(includedItems) : null,
        requirements,
        accessibility,
        cancellationPolicy,
        locationDetails,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        availabilitySlots: availabilitySlots ? {
          create: availabilitySlots.map(slot => ({
            date: new Date(slot.date),
            startTime: slot.startTime || null,
            endTime: slot.endTime || null,
            price: slot.price ? parseFloat(slot.price) : null,
            maxGuests: slot.maxGuests || 10,
            available: slot.available !== false
          }))
        } : undefined
      },
      include: {
        category: true,
        availabilitySlots: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' }
          ]
        }
      }
    });

    res.status(201).json({ experience });
  } catch (error) {
    console.error('Create experience error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

// Update experience (host only - owner)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Log incoming request for debugging
    console.log('[Update Experience] Request received:', {
      experienceId: id,
      bodyKeys: Object.keys(req.body),
      hasAvailabilitySlots: 'availabilitySlots' in req.body,
      availabilitySlotsType: typeof req.body.availabilitySlots,
      availabilitySlotsValue: req.body.availabilitySlots,
      availabilitySlotsLength: Array.isArray(req.body.availabilitySlots) ? req.body.availabilitySlots.length : 'not an array'
    });

    // Check if experience exists and user is the host
    const experience = await prisma.experience.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    if (experience.hostId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own experiences' });
    }

    const {
      title,
      slug,
      description,
      categoryId,
      duration,
      hours,
      price,
      location,
      itinerary,
      languages,
      includedItems,
      requirements,
      accessibility,
      cancellationPolicy,
      locationDetails,
      latitude,
      longitude,
      availabilitySlots
    } = req.body;

    // Update experience
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(duration !== undefined && { duration }),
        ...(hours !== undefined && { hours: hours ? parseFloat(hours) : null }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(location !== undefined && { location }),
        ...(itinerary !== undefined && { itinerary }),
        ...(languages !== undefined && { languages: languages ? JSON.stringify(languages) : null }),
        ...(includedItems !== undefined && { includedItems: includedItems ? JSON.stringify(includedItems) : null }),
        ...(requirements !== undefined && { requirements }),
        ...(accessibility !== undefined && { accessibility }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
        ...(locationDetails !== undefined && { locationDetails }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null })
      },
      include: {
        category: true,
        availabilitySlots: true
      }
    });

    // Update availability slots - always process if the field is present in request
    // This allows us to delete all slots by sending an empty array
    // Check both req.body directly and the destructured variable
    const slotsToProcess = availabilitySlots !== undefined ? availabilitySlots : req.body.availabilitySlots;
    
    if (slotsToProcess !== undefined) {
      console.log('[Update Experience] Processing availability slots:', {
        experienceId: id,
        slotsCount: Array.isArray(slotsToProcess) ? slotsToProcess.length : 'not an array',
        slots: slotsToProcess,
        type: typeof slotsToProcess
      });

      // Delete existing slots first
      const deletedCount = await prisma.availabilitySlot.deleteMany({
        where: { experienceId: id }
      });
      console.log('[Update Experience] Deleted existing slots:', deletedCount.count);

      // Create new slots only if array is not empty
      if (Array.isArray(slotsToProcess) && slotsToProcess.length > 0) {
        const created = await prisma.availabilitySlot.createMany({
          data: slotsToProcess.map(slot => ({
            experienceId: id,
            date: new Date(slot.date),
            startTime: slot.startTime || null,
            endTime: slot.endTime || null,
            price: slot.price ? parseFloat(slot.price) : null,
            maxGuests: slot.maxGuests || 10,
            available: slot.available !== false
          }))
        });
        console.log('[Update Experience] Created new slots:', created.count);
      } else {
        console.log('[Update Experience] No new slots to create (empty array or not an array)');
      }
    } else {
      console.log('[Update Experience] availabilitySlots field not provided, skipping slot update');
      console.log('[Update Experience] Request body keys:', Object.keys(req.body));
    }

    const updatedWithSlots = await prisma.experience.findUnique({
      where: { id },
      include: {
        category: true,
        availabilitySlots: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' }
          ]
        }
      }
    });

    res.json({ experience: updatedWithSlots });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Add image to experience
router.post('/:id/images', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { original, large, medium, small, thumbnail, isPrimary, order } = req.body;

    if (!original) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Verify experience exists and user is the owner
    const experience = await prisma.experience.findUnique({
      where: { id }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    if (experience.hostId !== req.user.id) {
      return res.status(403).json({ error: 'Only the experience owner can add images' });
    }

    // If this is set as primary, unset other primary images
    if (isPrimary) {
      await prisma.experienceImage.updateMany({
        where: { experienceId: id, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    const image = await prisma.experienceImage.create({
      data: {
        experienceId: id,
        original,
        large: large || null,
        medium: medium || null,
        small: small || null,
        thumbnail: thumbnail || null,
        isPrimary: isPrimary || false,
        order: order || 0
      }
    });

    res.status(201).json({ image });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// Delete image from experience
router.delete('/:id/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const { id, imageId } = req.params;

    // Verify experience exists and user is the owner
    const experience = await prisma.experience.findUnique({
      where: { id }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    if (experience.hostId !== req.user.id) {
      return res.status(403).json({ error: 'Only the experience owner can delete images' });
    }

    // Verify image belongs to experience
    const image = await prisma.experienceImage.findUnique({
      where: { id: imageId }
    });

    if (!image || image.experienceId !== id) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await prisma.experienceImage.delete({
      where: { id: imageId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;

