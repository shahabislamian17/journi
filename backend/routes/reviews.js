const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get featured website reviews (for home page)
router.get('/website/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const reviews = await prisma.websiteReview.findMany({
      where: { featured: true },
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
      take: parseInt(limit)
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get featured website reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch featured website reviews' });
  }
});

// Get reviews for an experience
router.get('/experience/:experienceId', async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { experienceId },
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
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { experienceId, bookingId, rating, comment } = req.body;

    if (!experienceId || !rating) {
      return res.status(400).json({ error: 'Experience ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user has a booking for this experience
    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId: req.user.id,
          experienceId,
          status: 'completed'
        }
      });

      if (!booking) {
        return res.status(403).json({ error: 'You can only review experiences you have completed' });
      }

      // Check if review already exists for this booking
      const existingReview = await prisma.review.findUnique({
        where: { bookingId }
      });

      if (existingReview) {
        return res.status(400).json({ error: 'Review already exists for this booking' });
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        experienceId,
        bookingId,
        rating: parseInt(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(comment !== undefined && { comment })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.json({ review: updated });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;

