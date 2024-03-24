import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import {useAuth} from "../../../Contexts/SeekerAuthContext"
// import { useAuth } from "../../../Contexts/MentorAuthContext";
import Navbar from "../../../components/navbar/version1/navbar";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1707811919582.json";
import DropFile from "../../../components/DropFile/DropFileAuth";
import { storage, db } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
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

const acceptedIntroVideoTypes = {
  "video/mp4": [],
  "video/webm": [],
  "video/ogg": [],
};

function MentorSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usersCollection=collection(db, "Mentors");

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
        fullNameRef.current.value,
        "Mentors"
      );
      const docRef=doc(usersCollection, userCredential.user.uid );
      await setDoc(docRef, {type: "Mentor"}, {merge: true});
      navigate("/mentorprocess", {
        state: {
          uid: userCredential.user.uid,
          username: fullNameRef.current.value,
        },
      });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-4xl text-primary font-bold text-center mb-4">
          Mentor Sign Up
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={fullNameRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              ref={emailRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="password-confirm"
            >
              Password Confirmation
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              ref={passwordConfirmRef}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:text-blue-800">
            Log In
          </Link>
        </div>
      </div>
    </>
  );
}
function MentorSignup1() {
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
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

      const userId = userCredential.user.uid;

      // Upload files to Firebase Storage
      const storageRef = ref(storage);

      // Upload profile picture
      let profilePictureUrl = "";
      if (profilePicture.length > 0) {
        const profilePictureRef = ref(
          storage,
          `Mentors/${userId}/profilePicture.jpg`
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
        const introVideoRef = ref(storage, `Mentors/${userId}/introVideo.mp4`);
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
              `Mentors/${userId}/gallery/${file.name}-${index}`
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
      <Navbar userType="None" currentPage={"signup"} />
      <div className="max-w-lg mx-auto mt-10 bg-white p-8">
        <h2 className="text-4xl text-secondary font-bold text-center mb-4">
          Sign Up
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}
        <div className="flex justify-center mb-8">
          <Lottie
            loop={false}
            animationData={animationData}
            className="animation"
            style={{ width: "250px", height: "250px" }}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              ref={fullNameRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              ref={emailRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="password-confirm"
            >
              Password Confirmation
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              ref={passwordConfirmRef}
              required
            />
          </div>
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
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:text-blue-800">
            Log In
          </Link>
        </div>
      </div>
    </>
  );
}

export default MentorSignup;
