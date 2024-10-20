// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// const cors = require('cors');
// const http = require('http');
// const socketio = require('socket.io');
// const { startTCPServer } = require('./tcpServer');

// dotenv.config();

// const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
// }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// const connectDB = async () => {
//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error('MONGO_URI is not defined');
//         }
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB connected');
//     } catch (error) {
//         console.error('MongoDB connection error:', error.message);
//         process.exit(1);
//     }
// };

// connectDB();

// app.use(passport.initialize());
// require('./middleware/passport')(passport);

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const fileRoutes = require('./routes/fileRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/files', fileRoutes);

// // Error handling middleware should be placed after route definitions
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ success: false, msg: 'Internal Server Error' });
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = socketio(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//         credentials: true,
//     }
// });

// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('shareFileMetadata', (fileMetadata) => {
//         console.log('File metadata received:', fileMetadata);
//         socket.broadcast.emit('fileMetadata', fileMetadata);
//     });

//     socket.on('discoverPeers', () => {
//         socket.emit('peers', Array.from(io.sockets.sockets.keys()));
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// // Start TCP server
// startTCPServer();

// // Start servers
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // Graceful shutdown
// const shutdown = () => {
//     console.log('Shutting down servers...');
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const { startTCPServer } = require('./tcpServer');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Initialize Passport
app.use(passport.initialize());
require('./middleware/passport')(passport);

// Import routes
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Error handling middleware for routes
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, msg: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('shareFileMetadata', (fileMetadata) => {
        console.log('File metadata received:', fileMetadata);
        socket.broadcast.emit('fileMetadata', fileMetadata);
    });

    socket.on('discoverPeers', () => {
        socket.emit('peers', Array.from(io.sockets.sockets.keys()));
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start TCP server
startTCPServer();

// Start HTTP server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
    console.error('Error starting server:', error);
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down servers...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
