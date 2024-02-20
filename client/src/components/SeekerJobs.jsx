import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {collection, addDoc, getDocs, where, query, doc, setDoc} from 'firebase/firestore';
import {db} from "../config/firebase-config"
import { Card, Form, Button, Alert } from "react-bootstrap";

function SeekerJobs() {
  const [jobLocation, setJobLocation] = useState("");
  const [jobName, setJobName] = useState("");
  const location=useLocation();
  const name=location.state?.fullName;
  const navigate=useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try{
        const collectionRef=collection(db, "Seekers");
        const docRef=doc(collectionRef, name);
        const jobSubcollection=collection(docRef, "Jobs");
        await addDoc(jobSubcollection, {
            Job_Name: jobName,
            Job_location: jobLocation,
        });
        navigate("/SeekerProfilepic", {state: {fullName: name}});
    }
    catch(error){
        console.error("ERROR: "+ error);
    }
    
  
   




  }
  function handleChange(e) {
    setJobName(e.target.value);
  }
  function jobLocationHandleChange(e) {
    setJobLocation(e.target.value);
  }
  return (
    <>
      <h1>Your Jobs</h1>
      <p>What jobs have you done in the past?</p>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="jobName">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                value={jobName}
                placeholder="What is the name of your jobs?"
              />
            </Form.Group>
            <Form.Group id="jobLocation">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                onChange={jobLocationHandleChange}
                value={jobLocation}
                placeholder="What is the location of your job?"
              />
            </Form.Group>
            <button onSubmit={handleSubmit}> Next </button>
          </Form>
        </Card.Body>
      </Card>
      
    </>
  );
}
export default SeekerJobs;
