import React from "react"
import { Card, Form, Button, Alert } from "react-bootstrap";
import {useState, useRef} from "react"
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {auth, db } from "../config/firebase-config"
import {useNavigate, useLocation} from "react-router-dom"

function SeekerSkills()
{
    const navigate=useNavigate();
    const location=useLocation();
    const name=location.state?.NameFull;
    const [images, setImages]= useState([]);
    const [isDragging, setIsDragging]=useState(false);
    const fileInputRef=useRef(null);
    const [SeekTxtSkills, setSeekTxtSkills]=useState("");
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

    async function handleSubmit (e){
        e.preventDefault();
        try{
            const usersCollection=collection(db, "Seekers");
            const docRef=doc(usersCollection, name);
            const seekerSkillsUpdatedData={
            Skills_txt: SeekTxtSkills,
        };
        await setDoc(docRef, seekerSkillsUpdatedData, {merge:true});

        navigate("/seekerChallenges", {state: {fullName: name}});
        }
        catch(error){
            console.log("The error is: "+ error);
            console.error("ERROR: "+ error);
        }
        

    }
    const handleChange=(e)=>{
        setSeekTxtSkills(e.target.value);
    }

    return(
        <>
        <h1>
            Skills
        </h1>
        <p>
            Include your skills. Do it in video or text format:
        </p>
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>

                    <label>
                        <input type="text" name="SeekerSkills" value={SeekTxtSkills} onChange={handleChange} placeholder="Type your skills here..."/>
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
export default SeekerSkills