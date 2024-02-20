import React from "react"
import { Card, Form, Button, Alert } from "react-bootstrap";
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {auth, db } from "../config/firebase-config"
import {getAuth} from "firebase/auth"
import {useAuth} from "../Contexts/SeekerAuthContext"
import {useLocation, useNavigate } from "react-router-dom"
import {useState, useRef} from "react";

function SeekerChallenges()
{
    const location=useLocation();
    const navigate=useNavigate();
    const name= location.state?.fullName;
    const [images, setImages]= useState([]);
    const [isDragging, setIsDragging]=useState(false);
    const fileInputRef=useRef(null);
    const [seekerTxtChallenges, setSeekerTxtChallenges]=useState("");
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
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const usersCollection=collection(db, "Seekers");
            const docRef=doc(usersCollection, name);

            const seekerChallangeData={
                Challenge_txt: seekerTxtChallenges,
            };
            await setDoc(docRef, seekerChallangeData, {merge: true});
            navigate("/seekerEducation", {state: {fullName:name}});

        }
        catch(error){
            console.log("The error is: "+ error);
            console.error("ERROR: "+ error);
        }   
        
    }
    const handleChange=(e)=>{
        setSeekerTxtChallenges(e.target.value);
    }

    return(
        <>
        <h1>
            Challenges
        </h1>
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <label>
                        <input type="text" name="seekchallenges" onChange={handleChange} value={seekerTxtChallenges} placeholder="Type your challenges here..."/>
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


                    <Button type="submit"> Next</Button>
                </Form>
            </Card.Body>
        </Card>
        
        
        </>
    );
}
export default SeekerChallenges