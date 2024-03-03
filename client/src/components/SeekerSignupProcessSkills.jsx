import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styling/UploadImages.css";
import { storage } from "../firebase";
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
      <h1>Skills</h1>
      <p>Include your skills. Do it in video or text format:</p>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                onClick={handleTextClick}
                name="SeekerSkills"
                value={SeekTxtSkills}
                onChange={handleChange}
                placeholder="Type your skills here..."
              />
            </label>

            <div className="card2" onClick={handleVideoClick}>
              <div
                className="drag-area"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {isDragging ? (
                  <span className="select">Drop images here </span>
                ) : (
                  <>
                    Drag & Drop image here or{" "}
                    <span
                      className="select"
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
                  className="file"
                />
              </div>
              <div className="container">
                {images.map((images, index) => (
                  <div className="image" key={index}>
                    <span className="delete" onClick={() => deleteImage(index)}>
                      {" "}
                      &times;{" "}
                    </span>

                    {images.type && images.type.includes("video") ? ( // Check if it's a video
                      <video controls>
                        <source src={images.url} type={images.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={images.url} alt={images.name} />
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={uploadImage}>
                Upload
              </button>
            </div>

            <Button type="text" onClick={() => handlePrevStep()}>
              Back
            </Button>
            <Button type="submit"> Next</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

SeekerSkills.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerSkills;
