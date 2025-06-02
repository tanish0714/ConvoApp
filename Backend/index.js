const express = require('express')
const multer = require('multer')
const docxConverter = require('docx-pdf');
const path = require('path')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())

const storage = multer.diskStorage({   
  destination:function(req,file,cb){
      cb(null,'uploads')
  },
  filename:function(req,file,cb){
      cb(null,file.originalname)
  }
})
const upload = multer({storage:storage})

// API route
app.post('/convertFile', upload.single('file'), function(req, res, next){
  try {
    if(!req.file){
        return res.status(400).json({ message:"No file uploaded" })
    }    
    let outputPath = path.join(__dirname, 'files', `${req.file.originalname}.pdf`)
    docxConverter(req.file.path, outputPath, function(err, result){
      if(err){
        console.log(err);
        return res.status(500).json({message:"Error converting docx to pdf"})
      }
      res.download(outputPath, ()=>{
        console.log("File downloaded successfully"); 
      })
    });
  } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal server error"})
  }
})

// Serve static React files from 'frontend/dist'
app.use(express.static(path.join(__dirname, 'frontend', 'dist')))

// For all other routes, send React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
