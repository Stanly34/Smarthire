require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const server = http.createServer(app);

// CORS origins
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/coding', require('./routes/coding'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/skills', require('./routes/skills'));

// Socket.io – real-time chat
const onlineUsers = new Map(); // userId -> socketId

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);
  io.emit('users_online', Array.from(onlineUsers.keys()));

  socket.on('send_message', async ({ receiver_id, content }) => {
    if (!content || !receiver_id) return;
    try {
      // Persist message to database so history survives page refresh
      const result = await db.query(
        'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1,$2,$3) RETURNING *',
        [userId, parseInt(receiver_id), content]
      );
      const savedMessage = result.rows[0];
      const message = {
        ...savedMessage,
        sender_id: userId,
        receiver_id: parseInt(receiver_id),
        content,
        sent_at: savedMessage.sent_at,
      };
      // Emit to receiver if online
      const receiverSocketId = onlineUsers.get(parseInt(receiver_id));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
      // Confirm back to sender
      socket.emit('message_sent', message);
    } catch (err) {
      console.error('Socket send_message error:', err);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    io.emit('users_online', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SmartHire backend running on http://localhost:${PORT}`);
});
