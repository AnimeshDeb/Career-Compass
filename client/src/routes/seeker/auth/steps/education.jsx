import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from "../../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faUserGraduate, faBook, faHatWizard, faBrain } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'lottie-react';
import animationData from '../../../../images/animatedAI.json';
function SeekerEducation({ handleNextStep, handlePrevStep, name }) {
  const [seekerSchoolNameTxt, setSeekerSchoolNameTxt] = useState("");
  const [seekerMajor, setSeekerMajor] = useState("");
  const [seekerEducationTypeTxt, setSeekerEducationTypeTxt] = useState("");
  const [seekerGraduating, setSeekerGraduating] = useState("");
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear + 10 - index);
  const educationIcons = {
    "High School": faSchool,
    "Associate's": faUserGraduate,
    "Bachelor's": faBook,
    "Master's": faHatWizard,
    "PhD": faBrain
  };

  const handleEducationTypeButtonClick = (type) => {
    setSeekerEducationTypeTxt(type);
  };


  const handleChangeSchool = (e) => {
    setSeekerSchoolNameTxt(e.target.value);
  };
  const handleChangeMajor = (e) => {
    setSeekerMajor(e.target.value);
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
      handleNextStep();
    } catch (error) {
      console.log("The error is: " + error);
      console.error("ERROR: " + error);
    }
  }
  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Education
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie animationData={animationData} className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0" />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
        Where did you go to <span className="text-secondary font-semibold">school</span>? Tell us your highest education.
    </p>
    <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
    <div className="flex justify-end mt-2">
        <Audio_Btn/>
    </div>
</div>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="School name..."
        value={seekerSchoolNameTxt}
        onChange={handleChangeSchool}
        required
      />

<div className="py-2 px-4">
  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
    {Object.entries(educationIcons).map(([type, icon]) => (
      <button
        key={type}
        className={`py-2 px-4 border rounded-md ${seekerEducationTypeTxt === type ? 'bg-primary text-white' : 'bg-white text-primary border-gray-400'} flex items-center justify-center`}
        onClick={() => handleEducationTypeButtonClick(type)}
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {type}
      </button>
    ))}
  </div>
</div>

      <select
        className="w-full p-2 border rounded-md"
        value={seekerGraduating}
        onChange={handleChangeGraduating}
        required
      >
        <option value="">Select your graduation year</option>
        {years.map((year) => (
          <option value={year} key={year}>{year}</option>
        ))}
      </select>

      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Major..."
        value={seekerMajor}
        onChange={handleChangeMajor}
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
              className="bg-secondary text-white py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
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
