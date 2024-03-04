import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";

function SeekerProfilepic({ handlePrevStep, handleNextStep, name }) {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  // const name=location.state?.fullName;
  const [imageUpload, setImageUpload] = useState(null);
  const usersCollection = collection(db, "Seekers");
  const docRef = doc(usersCollection, name);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      handleNextStep();
    } catch (error) {
      console.error("ERROR", error.message);
    }
  }
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
      { name: file.name, url: URL.createObjectURL(file) },
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
        const seekerProfilepicData = {
          pictureURL: downloadURL,
        };

        setDoc(docRef, seekerProfilepicData, { merge: true });
      });
  }
  return (
    <>
      <div className="bg-primary text-white p-1 pt-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Picture</h1>
      </div>
      <p className="text-left mb-6 text-2xl pl-10 pt-10">
        Include a <span className="text-secondary">picture</span>
      </p>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-full w-36 h-36 flex items-center justify-center mx-auto cursor-pointer ${
                isDragging ? "border-primary" : "border-gray-300"
              } hover:border-primary bg-secondary`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={selectFiles}
            >
              {isDragging ? (
                <span className="text-primary">Drop image here</span>
              ) : (
                <span className="text-white text-center">
                  Click here to put your picture
                </span>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="flex justify-center space-x-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => deleteImage(index)}
                  >
                    &times;
                  </button>
                  <img
                    src={image.url}
                    alt={image.name}
                    className="rounded-full w-36 h-36 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={uploadImage}
            >
              Upload
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
SeekerProfilepic.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};

export default SeekerProfilepic;
