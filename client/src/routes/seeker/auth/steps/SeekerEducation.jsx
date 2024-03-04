import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from "../../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";
function SeekerEducation({ handleNextStep, handlePrevStep, name }) {
  const [seekerSchoolNameTxt, setSeekerSchoolNameTxt] = useState("");
  const [seekerMajor, setSeekerMajor] = useState("");
  const [seekerEducationTypeTxt, setSeekerEducationTypeTxt] = useState("");
  const [seekerGraduating, setSeekerGraduating] = useState("");
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
      <div className="bg-primary text-white p-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Education</h1>
      </div>
      <p className="text-left text-2xl pl-10 pt-10">
        Where did you go to <span className="text-secondary">school</span>? Tell
        us your education.
      </p>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Type in your university name..."
              value={seekerSchoolNameTxt}
              onChange={handleChangeSchool}
              required
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="What degree are you going for..."
              value={seekerEducationTypeTxt}
              onChange={handleChangeEducationType}
              required
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="When are you graduating..."
              value={seekerGraduating}
              onChange={handleChangeGraduating}
              required
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="What is your major..."
              value={seekerMajor}
              onChange={handleChangeMajor}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

SeekerEducation.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerEducation;
