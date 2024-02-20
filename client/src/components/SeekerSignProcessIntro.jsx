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
import { auth, db } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import { useAuth } from "../Contexts/SeekerAuthContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styling/UploadImages.css"
function SeekerIntro() {
  const navigate = useNavigate();
  const [seekerTxtIntro, setSeekerTxtIntro] = useState("");
  const location = useLocation();
  const name = location.state?.fullName;
  console.log("fullName value is: " + name);
  const [images, setImages]= useState([]);
  const [isDragging, setIsDragging]=useState(false);
  const fileInputRef=useRef(null);
  const { currentUser } = useAuth();

  // const user=auth.currentUser
    function selectFiles(){
        fileInputRef.current.click();
    }
    function onFileSelect(e){
        const files=e.target.files;
        if(files.length===0)return;
        for(let i=0; i<files.length;i++){
            
            
                setImages((prevImages)=>[
                ...prevImages,
                    {name: files[i].name,
                    url: URL.createObjectURL(files[i]),
                        
                    },
                    ]);
            
        }
    }
    function deleteImage(index){
        setImages((prevImages)=>
            prevImages.filter((_,i)=>i !==index)
        );
    }

    function onDragOver(e){
      e.preventDefault();
      setIsDragging(true);
      e.dataTransfer.dropEffect="copy"
    }
    function onDragLeave(e){
      e.preventDefault();
      setIsDragging(false);
    }

    function onDrop(e){
      e.preventDefault();
      setIsDragging(false);
      const files=e.dataTransfer.files;
      for(let i=0; i<files.length;i++){
        
            setImages((prevImages)=>[
            ...prevImages,
                {name: files[i].name,
                url: URL.createObjectURL(files[i]),
                    
                },
                ]);
        
    }
    }

    function uploadImage(){
      console.log("Images: ", images);
    }


  async function handleSubmit(e) {

    e.preventDefault();
    try {
      const usersCollection = collection(db, "Seekers");
      const docRef = doc(usersCollection, name);

      const seekerIntroUpdatedData = {
        introduction: seekerTxtIntro,
      };
      await setDoc(docRef, seekerIntroUpdatedData, { merge: true });
      navigate("/seekerSkills", { state: { NameFull: name } });
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
                
                value={seekerTxtIntro}
                onChange={handleChange}
                placeholder="Type your introduction here..."
              />
            </label>
            
            <div className="card2">
              <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                    <span className="select">Drop images here </span>

                ): (

                    <>
                        Drag & Drop image here or <span className="select" role="button" onClick={selectFiles}>Browse</span>

                    </>
                )}
                
                <input name="file" type="file" multiple ref={fileInputRef} onChange={onFileSelect} className="file" />
              </div>
              <div className="container">
                {images.map((images, index)=>(
                    <div className="image" key={index}>
                    <span className="delete" onClick={()=>deleteImage(index)}> &times; </span>
                  
                  <img src={images.url} alt={images.name}/>
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

export default SeekerIntro;
