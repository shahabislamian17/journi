const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Conversations route is working', timestamp: new Date().toISOString() });
});

// Get all conversations for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get conversations where user is participant1 or participant2
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        },
        experience: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: {
                original: true,
                medium: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participant1Id === userId 
        ? conv.participant2 
        : conv.participant1;
      
      const lastMessage = conv.messages[0] || null;
      const experienceImage = conv.experience?.images[0]?.medium || conv.experience?.images[0]?.original || null;
      
      return {
        id: conv.id,
        otherParticipant: {
          id: otherParticipant.id,
          name: `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || otherParticipant.email,
          avatar: otherParticipant.avatar || '/assets/images/global/hosts/placeholder.jpg'
        },
        experience: conv.experience ? {
          id: conv.experience.id,
          title: conv.experience.title,
          slug: conv.experience.slug,
          image: experienceImage
        } : null,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          message: lastMessage.message,
          senderId: lastMessage.senderId,
          senderName: `${lastMessage.sender.firstName || ''} ${lastMessage.sender.lastName || ''}`.trim() || 'User',
          createdAt: lastMessage.createdAt,
          read: lastMessage.read
        } : null,
        lastMessageAt: conv.lastMessageAt || conv.createdAt,
        unreadCount: 0 // Will be calculated if needed
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation with all messages
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        },
        experience: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: {
                original: true,
                medium: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Mark all messages as read
    await prisma.conversationMessage.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        read: false
      },
      data: { read: true }
    });

    // Format conversation for frontend
    const otherParticipant = conversation.participant1Id === userId 
      ? conversation.participant2 
      : conversation.participant1;
    
    const experienceImage = conversation.experience?.images[0]?.medium || conversation.experience?.images[0]?.original || null;

    const formattedConversation = {
      id: conversation.id,
      otherParticipant: {
        id: otherParticipant.id,
        name: `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || otherParticipant.email,
        avatar: otherParticipant.avatar || '/assets/images/global/hosts/placeholder.jpg'
      },
      experience: conversation.experience ? {
        id: conversation.experience.id,
        title: conversation.experience.title,
        slug: conversation.experience.slug,
        image: experienceImage
      } : null,
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        senderId: msg.senderId,
        senderName: `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || 'User',
        senderAvatar: msg.sender.avatar || '/assets/images/global/hosts/placeholder.jpg',
        createdAt: msg.createdAt,
        read: msg.read,
        isOwn: msg.senderId === userId
      }))
    };

    res.json({ conversation: formattedConversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Create or get existing conversation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { participantId, experienceId } = req.body;
    const userId = req.user.id;

    console.log('[Conversations] Create conversation request:', {
      userId,
      participantId,
      experienceId
    });

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    if (participantId === userId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }

    // Verify participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId },
      select: { id: true }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Verify experience exists if provided
    if (experienceId) {
      const experience = await prisma.experience.findUnique({
        where: { id: experienceId },
        select: { id: true }
      });

      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: userId,
            participant2Id: participantId,
            experienceId: experienceId || null
          },
          {
            participant1Id: participantId,
            participant2Id: userId,
            experienceId: experienceId || null
          }
        ]
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        }
      }
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: participantId,
          experienceId: experienceId || null
        },
        include: {
          participant1: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              email: true
            }
          },
          participant2: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              email: true
            }
          }
        }
      });
    }

    console.log('[Conversations] Conversation created/found:', conversation.id);
    res.json({ conversation: { id: conversation.id } });
  } catch (error) {
    console.error('[Conversations] Create conversation error:', error);
    console.error('[Conversations] Error stack:', error.stack);
    console.error('[Conversations] Error details:', {
      code: error.code,
      meta: error.meta,
      message: error.message,
      name: error.name
    });
    
    // Check if it's a Prisma unique constraint violation
    if (error.code === 'P2002') {
      // Conversation already exists - try to find it
      console.log('[Conversations] Conversation already exists (unique constraint), finding it...');
      try {
        const existing = await prisma.conversation.findFirst({
          where: {
            OR: [
              {
                participant1Id: req.user.id,
                participant2Id: req.body.participantId,
                experienceId: req.body.experienceId || null
              },
              {
                participant1Id: req.body.participantId,
                participant2Id: req.user.id,
                experienceId: req.body.experienceId || null
              }
            ]
          }
        });
        if (existing) {
          return res.json({ conversation: { id: existing.id } });
        }
      } catch (findError) {
        console.error('[Conversations] Error finding existing conversation:', findError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to create conversation',
      message: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: {
          code: error.code,
          meta: error.meta,
          name: error.name
        }
      })
    });
  }
});

// Send a message in a conversation
router.post('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create message
    const newMessage = await prisma.conversationMessage.create({
      data: {
        conversationId: id,
        senderId: userId,
        message: message.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() }
    });

    const formatted = {
      id: newMessage.id,
      message: newMessage.message,
      senderId: newMessage.senderId,
      senderName: `${newMessage.sender.firstName || ''} ${newMessage.sender.lastName || ''}`.trim() || 'User',
      senderAvatar: newMessage.sender.avatar || '/assets/images/global/hosts/placeholder.jpg',
      createdAt: newMessage.createdAt,
      read: newMessage.read,
      isOwn: true
    };

    // Emit realtime event to the other participant (if Socket.IO is enabled)
    try {
      const io = req.app?.get?.('io');
      if (io && conversation) {
        const otherUserId = conversation.participant1Id === userId ? conversation.participant2Id : conversation.participant1Id;
        io.to(`user:${otherUserId}`).emit('conversation_message', {
          conversationId: id,
          message: { ...formatted, isOwn: false }
        });
      }
    } catch (emitErr) {
      // Never fail the REST request due to socket issues
      console.error('Socket emit error:', emitErr);
    }

    res.status(201).json({ message: formatted });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;

