const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all stays
router.get('/', async (req, res) => {
  try {
    const { featured, limit } = req.query;

    const where = {};
    
    if (featured === 'true') {
      where.featured = true;
    }

    const take = limit ? parseInt(limit) : undefined;

    const stays = await prisma.stay.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take
    });

    res.json({
      stays: stays || []
    });
  } catch (error) {
    console.error('Get stays error:', error);
    res.status(500).json({ error: 'Failed to fetch stays' });
  }
});

// Get single stay by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const stay = await prisma.stay.findUnique({
      where: { id }
    });

    if (!stay) {
      return res.status(404).json({ error: 'Stay not found' });
    }

    res.json({ stay });
  } catch (error) {
    console.error('Get stay error:', error);
    res.status(500).json({ error: 'Failed to fetch stay' });
  }
});

module.exports = router;

