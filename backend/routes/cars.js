const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const { featured, limit } = req.query;

    const where = {};
    
    if (featured === 'true') {
      where.featured = true;
    }

    const take = limit ? parseInt(limit) : undefined;

    const cars = await prisma.car.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take
    });

    res.json({
      cars: cars || []
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Get single car by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id }
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ car });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

module.exports = router;

