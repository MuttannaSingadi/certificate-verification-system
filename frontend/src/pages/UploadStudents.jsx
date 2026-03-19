import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/upload.css";

export default function UploadStudents(){

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    if(!file){
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try{

      const res = await fetch("https://certificate-verification-system-tpcf.onrender.com/api/upload/students", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      alert(data.message || "Upload successful");

    }catch(error){
      console.log(error);
      alert("Upload failed");
    }
  };

  return(
    <>
      <Navbar/>

      <div className="upload-container">

        <h2>Upload Student Excel File</h2>

        <input type="file" onChange={handleFileChange} />

        <button onClick={handleUpload}>
          Upload
        </button>

      </div>
    </>
  )
}