const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const CloudConvert = require('cloudconvert');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// multer setup for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// CloudConvert client with your API key
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmEwZWU1ZDMwMWQ0ZmQwNGE4YTYzMGEyOTZiZWE3NmMwZWQ5YWU3NjI1ZDA1ZDQxYjE0MmE5MjA1ZmZkYjk2NWYwNzRjOWEyNWQzMDVlODUiLCJpYXQiOjE3NDg4NzU2NzYuOTQ5NTI0LCJuYmYiOjE3NDg4NzU2NzYuOTQ5NTI1LCJleHAiOjQ5MDQ1NDkyNzYuOTQ1NTk1LCJzdWIiOiI3MjEwMjE1MiIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.MahZyT4foVycpFzwT16GFLLxEWt7sphjlIkKCw_VyihN0njmKO5IIb4Rj5trGkhXsGbr7102VLGH4oBdEzUg6o7_xlXzaI4cCmjuzfNMo5ji-Wk5xrGvsBSZjMPJeptbH_wf4_r9T2RP0tKYBlLVHYMRXQcAMXFN0cM7lLfH1Kzjm9Gfu-VJysNhAtLOJxND4iKakvY5fuewA5UENOwcSNXm-8HGxd5Zvg-PS0sOHk_qko144_zCcoLptDC6P2N0Q9FCInOIn5kbP-Ee4kHNhsBXL9bUFrBD6KXnKLEn3KZGlRZ8AJg6T4DWPVZQS7-gBOI7omNoD7Mc4JZFJPxoEYjd_ST4KMm3cweZ1HuqVX8c8R-_la8BLjcyVyZLNjLh9lkgvGM85T5sUliKqtrV5x7QpiSkrS3HMqmYzUZb-zl9ypO05kCrKZRcdahrZ2auL0IL0nIevxGI_SBETM9vN62j_jN2cHTGyCUNjlz7zmlUeVTtnhHYlp5d1u4Urf2o3Vk1006u3L5W-txK_fTBHG3To8dpc0NK99GQPtmdgkYq3jg8ZIpgrUNz0AukeNZ1yz3-yte4HSV_AYnARF3yOamkbVfW1vimKdHiVUK08sWtAOctjUFBCkQeyaG9LgGLF1WzXpwPnUHZ09NKpGgQUPYNDS1PJjT2X8gQ0-d8jow');

app.post('/convertFile', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // 1. Create job with import, convert, export tasks
    const job = await cloudConvert.jobs.create({
      tasks: {
        'import-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          input_format: 'docx',
          output_format: 'pdf'
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    });

    // 2. Get the upload task info
    const uploadTask = job.tasks.find(task => task.name === 'import-file');

    // 3. Upload the file
    await cloudConvert.tasks.upload(uploadTask, req.file.path);

    // 4. Wait for job completion
    const completedJob = await cloudConvert.jobs.wait(job.id);

    // 5. Get export URL of converted PDF
    const exportTask = completedJob.tasks.find(
      task => task.operation === 'export/url' && task.status === 'finished'
    );

    const fileUrl = exportTask.result.files[0].url;

    // 6. Send PDF URL to frontend
    res.json({ pdfUrl: fileUrl });

    // 7. Delete uploaded file to clean up
    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ message: 'Conversion failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
