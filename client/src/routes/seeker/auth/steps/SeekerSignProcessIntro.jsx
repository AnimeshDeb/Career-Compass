import { useState, useRef } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";

function SeekerIntro({ handleNextStep, name }) {
  const [seekerTxtIntro, setSeekerTxtIntro] = useState("");
  // const name = location.state?.fullName;
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [mode, setMode] = useState();
  const usersCollection = collection(db, "Seekers");
  const docRef = doc(usersCollection, name);

  // const user=auth.currentUser
  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      // Check if the selected file is a video
      setImageUpload(file);
      setImages([
        { name: file.name, url: URL.createObjectURL(file), type: file.type },
      ]);
      fileInputRef.current.disabled = true;
      setMode("video");
    } else {
      // Handle the case where a non-video file is selected
      alert("Please select a video file.");
    }
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
        const seekerIntroVidData = {
          introduction: downloadURL,
        };
        if (mode === "video") {
          setDoc(docRef, seekerIntroVidData, { merge: true });
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
      const seekerIntroUpdatedData = {
        introduction: seekerTxtIntro,
      };
      if (mode === "text") {
        await setDoc(docRef, seekerIntroUpdatedData, { merge: true });
      }
      handleNextStep();

      // navigate("/seekerSkills", { state: { NameFull: name } });
    } catch (error) {
      console.error("ERROR: ", error);
      console.log("the error is:" + error);
    }
  }
  const handleChange = (e) => {
    setSeekerTxtIntro(e.target.value);
  };

  return (
    <>
      <div className="bg-primary text-white p-1 pt-5 pl-10">
        <h1 className="text-4xl font-bold mb-4">Introductions</h1>
      </div>
      <p className="text-left mb-6 text-2xl pl-10 pt-10">
        Introduce yourself with <span className="text-secondary">text</span> or
        a <span className="text-primary">video</span>. Perhaps both.
      </p>

      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              name="seekerIntroInput"
              onClick={handleTextClick}
              value={seekerTxtIntro}
              onChange={handleChange}
              placeholder="Type your introduction here..."
              className="w-full h-36 p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              {/* Drag and Drop for video upload */}
              <div
                className="flex flex-col items-center justify-center h-48 p-4 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                onClick={selectFiles} // Make sure this calls the selectFiles function
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {isDragging ? (
                  <span className="text-blue-500">Drop files here</span>
                ) : (
                  <span className="text-blue-500">
                    Click here to put your video
                  </span>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex-1 space-y-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                    onClick={() => deleteImage(index)}
                  >
                    &times;
                  </button>
                  {/* Ensure image.type is defined before calling includes */}
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
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-6 py-2 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={uploadImage}
            >
              Upload
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

SeekerIntro.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SeekerIntro;
