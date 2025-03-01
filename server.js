const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
  pingTimeout: 60000, // Increase ping timeout to 60 seconds
  pingInterval: 25000, // Set ping interval to 25 seconds
  maxHttpBufferSize: 1e8, // Increase max buffer size to 100 MB
});

const { generateRtcToken, generateRtmToken } = require('./agoraTokenService');
require('dotenv').config();
const port = process.env.PORT || 3000;
app.use(express.json());

let socketCounter = 0;


app.post('/rtc-token', (req, res) => {
  const { channelName, uid, role, expireTime } = req.body;
  if (!channelName || !uid) {
    return res.status(400).json({ error: 'channelName and uid are required' });
  }

  const token = generateRtcToken(channelName, uid, role, expireTime);
  return res.json({ token });
});

app.post('/rtm-token', (req, res) => {
  const { uid, expireTime } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'uid is required' });
  }

  const token = generateRtmToken(uid, expireTime);
  return res.json({ token });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // update socketCounter on new connection
  socketCounter++;

  // Handle socket events : test
  socket.on('test', (data) => {
    console.log('Test event received:', data);
  });

  socket.on('stream_data', ({ type, data, candidate_id, session_id }) => {
    if (!data || !Buffer.isBuffer(data)) {
      console.error('Invalid data received:', {
        type,
        candidate_id,
        session_id,
      });
      return;
    }

    console.log({
      type,
      candidate_id,
      session_id,
      dataSize: data.length,
    });

    const filePath = `${type}_${candidate_id}_${session_id}_${socketCounter}.webm`;
    fs.appendFile(filePath, data, (err) => {
      if (err) {
        console.error('Error writing data to file', err);
      }
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  // Simulate server crash when 'crash' event is emitted
  socket.on('crash', () => {
    console.error('Simulating socket error...');
    const error = new Error('Simulated transport error');
    error.reason = 'transport error';
    socket.emit('error', error);
    socket.disconnect();
  });
});

// Enable keep-alive connections
server.on('connection', (socket) => {
  socket.setKeepAlive(true);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
