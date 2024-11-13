const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://tanishagarg2503:tanisha@cluster0.uwwrq.mongodb.net/P2PFileShare?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.send('P2P LAN File Sharing System');
});

// Socket.io connection
const peers = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register-peer', ({ peerId }) => {
    peers[peerId] = socket.id;
    console.log(`Peer registered: ${peerId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const peerId in peers) {
      if (peers[peerId] === socket.id) {
        delete peers[peerId];
        console.log(`Peer unregistered: ${peerId}`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
