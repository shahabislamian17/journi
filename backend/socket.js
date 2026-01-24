const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || process.env.ALLOWED_ORIGIN || true,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

      if (!token) return next(new Error('Unauthorized'));
      if (!process.env.JWT_SECRET) return next(new Error('Server misconfigured'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id, email: decoded.email, role: decoded.role };
      return next();
    } catch (err) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('disconnect', () => {
      // no-op
    });
  });

  // Allow routes to emit events
  if (app && typeof app.set === 'function') {
    app.set('io', io);
  }

  return io;
}

module.exports = { initSocket };


