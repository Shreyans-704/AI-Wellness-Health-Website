import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// Configure multer for file uploads with proper storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed') as any);
    }
  }
});

// Environment check (safe)
console.log('🔍 Environment Debug:');
console.log('🔑 GEMINI_API_KEY loaded:', Boolean(process.env.GEMINI_API_KEY));

// TODO: Initialize Gemini API here (without logging the key itself)
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// PDF Analysis endpoint
app.post('/api/analyze-pdf', upload.single('pdf'), async (req, res) => {
  try {
    console.log('=== PDF ANALYSIS START ===');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ File received:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    const filePath = req.file.path;

    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found at path:', filePath);
      const altPath = path.join(uploadsDir, req.file.filename);
      console.log('🔄 Trying alternative path:', altPath);
      
      if (fs.existsSync(altPath)) {
        console.log('✅ File found at alternative path');
        await processPDF(altPath, res);
      } else {
        const files = fs.readdirSync(uploadsDir);
        console.log('📁 Files in uploads directory:', files);
        
        return res.status(500).json({ 
          error: 'File upload succeeded but file cannot be accessed',
          debug: {
            expectedPath: filePath,
            alternativePath: altPath,
            uploadsDir: uploadsDir,
            filesInDir: files
          }
        });
      }
    } else {
      console.log('✅ File exists at path');
      await processPDF(filePath, res);
    }

  } catch (error) {
    console.error('❌ Error in PDF analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze PDF', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Function to process PDF (placeholder)
async function processPDF(filePath: string, res: express.Response) {
  try {
    console.log('📄 Processing PDF at:', filePath);
    const fileBuffer = fs.readFileSync(filePath);
    console.log('✅ File read successfully, size:', fileBuffer.length, 'bytes');
    
    res.json({
      success: true,
      message: 'PDF processed successfully',
      fileSize: fileBuffer.length,
    });
    
  } catch (error) {
    console.error('❌ Error processing PDF:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uploadsDir: uploadsDir,
    uploadsExists: fs.existsSync(uploadsDir),
    dirname: __dirname
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📍 Server directory: ${__dirname}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

export default app;
