const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ai_resume_analyzer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Analysis schema
const analysisSchema = new mongoose.Schema({
    filename: String,
    analysis: Object,
    uploadedAt: { type: Date, default: Date.now }
});
const Analysis = mongoose.model('Analysis', analysisSchema);

// Enable CORS for frontend requests
app.use(cors());

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// Resume analysis endpoint
app.post('/analyze', upload.single('resume'), async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Simulate AI analysis
    const analysis = {
        resumeLength: Math.floor(Math.random() * 2 + 1) + ' page(s)',
        skillsMatch: Math.floor(Math.random() * 100) + '%',
        keywordsFound: ['Leadership', 'Python', 'Communication'],
        suggestions: 'Add more quantifiable achievements.'
    };
    // Save to MongoDB
    try {
        await Analysis.create({
            filename: req.file.originalname,
            analysis
        });
    } catch (err) {
        console.error('Error saving analysis to MongoDB:', err);
    }
    res.json({ success: true, analysis });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});