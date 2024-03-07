import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from "../../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn"
function SeekerEducation({ handleNextStep, handlePrevStep, name }) {
  const [seekerSchoolNameTxt, setSeekerSchoolNameTxt] = useState("");
  const [seekerMajor, setSeekerMajor] = useState("");
  const [seekerEducationTypeTxt, setSeekerEducationTypeTxt] = useState("");
  const [seekerGraduating, setSeekerGraduating] = useState("");
  const educationTypes = ["High School", "Associate's", "Bachelor's", "Master's", "PhD"];
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear + 10 - index);



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
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Education
        </h1>
      </div>
      <div className="maybolin-talk flex items-center  m-4 mx-auto max-w-4xl">
        <div className="flex-shrink-0 max-w-40 w-1/4 mr-0 ml-5">
          <img
            src={placeholderAI}
            alt="Maybolin AI"
            className="w-3/4 object-cover"
          />
        </div>
        <div className="bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mr-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            Where did you go to{" "}
            <span className="text-secondary font-semibold">school</span>? Tell
            us your highest education.
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
        <div className="pl-90">
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

      <select
        className="w-full p-2 border rounded-md"
        value={seekerEducationTypeTxt}
        onChange={handleChangeEducationType}
        required
      >
        <option value="">Select your education type</option>
        {educationTypes.map((type) => (
          <option value={type} key={type}>{type}</option>
        ))}
      </select>

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
