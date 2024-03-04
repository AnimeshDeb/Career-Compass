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
      <div className="bg-primary text-white p-1 pt-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Jobs</h1>
      </div>
      <p className="text-left mb-6 text-2xl pl-10 pt-10">
        What <span className="text-secondary">jobs</span> have you done in the
        past?
      </p>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="What is the name of your jobs?"
              onChange={handleChange}
              value={jobName}
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="What is the location of your job?"
              onChange={jobLocationHandleChange}
              value={jobLocation}
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
SeekerJobs.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerJobs;
