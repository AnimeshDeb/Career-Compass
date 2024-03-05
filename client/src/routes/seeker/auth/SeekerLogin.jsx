import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../../../Contexts/SeekerAuthContext";
function SeekerLogin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const userCredentials = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      setLoading(false);
      navigate("/user", { state: { name: userCredentials.user.uid } });
    } catch (error) {
      console.error("Error signing in: ", error);
      setError("Unable to Login");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-10 pt-0">
        <h2 className="text-center text-2xl font-bold mb-4">Log In</h2>
        {error && <p className="bg-red-500 text-white p-3 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/SeekerForgotPassword"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
}

export default SeekerLogin;
