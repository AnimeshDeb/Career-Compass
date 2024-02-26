import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { auth, db } from "../firebase";
import "../styling/UploadImages.css";
import {storage} from "../firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";

function SeekerProfilepic(){
    const [images, setImages]= useState([]);
    const [isDragging, setIsDragging]=useState(false);
    const fileInputRef=useRef(null);
    const location=useLocation();
    const name=location.state?.fullName;
    const [imageUpload, setImageUpload]=useState(null);
    const imgMetaData={contentType: "image/jpeg"};
    const [mode, setMode]=useState();
    const usersCollection = collection(db, "Seekers");
    const docRef = doc(usersCollection, name);
    async function handleSubmit(e){
        e.preventDefault();
        try{
            
            
            await setDoc(docRef, seekerProfilepicData, {merge: true});
        }
        catch(error){console.error("ERROR", error.message)}
    }
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
        const seekerProfilepicData={
          PictureURL: downloadURL,
        }
        setDoc(docRef, seekerProfilepicData, {merge:true});
        
      });
      
    }
return(
    <>
    <h1>Put your profile picture</h1>
    <Card>
        <Card.Body>
        <Form onSubmit={handleSubmit}>
            
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
)
}

export default SeekerProfilepic