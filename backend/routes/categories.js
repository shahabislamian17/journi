const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    let categories = [];
    try {
      categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (dbError) {
      console.error('Error fetching categories from database:', dbError);
      console.error('Category error details:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      // Return empty array on database error to prevent page crash
      return res.json({ categories: [] });
    }

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    // Return empty array instead of 500 to allow page to load
    res.json({ categories: [] });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        experiences: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          },
          take: 10
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;

