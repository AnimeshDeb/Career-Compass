import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";

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
      <div className="bg-primary text-white p-1 pt-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Skills</h1>
      </div>
      <p className="text-left mb-6 text-2xl pl-10 pt-10">
        Include your <span className="text-secondary">skills</span> . Do it in
        video or text format:
      </p>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full h-36 p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500"
              onClick={handleTextClick}
              onChange={handleChange}
              placeholder="Type your skills here..."
              value={SeekTxtSkills}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div
                className={`flex flex-col items-center justify-center h-48 p-4 border-2 border-dashed rounded-md cursor-pointer ${
                  isDragging ? "border-blue-500" : "border-gray-300"
                } hover:border-blue-500`}
                onClick={selectFiles}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {isDragging ? (
                  <span className="text-blue-500">Drop files here</span>
                ) : (
                  <span className="text-blue-500">
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

            {/* Thumbnails */}
            <div className="flex-1 space-y-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <button
                    className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                    onClick={() => deleteImage(index)}
                  >
                    &times;
                  </button>
                  {image.type && image.type.includes("video") ? (
                    <video className="w-full h-auto rounded-md" controls>
                      <source src={image.url} type={image.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      className="w-full h-auto rounded-md"
                      src={image.url}
                      alt={image.name}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-6 py-2 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
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
                className="px-6 py-2 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="submit"
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
