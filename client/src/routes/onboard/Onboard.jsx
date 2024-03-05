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
    // Ensuring that the container is a flex container that fills the viewport height and centers its children
    <div className="flex min-h-screen justify-center items-center p-4 bg-gray-50"> {/* Adjust background color as needed */}
      <Container fluid className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
    <div className="left-side flex flex-col items-center w-full md:w-1/2"> {/* Remove additional padding/margin here */}
      <img src={largeLogo} alt="Logo" className="h-auto max-w-full mb-4" />
      <SearchUser isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
    </div>

        <div className="flex flex-col w-full md:w-1/2 items-center">
          <div className="border border-gray-300 rounded-lg w-full max-w-md">
            <div className="flex bg-gray-100 p-2 rounded-t-lg justify-center">
              <button onClick={() => setTab("login")} className={`px-4 text-xl py-2 ${tab === "login" ? "bg-primary text-white rounded-lg" : "bg-transparent"}`}>Login</button>
              <button onClick={() => setTab("signup")} className={`px-4 text-xl py-2 ${tab === "signup" ? "bg-secondary text-white rounded-lg" : "bg-transparent"}`}>Sign Up</button>
            </div>
            <div className="p-4">
              {tab === "login" && <SeekerLogin />}
              {tab === "signup" && (
                <div className="flex flex-col space-y-2">
                  <h4>Choose what you are</h4>
                  <Link to="/SeekerSignup" className="px-4 py-2 text-xl bg-primary text-white text-center rounded-md">Seeker</Link>
                  <Link to="/MentorSignup" className="px-4 py-2 text-xl bg-secondary text-white text-center rounded-md">Mentor</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Onboard;