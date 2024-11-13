const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload a file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { description } = req.body;
    const file = new File({
      filename: req.file.originalname,
      filepath: req.file.path,
      description,
      uploadedBy: req.user.id,
    });

    await file.save();
    console.log('File uploaded successfully:', file);
    res.json(file);
  } catch (err) {
    console.error('Error uploading file:', err.message);
    res.status(500).send('Server error');
  }
});

// Get all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find().populate('uploadedBy', 'username');
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search files
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const files = await File.find({
      $or: [
        { filename: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).populate('uploadedBy', 'username');
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
