import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  setDoc,
} from "firebase/firestore";
import PropTypes from "prop-types";
function SeekerEducation({handleNextStep, handlePrevStep, name}) {
  const navigate = useNavigate();
  const [seekerSchoolNameTxt, setSeekerSchoolNameTxt] = useState("");
  const [seekerMajor, setSeekerMajor] = useState("");
  const [seekerEducationTypeTxt, setSeekerEducationTypeTxt] = useState("");
  const [seekerGraduating, setSeekerGraduating] = useState("");
  const location = useLocation();
  // const name = location.state?.fullName;

  const handleChangeSchool = (e) => {
    setSeekerSchoolNameTxt(e.target.value);
  };
  const handleChangeMajor = (e) => {
    setSeekerMajor(e.target.value);
  };
  const handleChangeEducationType = (e) => {
    setSeekerEducationTypeTxt(e.target.value);
  };
  const handleChangeGraduating = (e) => {
    setSeekerGraduating(e.target.value);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const usersCollection = collection(db, "Seekers");
      const docRef = doc(usersCollection, name);
      const educationSubcollectionRef = collection(docRef, "Education");
      await addDoc(educationSubcollectionRef, {
        University: seekerSchoolNameTxt,
        DegreeType: seekerEducationTypeTxt,
        ClassOf: seekerGraduating,
        Major: seekerMajor,
      });
      // await setDoc(educationSubcollectionRef, seekerEducationData, {merge: true});
      handleNextStep();
      // navigate("/SeekerJobs", { state: { fullName: name } });
    } catch (error) {
      console.log("The error is: " + error);
      console.error("ERROR: " + error);
    }
  }
  return (
    <>
      <h1>Education</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="schoolName">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="Type in your university name... "
                value={seekerSchoolNameTxt}
                onChange={handleChangeSchool}
                required
              />
            </Form.Group>
            <Form.Group id="educationType">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="What degree are you going for..."
                value={seekerEducationTypeTxt}
                onChange={handleChangeEducationType}
                required
              />
            </Form.Group>
            <Form.Group id="grade">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="When are you graduating..."
                value={seekerGraduating}
                onChange={handleChangeGraduating}
                required
              />
            </Form.Group>
            <Form.Group id="major">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="What is your major..."
                value={seekerMajor}
                onChange={handleChangeMajor}
                required
              />
            </Form.Group>
            <Button type="text"  onClick={()=>handlePrevStep()}> Back</Button>
            <Button type="submit"> Next</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

SeekerEducation.propTypes={
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerEducation;
