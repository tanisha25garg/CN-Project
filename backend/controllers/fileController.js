const File = require('../models/File');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const ensureUploadsDirExists = () => {
    const uploadsDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
};

exports.uploadFile = async (req, res) => {
    console.log("dsj");
    ensureUploadsDirExists(); // Ensure the uploads directory exists
    console.log("Sdsds");
    const { description } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, msg: 'No file uploaded' });
    }

    const storedFilename = req.file.filename;
    const originalFilename = req.file.originalname;
    const filePath = path.join(__dirname, '../uploads/', storedFilename);
    const fileExtension = path.extname(originalFilename).toLowerCase();
    let fileType = '';

    switch (fileExtension) {
        case '.pdf':
        case '.docx':
            fileType = 'document';
            break;
        case '.jpg':
        case '.jpeg':
        case '.png':
            fileType = 'image';
            break;
        case '.mp4':
        case '.mkv':
            fileType = 'video';
            break;
        default:
            return res.status(400).json({ success: false, msg: 'Unsupported file type' });
    }

    try {
        const newFile = new File({
            storedFilename,
            originalFilename,
            description,
            size: req.file.size,
            filePath,
            fileType,
            owner: req.user.id,
        });

        await newFile.save();
        return res.status(201).json({ success: true, msg: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error('Error uploading file:', error);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file after upload failure:', err);
        });
        return res.status(500).json({ success: false, error: 'Failed to upload file' });
    }
};

exports.listFiles = async (req, res) => {
    try {
        const files = await File.find().populate('owner', 'username');
        return res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.downloadFile = async (req, res) => {
    const fileId = req.params.id;

    try {
        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ success: false, msg: 'File not found' });

        res.download(file.filePath, file.originalFilename, (error) => {
            if (error) {
                console.error('Error downloading file:', error);
                return res.status(500).json({ success: false, msg: 'Error downloading file' });
            }
        });
    } catch (error) {
        console.error('Error in downloadFile:', error);
        return res.status(500).json({ success: false, error: 'Server error during download' });
    }
};

exports.searchFiles = async (req, res) => {
    const { searchQuery, fileType } = req.query;

    try {
        let searchConditions = {};

        if (searchQuery) {
            searchConditions.$or = [
                { originalFilename: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        if (fileType) {
            searchConditions.fileType = fileType;
        }

        const files = await File.find(searchConditions).populate('owner', 'username');

        return res.status(200).json(files.length ? files : []);
    } catch (error) {
        console.error('Error searching files:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
