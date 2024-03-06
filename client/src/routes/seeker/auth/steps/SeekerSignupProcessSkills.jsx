import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
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
  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    fileInputRef.current.disabled = false;
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
  function handleVideoClick() {
    setMode("video");
  }

  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold p-2 flex-grow">
          Skills
        </h1>
      </div>
      <div className="flex items-center my-8 mx-auto max-w-4xl">
        <div className="flex-shrink-0 max-w-40 w-1/4 mr-5 ml-5">
          <img
            src={placeholderAI}
            alt="Maybolin AI"
            className="w-full object-cover"
          />
        </div>
        <div className="bg-blue-100 px-6 py-4 shadow-lg relative text-left rounded-tr-lg rounded-bl-lg rounded-br-lg flex-grow">
          <p className="text-sm md:text-xl lg:text-2xl">
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <textarea
              name="seekerIntroInput"
              onClick={handleTextClick}
              onChange={handleChange}
              placeholder="Type your skills here..."
              value={SeekTxtSkills}
              className="w-1/2 h-48 p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <div
              className="w-1/2 h-48 p-10 border-2 border-dashed bg-white rounded-md cursor-pointer hover:border-primary flex items-center justify-center"
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

          <div className="flex justify-between mt-6">
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
