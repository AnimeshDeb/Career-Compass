import { useState } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Card, Form } from "react-bootstrap";
import PropTypes from "prop-types";
function SeekerJobs({ handleNextStep, handlePrevStep, name }) {
  const [jobLocation, setJobLocation] = useState("");
  const [jobName, setJobName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const collectionRef = collection(db, "Seekers");
      const docRef = doc(collectionRef, name);
      const jobSubcollection = collection(docRef, "Jobs");
      await addDoc(jobSubcollection, {
        Job_Name: jobName,
        Job_location: jobLocation,
      });
      handleNextStep();
      // navigate("/SeekerProfilepic", { state: { fullName: name } });
    } catch (error) {
      console.error("ERROR: " + error);
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
            <button type="text" onClick={() => handlePrevStep()}>
              Back
            </button>
            <button onSubmit={handleSubmit}> Next </button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
SeekerJobs.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerJobs;
