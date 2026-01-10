const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all experiences with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      isNew,
      limit = 10,
      cursor,
      search
    } = req.query;

    const where = {};
    
    if (category) {
      where.category = { slug: category };
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

    const take = parseInt(limit) || 10;
    const skip = cursor ? 1 : 0;
    const cursorObj = cursor ? { id: cursor } : undefined;

    // Get total count for pagination
    const totalCount = await prisma.experience.count({ where });

    const experiences = await prisma.experience.findMany({
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

    const hasMore = experiences.length > take;
    const data = hasMore ? experiences.slice(0, take) : experiences;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    // Calculate average rating
    const experiencesWithRating = data.map(exp => {
      const avgRating = exp.reviews.length > 0
        ? exp.reviews.reduce((sum, r) => sum + r.rating, 0) / exp.reviews.length
        : exp.rating;

      return {
        ...exp,
        rating: Math.round(avgRating * 10) / 10,
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
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Get experience by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

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
          where: {
            available: true,
            date: {
              gte: new Date() // Only future dates
            }
          },
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
            where: {
              available: true,
              date: {
                gte: new Date()
              }
            },
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

    // Calculate average rating
    const avgRating = experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : experience.rating;

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
        host, // Include host data if available
        languages,
        includedItems,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: experience._count.reviews
      }
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Create experience (host only)
const { authenticateToken } = require('../middleware/auth');
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
        availabilitySlots: true
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

    // Update availability slots if provided
    if (availabilitySlots) {
      // Delete existing slots
      await prisma.availabilitySlot.deleteMany({
        where: { experienceId: id }
      });

      // Create new slots
      if (availabilitySlots.length > 0) {
        await prisma.availabilitySlot.createMany({
          data: availabilitySlots.map(slot => ({
            experienceId: id,
            date: new Date(slot.date),
            startTime: slot.startTime || null,
            endTime: slot.endTime || null,
            price: slot.price ? parseFloat(slot.price) : null,
            maxGuests: slot.maxGuests || 10,
            available: slot.available !== false
          }))
        });
      }
    }

    const updatedWithSlots = await prisma.experience.findUnique({
      where: { id },
      include: {
        category: true,
        availabilitySlots: true
      }
    });

    res.json({ experience: updatedWithSlots });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

module.exports = router;

