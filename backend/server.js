const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const userRoutes = require('./apis/user');
const statusUpdateRoutes = require('./apis/statusUpdate');
const authenticateToken = require('./apis/authenticateToken'); // Assuming this middleware is correctly implemented

const app = express();

// MongoDB connection
const mongoDBEndpoint = process.env.MONGODB_URI || 'mongodb+srv://rachelrcx:mongodb123@neu.y5dq9xd.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected & listening on port'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/statusUpdate', statusUpdateRoutes);

// Serve static files from the React frontend app
let frontendDir = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendDir));

// Catch all other routes and return the index file (for supporting SPA routing)
app.get('*', (req, res) => {
    //res.sendFile(path.join(frontendDir, 'index.html'));
    res.json({ message: 'Hello from server!' });
});

// Listen on the provided port, on all network interfaces.
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
