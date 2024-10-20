const express = require('express');
const router = express.Router();
const { uploadFile, listFiles, downloadFile, searchFiles } = require('../controllers/fileController');
const passport = require('passport');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @route POST /api/files/upload
// @desc Upload a new file's metadata
router.post('/upload', passport.authenticate('jwt', { session: false }), upload.single('file'), asyncHandler(uploadFile));

// @route GET /api/files
// @desc List all shared files
router.get('/', asyncHandler(listFiles));

// @route GET /api/files/:id/download
// @desc Download a specific file by ID
router.get('/:id/download', passport.authenticate('jwt', { session: false }), asyncHandler(downloadFile));

// @route GET /api/files/search
// @desc Search for files by name, type, or description
router.get('/search', passport.authenticate('jwt', { session: false }), asyncHandler(searchFiles));

module.exports = router;
