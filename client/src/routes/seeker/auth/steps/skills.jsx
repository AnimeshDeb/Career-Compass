import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn";
import Lottie from 'lottie-react';
import animationData from '../../../../images/animatedAI.json';
function SeekerSkills({ handleNextStep, handlePrevStep, name }) {
  // const name=location.state?.NameFull;
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [SeekTxtSkills, setSeekTxtSkills] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [mode, setMode] = useState();
  const usersCollection = collection(db, "Seekers");
  const docRef = doc(usersCollection, name);

  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(e) {
    setImageUpload(e.target.files[0]);
    const files = e.target.files;
    if (files.length === 0) return;

    const file = files[0];

    setImages((prevImages) => [
      ...prevImages,
      { name: file.name, url: URL.createObjectURL(file), type: file.type },
    ]);
    fileInputRef.current.disabled = true;
  }

  function onDragOver(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = "copy";
    }
  }
  function onDragLeave(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
    }
  }

  function onDrop(e) {
    console.log("reaching hre!!!");
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
      const files = e.dataTransfer.files;
      setImageUpload(files[0]);

      setImages((prevImages) => [
        ...prevImages,
        { name: files[0].name, url: URL.createObjectURL(files[0]) },
      ]);
      fileInputRef.current.disabled = true;
      setMode("video");

      console.log("value of mode is " + mode);
    }
  }

  function uploadImage() {
    console.log("Images: ", images);
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/Seekers/${name}/${imageUpload.name + v4()}`
    );
    console.log("Image upload value is: " + imageUpload);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        //promise returns the image and we get the reference to that image
        return getDownloadURL(snapshot.ref); // we use return to get the download url
        // and by using return we can allow the second .then below to have access to the returned data
      })
      .then((downloadURL) => {
        //
        console.log("Download url:" + downloadURL);
        alert("image uploaded successfully");
        const seekerSkillsUpdatedData = {
          skills: downloadURL,
        };
        if (mode === "video") {
          setDoc(docRef, seekerSkillsUpdatedData, { merge: true });
        }
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const seekerSkillsUpdatedData = {
        skills: SeekTxtSkills,
      };
      if (mode === "text") {
        await setDoc(docRef, seekerSkillsUpdatedData, { merge: true });
      }

      handleNextStep();
      // navigate("/seekerChallenges", {state: {fullName: name}});
    } catch (error) {
      console.log("The error is: " + error);
      console.error("ERROR: " + error);
    }
  }
  const handleChange = (e) => {
    setSeekTxtSkills(e.target.value);
  };
  function handleTextClick() {
    setMode("text");
  }

  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Skills
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie animationData={animationData} className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0" />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            Please share the skills you bring:
            <br />
            <span className="text-primary font-semibold">Record a video </span>
            or
            <span className="text-secondary font-semibold"> write</span> about
            your skills.
            <br />
            If you prefer talking, you can
            <span className="text-secondary font-semibold">
              {""} speak about your skills.
            </span>
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
          <div className="flex justify-end mt-0">
              <Audio_Btn/>
          </div>
        </div>
      </div>

      <div className="mt-0 mb-0 max-w-4xl mx-auto pl-4 pr-4 space-y-6 bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex h-60 md:h-56 lg:h-60 justify-between">
            <div className="hover:bg-primary mb-5 w-full p-5">
              <textarea
                name="seekerIntroInput"
                onClick={handleTextClick}
                value={SeekTxtSkills}
                onChange={handleChange}
                placeholder="Type your introduction here..."
                className="w-full h-full p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500 mr-4"
              />
            </div>
            <div className="flex flex-col h-10 mt-0 items-center pl-0 pr-0 mr-0 ml-0 mb-5">
              <div className="border-l-2 h-2 opacity-100 m-0 p-0"></div>
              <span className="text-md font-semibold mb-0 ml-1 mr-1 opacity-70">OR</span>
              <div className="border-l-2 h-5 opacity-100 m-0 p-0"></div>
            </div>

            <div className="hover:bg-secondary w-full p-5 ml-0 mr-0 mt-0 mb-5">
              <div
                className="flex-1 h-full p-10 border-2 border-dashed bg-white rounded-md cursor-pointer hover:border-primary flex items-center justify-center"
                onClick={selectFiles}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
              {isDragging ? (
                <span className="text-primary">Drop files here</span>
              ) : (
                <span className="text-primary">
                  Click or drag & drop to upload
                </span>
              )}
              <input
                className="hidden"
                ref={fileInputRef}
                onChange={onFileSelect}
                type="file"
                multiple
              />
            </div>
          </div>
</div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-2 text-lg text-white bg-primary rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={uploadImage}
            >
              Upload
            </button>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 text-lg text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="button"
                onClick={handlePrevStep}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-lg text-white bg-secondary rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

SeekerSkills.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerSkills;
