import React, { useState, useRef } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styling/UploadImages.css";
import { useAuth } from "../Contexts/SeekerAuthContext";
import {storage} from "../firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import PropTypes from "prop-types";

function SeekerIntro({handleNextStep, name}) {
  const navigate = useNavigate();
  const [seekerTxtIntro, setSeekerTxtIntro] = useState("");
  const location = useLocation();
  // const name = location.state?.fullName;
  console.log("fullName value is: " + name);
  const [images, setImages]= useState([]);
  const [isDragging, setIsDragging]=useState(false);
  const fileInputRef=useRef(null);
  const { currentUser } = useAuth();
  const [imageUpload, setImageUpload]=useState(null);
  const imgMetaData={contentType: "image/jpeg"};
  const [mode, setMode]=useState();
  const usersCollection = collection(db, "Seekers");
  console.log("name is: "+ name);
  const docRef = doc(usersCollection, name);
  

  // const user=auth.currentUser
    function selectFiles(){
        fileInputRef.current.click();
    }
    function onFileSelect(e){
      setImageUpload(e.target.files[0]);
        const files=e.target.files;
        if(files.length===0)return;
        
        const file=files[0];
      
            
            
                setImages((prevImages)=>[
                ...prevImages,
                    {name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                        
                    },
                    ]);
          fileInputRef.current.disabled=true;
            
        
    }
    function deleteImage(index){
        setImages((prevImages)=>
            prevImages.filter((_,i)=>i !==index)
        );

        fileInputRef.current.disabled=false;
    }

    function onDragOver(e){
      e.preventDefault();
      if(images.length===0){
        setIsDragging(true);
        e.dataTransfer.dropEffect="copy";
      }

      
    }
    function onDragLeave(e){
      e.preventDefault();
      if(images.length===0){
        setIsDragging(false);
      }
      
    }

    function onDrop(e){
      e.preventDefault();
      if(images.length===0){
        setIsDragging(false);
        const files=e.dataTransfer.files;
        setImageUpload(files[0]);
        
        setImages((prevImages)=>[
          ...prevImages,
              {name: files[0].name,
              url: URL.createObjectURL(files[0]),
                  
              },
              ]);
  fileInputRef.current.disabled=true;
  setMode("video");
  console.log("value of image is "+ imageUpload);
      }
    }

    function uploadImage(){
      console.log("Images: ", images);
      if(imageUpload===null) return;
      const imageRef=ref(storage, `Users/Seekers/ ${name}/${imageUpload.name+ v4()}`);
      console.log("Image upload value is: "+ imageUpload);
      
      uploadBytes(imageRef, imageUpload)
      .then((snapshot)=>{//promise returns the image and we get the reference to that image
        return getDownloadURL(snapshot.ref);// we use return to get the download url
        // and by using return we can allow the second .then below to have access to the returned data
      })
      .then((downloadURL)=>{//
        console.log("Download url:"+ downloadURL);
        alert("image uploaded successfully");
        const seekerIntroVidData={
          introduction: downloadURL,
        }
        if(mode==="video"){
          setDoc(docRef, seekerIntroVidData, {merge:true});
        }
        
      })
  
    }
function handleTextClick(){
  setMode("text");
}
function handleVideoClick(){
  setMode("video");
}
   
  async function handleSubmit(e) {

    e.preventDefault();
    try {
      

      const seekerIntroUpdatedData = {
        introduction: seekerTxtIntro,
      };
      if(mode==="text")
      {
        await setDoc(docRef, seekerIntroUpdatedData, { merge: true });
      }
      handleNextStep();

      // navigate("/seekerSkills", { state: { NameFull: name } });
    } catch (error) {
      console.error("ERROR: ", error);
      console.log("the error is:" + error);
    }
  }
  const handleChange = (e) => {
    setSeekerTxtIntro(e.target.value);
  };
 
  return (
    <>
      <h1>Introductions</h1>
      <p>Introduce yourself with text or a video. Perhaps both.</p>
      
      <Card>
        <Card.Body>

          <Form onSubmit={handleSubmit}>
            
            <label className="introtxt">
              <input
                type="text"
                name="seekerIntroInput"
                onClick={handleTextClick}
                value={seekerTxtIntro}
                onChange={handleChange}
                placeholder="Type your introduction here..."
              />
            </label>
            
            <div className="card2" onClick={handleVideoClick}>
              <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                    <span className="select">Drop files here </span>

                ): (

                    <>
                        Drag & Drop files here or <span className="select" role="button" onClick={selectFiles}>Browse</span>

                    </>
                )}
                
                <input name="file" type="file"   ref={fileInputRef}  onChange={onFileSelect} className="file" />
              </div>
              <div className="container">
                {images.map((images, index)=>(
                    <div className="image" key={index}>
                    <span className="delete" onClick={()=>deleteImage(index)}> &times; </span>
                    {images.type && images.type.includes("video") ? ( // Check if it's a video
        <video controls>
          <source src={images.url} type={images.type} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={images.url} alt={images.name} />
      )}
    </div>
                ))}
                
              </div>
              <button type="button" onClick={uploadImage}>Upload</button>
            </div>
            <Button type="submit">Next</Button>
          </Form>
         
        </Card.Body>
      </Card>
    </>
  );
}

SeekerIntro.propTypes={
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SeekerIntro;