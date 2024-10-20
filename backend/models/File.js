const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    storedFilename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    description: { type: String },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true, enum: ['document', 'image', 'video'] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
