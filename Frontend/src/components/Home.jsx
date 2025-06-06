import React, { useState } from 'react'
import { FaFileWord } from "react-icons/fa";
import toast from 'react-hot-toast'
import axios from 'axios'

const Home = () => {
  const [select,setSelect] = useState(null)
  const [convert,setConvert] = useState("")
  const [downloadError,setDownloadError]= useState("")
  const handleFile = (e)=>{
    //console.log(e.target.files[0])
    setSelect(e.target.files[0])
  }
  const handleSubmit = async (event) => {
  event.preventDefault();
  if (!select) {
    setConvert("Please select a file");
    return;
  }
  setConvert("Converting...");
  setDownloadError("");
  const formData = new FormData();
  formData.append('file', select);

  try {
    const response = await axios.post(
      "https://convoapp-817f.onrender.com/convertFile",
      formData
    );
    const pdfUrl = response.data.pdfUrl;
    if (!pdfUrl) throw new Error("No PDF URL returned");

    // Download PDF by creating a temporary link
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', select.name.replace(/\.[^/.]+$/, "") + '.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();

    setSelect(null);
    setConvert("File Converted Successfully");
    setDownloadError("");
  } catch (error) {
    console.error(error);
    setConvert("");
    if (error.response && error.response.status === 400) {
      setDownloadError("Error occurred: " + error.response.data.message);
    } else {
      setDownloadError("Conversion failed. Please try again.");
    }
  }
};

  return (
    <>
      <div className='max-w-screen-2xl mx-auto container px-4 md:px-40'>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='border-2 border-solid  px-4 py-6 md:px-8 md:py-10 border-b-black rounded-xl w-full max-w-xl'>
            <h1 className='text-2xl sm:text-3xl font-bold text-center mb-4'>
              Convert Word to PDF Online
            </h1>
            <p className='text-sm sm:text-base text-center mb-6'>
              Easily convert Word documents to PDF format online
            </p>

            <div className='flex flex-col items-center space-y-5'>
              <input className='hidden' id='file' onChange={handleFile} accept='.doc,.docx' type="file" />
              <label
                htmlFor="file"
                className='w-full flex items-center justify-center px-4 py-4 sm:py-6 bg-gray-100 text-gray-900 rounded-lg shadow cursor-pointer hover:text-white border border-blue-300 hover:bg-blue-700 duration-300 font-semibold text-base sm:text-xl'
              >
                <FaFileWord className='text-2xl sm:text-3xl mr-3' />
                <span className='text-3xl mr-2'>{select?select.name:"Choose File"}</span>
              </label>
              
              <button onClick={handleSubmit} disabled={!select} className='w-full sm:w-auto px-4 py-2 disabled:bg-gray-400 disabled:pointer-events-none bg-yellow-400 hover:bg-green-400 duration-200 font-semibold text-sm sm:text-base rounded-md'>
                Convert File
              </button>
              {convert && (<div className='text-green-500 text-center'>{convert}</div>)}
              {downloadError && (<div className='text-red-500 text-center'>{downloadError}</div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
