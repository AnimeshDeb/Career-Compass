import React from "react"
import { Card, Form, Button, Alert } from "react-bootstrap";
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {auth, db } from "../config/firebase-config"
import {getAuth} from "firebase/auth"
import {useAuth} from "../Contexts/SeekerAuthContext"
import {useLocation, useNavigate } from "react-router-dom"
import {useState} from "react";

function SeekerChallenges()
{
    const location=useLocation();
    const navigate=useNavigate();
    const name= location.state?.fullName;
    const [seekerTxtChallenges, setSeekerTxtChallenges]=useState("");

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
                    <Button type="submit"> Next</Button>
                </Form>
            </Card.Body>
        </Card>
        
        
        </>
    );
}
export default SeekerChallenges