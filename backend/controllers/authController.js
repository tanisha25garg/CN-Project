const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to validate user input
const validateUserInput = (username, password) => {
    const errors = {};
    if (!username || username.length < 3) {
        errors.username = "Username must be at least 3 characters long.";
    }
    if (!password || password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
    }
    return errors;
};

// User registration
exports.register = async (req, res) => {
    const { username, password } = req.body;

    const errors = validateUserInput(username, password);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        const newUser = new User({ username, password: password });

        await newUser.save();
        return res.status(201).json({ success: true, msg: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
    }
};

// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const payload = { id: user.id, username: username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
    }
};
