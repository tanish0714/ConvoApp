const express = require('express')
const multer = require('multer')
const docxConverter = require('docx-pdf');
const app = express()
const path = require('path')
const port = 3000
const cors = require('cors')
app.use(cors())
const storage = multer.diskStorage({   // setting up storage file
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})
app.post('/convertFile',upload.single('file'),function(req,res,next){
    try {
    if(!req.file){
        return res.status(400).json({
            message:"No file uploaded"
        })
    }    
        let outputPath = path.join(__dirname,'files',`${req.file.originalname}.pdf`)
        docxConverter(req.file.path,outputPath,function(err,result){
  if(err){
    console.log(err);
    return res.status(500).json({message:"Error converting docx to pdf"})
  }
  res.download(outputPath,()=>{
    console.log("File downloaded successfully"); 
  })
  
});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})