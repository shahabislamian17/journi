const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Get wishlist - userId:', req.user.id);
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        experience: {
          include: {
            category: {
              select: {
                name: true,
                slug: true
              }
            },
            images: {
              where: { isPrimary: true },
              take: 1
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
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('Get wishlist - found items:', wishlistItems.length);

    // Use exact rating from database (don't calculate from reviews)
    const itemsWithRating = wishlistItems.map(item => {
      // Always use the database rating field directly
      const rating = item.experience.rating != null ? item.experience.rating : 0;

      return {
        ...item,
        experience: {
          ...item.experience,
          rating: rating, // Use exact database value, no rounding
          reviewCount: item.experience._count.reviews
        }
      };
    });

    console.log('Get wishlist - returning items:', itemsWithRating.length);
    res.json({ wishlist: itemsWithRating });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { experienceId } = req.body;

    if (!experienceId) {
      return res.status(400).json({ error: 'Experience ID is required' });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_experienceId: {
          userId: req.user.id,
          experienceId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: req.user.id,
        experienceId
      },
      include: {
        experience: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    res.status(201).json({ wishlistItem });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:experienceId', authenticateToken, async (req, res) => {
  try {
    const { experienceId } = req.params;

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_experienceId: {
          userId: req.user.id,
          experienceId
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Not in wishlist' });
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_experienceId: {
          userId: req.user.id,
          experienceId
        }
      }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;

