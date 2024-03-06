import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from "../../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
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
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold p-2 flex-grow">
          Education
        </h1>
      </div>
      <div className="maybolin-talk flex items-center mb-0 my-8 mx-auto max-w-4xl">
        <div className="flex-shrink-0 max-w-40 w-1/4 mr-5 ml-5">
          <img
            src={placeholderAI}
            alt="Maybolin AI"
            className="w-full object-cover"
          />
        </div>
        <div className="bg-blue-100 px-6 py-4 shadow-lg relative text-left mb-6 mr-5 rounded-tr-lg rounded-bl-lg rounded-br-lg flex-grow">
          <p className="text-sm md:text-xl lg:text-2xl">
            Where did you go to{" "}
            <span className="text-secondary font-semibold">school</span>? Tell
            us your education.
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Type in the type of education..."
              value={seekerSchoolNameTxt}
              onChange={handleChangeSchool}
              required
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="What is the name of your diploma..."
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
