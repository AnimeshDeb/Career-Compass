import React, {useState} from "react"
import { Card, Form, Button, Alert } from "react-bootstrap";
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {auth, db } from "../config/firebase-config"
import {getAuth} from "firebase/auth"
import {useAuth} from "../Contexts/SeekerAuthContext"
import {useLocation } from "react-router-dom"
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
function SeekerIntro(){
    const navigate=useNavigate();
    const [seekerTxtIntro, setSeekerTxtIntro]=useState("");
    const location=useLocation();
    const name=location.state?.fullName;
    console.log("fullName value is: "+ name);
    const {currentUser}=useAuth();

    // const user=auth.currentUser
    
   async function handleSubmit(e){
        e.preventDefault();
        try{
            const usersCollection=collection(db, "Seekers");
            const docRef=doc(usersCollection, name);
            
            const seekerIntroUpdatedData={
                Intro_txt: seekerTxtIntro,
            };
            await setDoc(docRef,seekerIntroUpdatedData, {merge: true} );
            navigate("/seekerSkills", {state: {NameFull: name}});
        }
        catch(error){
            console.error("ERROR: ", error);
            console.log("the error is:"+ error);
        }
    }
    const handleChange= (e)=> {
        setSeekerTxtIntro(e.target.value);

    }
   
    return(
        <>
        <h1>
            Introductions
        </h1>
        <p>
            Introduce yourself with text or a video. Perhaps both.

        </p>
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <label>
                        <input type="text" name="seekerIntroInput" value={seekerTxtIntro} onChange={handleChange} placeholder="Type your introduction here..." />
                    </label>
                 <Button type="submit">Next</Button> 
                </Form>
            </Card.Body>
        </Card>
        
        </>
    );
}

export default SeekerIntro;