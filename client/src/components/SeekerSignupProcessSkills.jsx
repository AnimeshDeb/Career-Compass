import React from "react"
import { Card, Form, Button, Alert } from "react-bootstrap";
import {useState} from "react"
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {auth, db } from "../config/firebase-config"
import {useNavigate, useLocation} from "react-router-dom"

function SeekerSkills()
{
    const navigate=useNavigate();
    const location=useLocation();
    const name=location.state?.NameFull;
    const [SeekTxtSkills, setSeekTxtSkills]=useState("");
    
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
                    <Button type="submit"> Next</Button>
                </Form>
            </Card.Body>
        </Card>
        
        </>
    );
}
export default SeekerSkills