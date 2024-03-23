import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
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
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const companyNameRef = useRef();
  const locationRef = useRef();
  const companyEmailRef = useRef();
  const websiteRef = useRef();
  const additionalInfoRef = useRef();
  const [profilePicture, setProfilePicture] = useState([]);
  const [introVideo, setIntroVideo] = useState([]);
  const [profileGallery, setProfileGallery] = useState([]);
  const [userId, setId] = useState();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const audio = "";
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        fullNameRef.current.value
      );

      setId(userCredential.user.uid);
      if(!userId)
      {
        throw new Error("User id is not defined");
      }
      // Upload files to Firebase Storage
      const storageRef = ref(storage);

      // Upload profile picture
      let profilePictureUrl = "";
      if (profilePicture.length > 0) {
        const profilePictureRef = ref(
          storage,
          `Users/Mentors/${userId}/profilePicture.jpg`
        );
        const uploadTask = uploadBytesResumable(
          profilePictureRef,
          profilePicture[0]
        );

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Handle upload progress
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            async () => {
              // Handle successful uploads on complete
              try {
                profilePictureUrl = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve(profilePictureUrl);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      // Upload intro video
      let introVideoUrl = "";
      if (introVideo.length > 0) {
        const introVideoRef = ref(
          storage,
          `Users/Mentors/${userId}/introVideo.mp4`
        );
        const uploadTaskVideo = uploadBytesResumable(
          introVideoRef,
          introVideo[0]
        );

        await new Promise((resolve, reject) => {
          uploadTaskVideo.on(
            "state_changed",
            (snapshot) => {
              // Handle upload progress
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            async () => {
              // Handle successful uploads on complete
              try {
                introVideoUrl = await getDownloadURL(
                  uploadTaskVideo.snapshot.ref
                );
                resolve(introVideoUrl);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      // Upload profile gallery
      let galleryUrls = [];
      if (profileGallery.length > 0) {
        galleryUrls = await Promise.all(
          profileGallery.map(async (file, index) => {
            const galleryRef = ref(
              storage,
              `Users/Mentors/${userId}/gallery/${file.name}-${index}`
            );
            const uploadTaskGallery = uploadBytesResumable(galleryRef, file);

            return new Promise((resolve, reject) => {
              uploadTaskGallery.on(
                "state_changed",
                (snapshot) => {
                  // Handle upload progress
                },
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error);
                },
                async () => {
                  // Handle successful uploads on complete
                  try {
                    const url = await getDownloadURL(
                      uploadTaskGallery.snapshot.ref
                    );
                    resolve(url);
                  } catch (error) {
                    reject(error);
                  }
                }
              );
            });
          })
        );
      }

      // Store additional form data in Firestore
      await setDoc(
        doc(db, "Mentors", userId),
        {
          companyName: companyNameRef.current.value,
          location: locationRef.current.value,
          companyEmail: companyEmailRef.current.value,
          website: websiteRef.current.value,
          additionalInfo: additionalInfoRef.current.value,
          pictureURL: profilePictureUrl,
          introVideo: introVideoUrl,
          gallery: galleryUrls,
        },
        { merge: true }
      );

      // Navigate to the mentor profile page
      navigate("/mentor", { state: { name: userId } });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

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
            <label className="block text-sm font-bold mb-2" htmlFor="website">
              Website URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={websiteRef}
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
          {/* <Link
            to={"/mentor"}
            disabled={loading}
            className="w-full mt-10 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Done
          </Link> */}
        </form>
      </div>
    </>
  );
}
