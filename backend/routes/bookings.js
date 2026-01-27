const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate booking ID in format YYYYMMDD0001
async function generateBookingId(date) {
  const bookingDate = new Date(date);
  const dateStr = bookingDate.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  
  // Find the last booking for this date
  const lastBooking = await prisma.booking.findFirst({
    where: {
      bookingId: {
        startsWith: dateStr
      }
    },
    orderBy: {
      bookingId: 'desc'
    }
  });
  
  let sequence = 1;
  if (lastBooking && lastBooking.bookingId) {
    // Extract sequence number from last booking ID (last 4 digits)
    const lastSequence = parseInt(lastBooking.bookingId.slice(-4), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }
  
  // Format sequence as 4-digit number with leading zeros
  const sequenceStr = sequence.toString().padStart(4, '0');
  
  return `${dateStr}${sequenceStr}`;
}

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        experience: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            },
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        experience: {
          include: {
            images: true,
            category: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { experienceId, date, guests, totalPrice, paymentIntentId } = req.body;

    if (!experienceId || !date || !guests || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify experience exists
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Generate unique booking ID
    const bookingId = await generateBookingId(date);

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        userId: req.user.id,
        experienceId,
        date: new Date(date),
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice),
        paymentIntentId,
        status: 'pending',
        paymentStatus: paymentIntentId ? 'paid' : 'pending'
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

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      }
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    res.json({ booking: updated });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;

