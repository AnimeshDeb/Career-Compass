import { useState, useRef } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn";
import Lottie from 'lottie-react';
import animationData from '../../../../images/animatedAI.json';
import DropFile from "../../../../components/DropFile/DropFile";

const acceptedIntroVideoTypes = {
  'video/mp4': [],
  'video/webm': [],
  'video/ogg': [],
};
function SeekerIntro({ handleNextStep, uid }) {
  const [seekerTxtIntro, setSeekerTxtIntro] = useState("");
  // const name = location.state?.fullName;
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [mode, setMode] = useState();
  const usersCollection = collection(db, "Seekers");
  const docRef = doc(usersCollection, uid);

  function uploadVideo() {
    if (!imageUpload) {
      console.error("No file selected for upload.");
      return;
    }

    const fileRef = ref(storage, `Users/Seekers/${uid}/${imageUpload.name + v4()}`);
    const uploadTask = uploadBytes(fileRef, imageUpload);

    uploadTask.then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadURL) => {
          console.log("Video uploaded successfully: ", downloadURL);
          setDoc(docRef, { introductionVideoURL: downloadURL }, { merge: true })
            .then(() => {
              console.log("Firestore updated with video URL.");
              handleNextStep();
            })
            .catch((error) => {
              console.error("Error updating Firestore: ", error);
            });
        })
        .catch((error) => {
          console.error("Error getting video URL: ", error);
        });
    }).catch((error) => {
      console.error("Error uploading video: ", error);
    });
  }

  function uploadImage() {
    console.log("Images: ", images);
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/Seekers/ ${uid}/${imageUpload.name + v4()}`
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
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }
  const handleChange = (e) => {
    setSeekerTxtIntro(e.target.value);
  };

  return (
    <>
      <div className="bg-primary mb-0 text-white flex items-center pl-10">
        <h1 className="mb-0 text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Introductions
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie animationData={animationData} className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0" />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            We're excited to meet you! Please introduce yourself in the way you
            like best:
            <br />
            <span className="text-primary font-semibold">
              Record a video{" "}
            </span>{" "}
            or
            <span className="text-secondary font-semibold"> write </span> about
            yourself.
            <br />
            You can also{" "}
            <span className="text-secondary font-semibold"> talk</span>, and
            we'll help turn it into writing.
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
          <div className="flex justify-end mt-0">
              <Audio_Btn/>
          </div>
        </div>
      </div>

      <div className="mt-0 mb-0 max-w-4xl mx-auto pl-4 pr-4 space-y-6 bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex h-44 md:h-56 lg:h-60 justify-between">
            <div className="hover:bg-primary mb-5 w-full p-5">
              <textarea
                name="seekerIntroInput"
                onClick={handleTextClick}
                value={seekerTxtIntro}
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

            <div className="hover:bg-secondary w-full py-10 px-4 ml-0 mr-0 mt-0 mb-5">
              <DropFile onFileChange={uploadVideo} maxFiles={1} acceptedFileTypes={acceptedIntroVideoTypes}/>
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
            <button
              type="submit"
              className="px-6 py-2 text-lg text-white bg-secondary rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
  uid: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default SeekerIntro;
