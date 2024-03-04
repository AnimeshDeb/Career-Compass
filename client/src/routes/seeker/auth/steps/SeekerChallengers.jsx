import { db } from "../../../../firebase";
import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";

function SeekerChallenges({ handleNextStep, handlePrevStep, name }) {
  // const name = location.state?.fullName;
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [seekerTxtChallenges, setSeekerTxtChallenges] = useState("");
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
      console.log("value of image is " + imageUpload);
    }
  }
  function uploadImage() {
    console.log("Images: ", images);
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/Seekers/ ${name}/${imageUpload.name + v4()}`
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
        const seekerChallangeData = {
          challenges: downloadURL,
        };
        if (mode === "video") {
          setDoc(docRef, seekerChallangeData, { merge: true });
        }
      });
  }
  function handleTextClick() {
    setMode("text");
  }
  function handleVideoClick() {
    setMode("video");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const seekerChallangeData = {
        challenges: seekerTxtChallenges,
      };
      if (mode === "text") {
        await setDoc(docRef, seekerChallangeData, { merge: true });
      }
      handleNextStep();
      // navigate('/seekerEducation', { state: { fullName: name } });
    } catch (error) {
      console.log("The error is: " + error);
      console.error("ERROR: " + error);
    }
  }
  const handleChange = (e) => {
    setSeekerTxtChallenges(e.target.value);
  };

  return (
    <>
      <div className="bg-primary text-white p-1 pt-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Challenges</h1>
      </div>
      <p className="text-left mb-6 text-2xl pl-10 pt-10">
        Any <span className="text-secondary">challenges</span> you want to
        share? Do it in video or text.
      </p>
      <div className="max-w-4xl mx-auto p-6 mt-20 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              className="w-full h-36 p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500"
              onClick={handleTextClick}
              onChange={handleChange}
              placeholder="Type your challenges here..."
              value={seekerTxtChallenges}
            />
          </div>
          <div className="card2" onClick={handleVideoClick}>
            <div
              className={`drag-area flex flex-col items-center justify-center h-48 p-4 border-2 border-dashed rounded-md cursor-pointer ${
                isDragging ? "border-blue-500" : "border-gray-300"
              } hover:border-blue-500`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {isDragging ? (
                <span className="select text-blue-500">Drop files here </span>
              ) : (
                <>
                  Drag & Drop file here or{" "}
                  <span
                    className="select text-blue-500 cursor-pointer"
                    role="button"
                    onClick={selectFiles}
                  >
                    Browse
                  </span>
                </>
              )}
              <input
                name="file"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
              />
            </div>
            <div className="container space-y-4">
              {images.map((image, index) => (
                <div className="image relative" key={index}>
                  <span
                    className="delete absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                    onClick={() => deleteImage(index)}
                  >
                    &times;
                  </span>
                  {image.type && image.type.includes("video") ? (
                    <video controls className="w-full h-auto rounded-md">
                      <source src={image.url} type={image.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-auto rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={uploadImage}
            >
              Upload
            </button>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="button"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
SeekerChallenges.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerChallenges;
