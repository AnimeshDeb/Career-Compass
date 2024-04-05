import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../../../Contexts/SeekerAuthContext";
import Navbar from "../../../components/navbar/version1/navbar";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import excitedtwo from "../../../images/flat_illustrations/excitedtwo.png";
import wheelchair from "../../../images/flat_illustrations/wheelchairwoman.png";
function SeekerSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usersCollection = collection(db, "Seekers");
  const { currentUser } = useAuth();
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
        "Seekers"
      );
      const uid = userCredential.user.uid;

      const docRef = doc(usersCollection, uid);
      await setDoc(docRef, { type: "Seeker" }, { merge: true });

      navigate("/parent", {
        state: {
          uid: userCredential.user.uid,
          username: fullNameRef.current.value,
        },
      });
    } catch (error) {
      console.log(error);

      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar currentPage={"signup"} />
      <div className="relative max-w-md mx-auto mt-10">
        <div className="bg-white p-8 mb-0 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-4xl text-primary font-bold text-center mb-4">
            Seeker Sign Up
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
      <div className="mt-0 pt-0 flex justify-evenly">
        <img
          src={excitedtwo}
          alt="People celebrating"
          className="w-1/2 mt-0 pt-2 max-w-[275px] object-contain"
        />
        <img
          src={wheelchair}
          alt="People celebrating"
          className="w-1/3 mt-0 pt-0 max-w-[200px] object-contain"
        />
      </div>
    </>
  );
}
export default SeekerSignup;
