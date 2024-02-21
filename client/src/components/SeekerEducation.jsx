import React, {useState} from "react"
import {Card, Form, Button} from "react-bootstrap"
import {useNavigate, useLocation} from "react-router-dom"
import {auth, db } from "../config/firebase-config"
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';


function SeekerEducation()
{
    const navigate=useNavigate();
    const [seekerSchoolNameTxt, setSeekerSchoolNameTxt ]= useState(""); 
    const [seekerLocation, setSeekerLocation]= useState("");
    const [seekerEducationTypeTxt, setSeekerEducationTypeTxt]=useState("");
    const [seekerGrade, setSeekerGrade]=useState("");
    const location=useLocation();
    const name=location.state?.fullName;
    
    const handleChangeSchool=(e)=>
    {
        setSeekerSchoolNameTxt(e.target.value);
    }
    const handleChangeLocation=(e)=>
    {
        setSeekerLocation(e.target.value);
    }
    const handleChangeEducationType=(e)=>{
        setSeekerEducationTypeTxt(e.target.value);
    }
    const handleChangeGrade=(e)=>{
        setSeekerGrade(e.target.value);
    }
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const usersCollection=collection(db, "Seekers");
            const docRef=doc(usersCollection, name);
            const educationSubcollectionRef=collection(docRef, "Education");
            await addDoc(educationSubcollectionRef,{
                name: seekerSchoolNameTxt,
                level: seekerEducationTypeTxt,
                score: seekerGrade,
            });
            // await setDoc(educationSubcollectionRef, seekerEducationData, {merge: true});
            navigate("/SeekerJobs", {state: {fullName: name}});
        }
        catch(error){
            console.log("The error is: "+ error);
            console.error("ERROR: "+ error);
        }

    }
    return(
        <>
        
        <h1>
            Education
        </h1>
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="schoolName">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Type in your school name... " value={seekerSchoolNameTxt} onChange={handleChangeSchool} required/>
                    </Form.Group>
                    <Form.Group id="educationType">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Type in your education type..." value={seekerEducationTypeTxt} onChange={handleChangeEducationType} required/>
                    </Form.Group>
                    <Form.Group id="grade">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Type in your grade..." value={seekerGrade} onChange={handleChangeGrade} required/>
                    </Form.Group>
                    <Button type="submit"> Next</Button>
                </Form>
            </Card.Body>
        </Card>
        </>
    );
}
export default SeekerEducation