import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../../../Contexts/SeekerAuthContext";
// import { useAuth } from "../../../Contexts/MentorAuthContext";
import Navbar from "../../../components/navbar/version1/navbar";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1707811919582.json";
import DropFile from "../../../components/DropFile/DropFileAuth";
import { storage, db } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import talkingtwo from "../../../images/flat_illustrations/talkingtwo.png";

function MentorSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usersCollection = collection(db, "Mentors");

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
      const docRef = doc(usersCollection, userCredential.user.uid);
      await setDoc(docRef, { type: "Mentor" }, { merge: true });
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
      <Navbar currentPage={"signup"} />
      <div className="flex flex-col md:flex-row justify-evenly space-x-0 md:space-x-10 items-center mx-auto my-10 p-10 w-full max-w-4xl">
        <div className="flex-1 flex justify-center mb-5 md:mb-0">
          <img
            src={talkingtwo}
            alt="People celebrating"
            className="w-1/3 md:w-full lg:max-w-md object-contain"
          />
        </div>
        <div className="flex-1 bg-white p-8 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-4xl text-primary font-bold text-center mb-4">
            Mentor Sign Up
          </h2>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullname"
              >
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
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password"
              >
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
      </div>
    </>
  );
}

export default MentorSignup;
