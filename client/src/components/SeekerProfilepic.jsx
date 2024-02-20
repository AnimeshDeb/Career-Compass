import React, {useState, useRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Card, Form, Button, Alert} from "react-bootstrap";
import {collection, addDoc,getDocs, where, query, doc, setDoc} from "firebase/firestore";
import {db} from "../config/firebase-config";

function SeekerProfilepic(){
    const [images, setImages]= useState([]);
    const [isDragging, setIsDragging]=useState(false);
    const fileInputRef=useRef(null);
    const location=useLocation();
    const name=location.state?.fullName;
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const collectionRef=collection(db, "Seekers");
            const docRef=doc(collectionRef, name );
            const seekerProfilepicData={
                Pic_Data: images,

            }
            await setDoc(docRef, seekerProfilepicData, {merge: true});
        }
        catch(error){console.error("ERROR"+ error)}
    }
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