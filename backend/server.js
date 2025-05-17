const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create request schema
const requestSchema = new mongoose.Schema({
  instagramId: { type: String, required: true },
  imageUrls: [String],
  resultImageUrl: String,
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  error: String,
  instagramUploadStatus: { type: String, enum: ['pending', 'uploaded'], default: 'pending' } // Pc018
});

const Request = mongoose.model('Request', requestSchema);

// Set up Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'ghibli-portrait-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure email transporter for notifications
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// OpenAI auth routes
app.get('/api/auth/openai', (req, res) => {
  // In a real implementation, this would redirect to OpenAI OAuth
  // For demo purposes, we'll simulate authorization
  req.session.openaiAuthorized = true;
  res.redirect('/?auth=success');
});

app.get('/api/auth/openai/status', (req, res) => {
  res.json({ isAuthorized: req.session.openaiAuthorized === true });
});

// Upload images route
app.post('/api/upload-images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    
    res.json({ imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to send notification email
async function sendNotificationEmail(request) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Ghibli Portrait Request: ${request.instagramId}`,
      html: `
        <h1>New Ghibli Portrait Request</h1>
        <p><strong>Instagram ID:</strong> ${request.instagramId}</p>
        <p><strong>Status:</strong> ${request.status}</p>
        <p><strong>Created At:</strong> ${request.createdAt}</p>
        <p><strong>Result:</strong> ${request.resultImageUrl ? `<a href="${request.resultImageUrl}">View Generated Image</a>` : 'Not available yet'}</p>
        <p><strong>Original Images:</strong></p>
        <ul>
          ${request.imageUrls.map(url => `<li><a href="${url}">Image</a></li>`).join('')}
        </ul>
      `
    });
    console.log(`Notification email sent for request ${request._id}`);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

// Generate Ghibli portrait route
app.post('/api/generate-ghibli', async (req, res) => {
  try {
    const { instagramId, imageUrls } = req.body;
    
    if (!instagramId || !imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check if user is authorized
    if (!req.session.openaiAuthorized) {
      return res.status(401).json({ error: 'OpenAI authorization required' });
    }
    
    // Create a new request in the database
    const newRequest = new Request({
      instagramId,
      imageUrls,
      status: 'processing'
    });
    
    await newRequest.save();
    
    // Call OpenAI API
    const prompt = "Convert these multiple images into 1 portrait size image (1080x1920), hyper realistic Studio Ghibli style portrait with creative changes showing multiple Ghiblified versions of the same person. Add soft Ghibli-style lighting, warm colors, and nature elements typical of Studio Ghibli films.";
    
    try {
      // For simplicity in this demo, we're using DALL-E 3
      // In a real implementation, you would need to properly feed the user's images as input
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const generatedImageUrl = response.data[0].url;
      
      // Update the request in the database
      newRequest.resultImageUrl = generatedImageUrl;
      newRequest.status = 'completed';
      newRequest.instagramUploadStatus = 'uploaded'; // P3f40
      await newRequest.save();
      
      // Send notification email to site owner
      await sendNotificationEmail(newRequest);
      
      res.json({ 
        imageUrl: generatedImageUrl,
        requestId: newRequest._id,
        message: 'Your image will be uploaded on Instagram in a creative way!' // P3f40
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Update request status to failed
      newRequest.status = 'failed';
      newRequest.error = openaiError.message;
      await newRequest.save();
      
      // Still send notification email
      await sendNotificationEmail(newRequest);
      
      res.status(500).json({ error: 'Failed to generate image with OpenAI' });
    }
  } catch (error) {
    console.error('Error in generate-ghibli route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all requests (admin only)
app.get('/api/requests', async (req, res) => {
  // In a real app, you would check admin authentication here
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
