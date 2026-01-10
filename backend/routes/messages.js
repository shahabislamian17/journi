const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get message by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Mark as read
    if (!message.read) {
      await prisma.message.update({
        where: { id },
        data: { read: true }
      });
      message.read = true;
    }

    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Create message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { subject, message: messageText } = req.body;

    if (!subject || !messageText) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const message = await prisma.message.create({
      data: {
        userId: req.user.id,
        subject,
        message: messageText
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Mark message as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { read: true }
    });

    res.json({ message: updated });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await prisma.message.delete({
      where: { id }
    });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;

