import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchUser from "./searchUsers/searchUsers";
import largeLogo from "../../images/logos/large_v1.png";
import "./Onboard.css";
import SeekerLogin from "../seeker/auth/SeekerLogin";
import anime from "animejs"

function Onboard() {
  const [tab, setTab] = useState("login"); 
  const [isSearchActive, setIsSearchActive] = useState(false);
  useEffect(() => {
    if (isSearchActive) {
      anime({
        targets: '.left-side',
        translateY: [0, -110],
        duration: 500,
        easing: 'easeOutQuad',
      });
    }
  }, [isSearchActive]);
  return (

<div className="flex min-h-screen w-full justify-center items-center p-4 bg-gray-50">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div className="left-side flex flex-col items-center justify-center">
        <img src={largeLogo} alt="Career Compass" className="max-w-full h-auto" />
      </div>

      <div className="right-side flex flex-col items-center md:items-start">
        {/* Adjust the max-w-[value] for larger screens to ensure it doesn't cover the entire half */}
        <div className="flex flex-col border border-gray-300 rounded-t-lg w-3/4 max-w-xl md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[500px] mx-auto">
          <div className="flex bg-gray-100 p-2 justify-center">
            <button onClick={() => setTab("login")} className={`px-4 text-xl py-2 ${tab === "login" ? "bg-primary text-white rounded-lg" : "bg-transparent"}`}>Login</button>
            <button onClick={() => setTab("signup")} className={`px-4 text-xl py-2 ${tab === "signup" ? "bg-secondary text-white rounded-lg" : "bg-transparent"}`}>Sign Up</button>
          </div>
          <div className="flex-grow p-4 pt-0">
            {tab === "login" && <SeekerLogin />}
            {tab === "signup" && (
              <div className="flex flex-col space-y-2">
                <h4>Choose what you are</h4>
                <Link to="/SeekerSignup" className="px-4 py-2 text-xl bg-primary rounded-md text-white text-center">Seeker</Link>
                <Link to="/MentorSignup" className="px-4 py-2 text-xl bg-secondary rounded-md text-white text-center">Mentor</Link>
              </div>
            )}
          </div>
        </div>
        <button className="bg-secondary text-white text-xl py-2 w-full max-w-xl md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-b-lg mt-4">
          Looking for someone? Search
        </button>
      </div>
    </div>
  </div>
</div>


  );
}

export default Onboard;