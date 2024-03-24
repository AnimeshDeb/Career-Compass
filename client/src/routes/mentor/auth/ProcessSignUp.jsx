import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../Contexts/MentorAuthContext";
import NavbarWhite from "../../../components/navbar/version2/navbar";
import Lottie from "lottie-react";
import animationAI from "../../../images/animatedAI.json";
import DropFile from "../../../components/DropFile/DropFileAuth";
import { storage, db } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Audio_Btn from "../../../components/Buttons/audio__btn/audio_btn";
const acceptedProfilePictureTypes = {
  "image/jpeg": [],
  "image/png": [],
  "image/gif": [],
};

const acceptedProfileGalleryTypes = {
  "image/jpeg": [],
  "image/png": [],
  "image/gif": [],
};

const maybolinAudio =
  "https://firebasestorage.googleapis.com/v0/b/career-compass-77175.appspot.com/o/static%2Faudio%2F2024-03-15%2005-27-11.mp3?alt=media&token=a05792ea-a246-42a0-9f6b-335e52bc9e28";

const acceptedIntroVideoTypes = {
  "video/mp4": [],
  "video/webm": [],
  "video/ogg": [],
};
export default function MentorSignupProcess() {
  const location = useLocation();
  const userId = location.state?.uid;
  const companyNameRef = useRef();
  const locationRef = useRef();
  const companyEmailRef = useRef();
  const introRef = useRef();
  const additionalInfoRef = useRef();
  const [profilePicture, setProfilePicture] = useState([]);
  const [introVideo, setIntroVideo] = useState([]);
  const [profileGallery, setProfileGallery] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Running", profileGallery, introVideo);
    // Function to upload a file and return its download URL
    const uploadFileAndGetURL = async (file, path) => {
      const fileRef = ref(storage, path);
      // Start the file upload
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optionally, handle progress updates
            // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
          },
          (error) => reject(error),
          () => resolve(uploadTask.snapshot)
        );
      });

      // After upload completes, get the download URL
      return await getDownloadURL(uploadTask.snapshot.ref);
    };
    try {
      // Upload profile picture
      let profilePictureUrl = profilePicture
        ? await uploadFileAndGetURL(
            profilePicture[0],
            `Users/Mentors/${userId}/profilePicture.jpg`
          )
        : "";

      // Upload intro video
      let introVideoUrl = introVideo
        ? await uploadFileAndGetURL(
            introVideo[0],
            `Users/Mentors/${userId}/introVideo.mp4`
          )
        : "";

      // Upload profile gallery
      let galleryUrls = [];
      if (profileGallery) {
        const uploadPromises = profileGallery.map(async (file, index) => {
          const galleryRef = ref(
            storage,
            `Users/Mentors/${userId}/gallery/${file.name}-${index}`
          );
          // Start the file upload
          const uploadTaskSnapshot = await uploadBytesResumable(
            galleryRef,
            file
          );
          // After upload completes, get the download URL
          const url = await getDownloadURL(uploadTaskSnapshot.ref);

          // Create a new document in the gallery subcollection for each image
          const galleryDocRef = doc(db, `Mentors/${userId}/gallery`, file.name);
          await setDoc(galleryDocRef, { imageURL: url });

          // Optionally, return the document reference or URL for further use
          return galleryDocRef;
        });

        try {
          // Await all gallery image uploads and document creations
          await Promise.all(uploadPromises);
        } catch (error) {
          console.error("Error uploading gallery images:", error);
        }
      }

      await setDoc(
        doc(db, "Mentors", userId),
        {
          companyName: companyNameRef.current.value,
          location: locationRef.current.value,
          intro_text: introRef.current.value,
          additionalInfo: additionalInfoRef.current.value,
          pictureURL: profilePictureUrl,
          intro_video: introVideoUrl
         
        },
        { merge: true }
      );

      // Navigate to the mentor profile page
      navigate("/mentor", { state: { userId: userId } });
    } catch (error) {
      setError(error.message);
      console.error("Error during the sign-up process:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <NavbarWhite userType="None" />
      <div className="bg-secondary mb-0 text-white flex items-center pl-10">
        <h1 className="mb-0 text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Sign Up Form
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie
            animationData={animationAI}
            className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0"
          />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            A pleasure to meet you!{" "}
            <span className="text-primary font-semibold">
              My name is Maybolin.
            </span>{" "}
            You can fill the form below to{" "}
            <span className="text-secondary font-semibold">
              finish your profile
            </span>{" "}
            and start mentoring.
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-secondary"></div>
          <div className="flex justify-end mt-0">
            <Audio_Btn audioSrc={maybolinAudio} />
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto mt-10 bg-white p-8">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="companyName"
            >
              Company Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={companyNameRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={locationRef}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="companyEmail"
            >
              Company Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              ref={companyEmailRef}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="intro_text"
            >
              Introduction
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={introRef}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="additionalInfo"
            >
              Additional Information
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ref={additionalInfoRef}
            />
          </div>
          <div className="drop-group">
            <label>
              <strong>Upload a Profile Picture</strong>
            </label>
            <DropFile
              onFileChange={setProfilePicture}
              maxFiles={1}
              acceptedFileTypes={acceptedProfilePictureTypes}
              userType={"Mentor"}
              userId={userId}
            />
          </div>
          <div className="drop-group">
            <label>
              <strong>
                Upload Photos/Videos for your Profile Gallery (Up to 10 Files)
              </strong>
            </label>
            <DropFile
              onFileChange={setProfileGallery}
              maxFiles={10}
              acceptedFileTypes={acceptedProfileGalleryTypes}
              userType={"Mentor"}
              userId={userId}
            />
          </div>
          <div className="drop-group">
            <label>
              <strong>Upload an Introductory Video</strong>
            </label>
            <DropFile
              onFileChange={setIntroVideo}
              maxFiles={1}
              acceptedFileTypes={acceptedIntroVideoTypes}
              userType={"Mentor"}
              userId={userId}
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Done
          </button>
        </form>
      </div>
    </>
  );
}
