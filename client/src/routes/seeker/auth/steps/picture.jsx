import { useState, useRef } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import Lottie from "lottie-react";
import animationData from "../../../../images/animatedAI.json";
function SeekerProfilepic({ handlePrevStep, handleNextStep, name }) {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  // const name=location.state?.fullName;
  const [imageUpload, setImageUpload] = useState(null);
  const usersCollection = collection(db, "Seekers");
  const docRef = name ? doc(db, "Seekers", name) : null;
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
    }
  }

  if (!name) {
    return (
      <div className="text-center mt-8">
        <p>User name not available. Please ensure you are logged in.</p>
      </div>
    );
  }

  function uploadImage() {
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/Seekers/ ${name}/${imageUpload.name + v4()}`
    );

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        //promise returns the image and we get the reference to that image
        return getDownloadURL(snapshot.ref); // we use return to get the download url
        // and by using return we can allow the second .then below to have access to the returned data
      })
      .then((downloadURL) => {
        //
        alert("image uploaded successfully");
        const seekerProfilepicData = {
          pictureURL: downloadURL,
        };

        setDoc(docRef, seekerProfilepicData, { merge: true });
      });
  }
  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Picture
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie
            animationData={animationData}
            className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0"
          />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            Almost done! <span className="text-secondary">Add </span> a picture
            with your face below.
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="relative mx-auto w-36 h-36">
            <div
              className={`absolute inset-0 border-2 border-dashed rounded-full flex items-center justify-center ${
                isDragging ? "border-primary" : "border-gray-300"
              } hover:border-primary bg-secondary transition duration-300 ease-in-out`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={selectFiles}
            >
              {isDragging ? (
                <span className="text-primary">Drop image here</span>
              ) : images.length === 0 ? (
                <span className="text-white text-center">
                  Click or drag & drop to upload
                </span>
              ) : null}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
                accept="image/*"
              />
            </div>
            {images.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center p-1 bg-white">
                {images.map((image, index) => (
                  <div key={index} className="relative w-full h-full">
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 z-20" // Ensure button is clickable
                      onClick={() => deleteImage(index)}
                    >
                      &times;
                    </button>
                    <img
                      src={image.url}
                      alt={image.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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
              className="px-6 py-2 text-lg text-white bg-primary rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={uploadImage}
            >
              Upload
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-lg text-white bg-secondary rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
