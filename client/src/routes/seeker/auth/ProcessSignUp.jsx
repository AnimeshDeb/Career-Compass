import { useState } from "react";
import SeekerIntro from "./steps/SeekerSignProcessIntro";
import SeekerSkills from "./steps/SeekerSignupProcessSkills";
import SeekerChallenges from "./steps/SeekerChallengers";
import { useLocation } from "react-router-dom";
import SeekerEducation from "./steps/SeekerEducation";
import SeekerJobs from "./steps/SeekerJobs";
import SeekerProfilepic from "./steps/SeekerProfilepic";
import { useNavigate } from "react-router-dom";
import "../../../styling/UploadImages.css";
import NavbarWhite from "../../../components/navbar/version2/navbar";
import anime from "animejs";
function ParentComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid;
  const username = location.state?.username;
  const [step, setStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const handleNextClick = () => {
    anime({
      targets: ".welcome-container",
      translateY: [0, -2000],
      easing: "easeInExpo",
      duration: 1500,
      complete: () => {
        setShowWelcome(false);
      },
    });
  };
  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      console.log(step);
      navigate("/user", { state: { name: uid } });
    }
  };
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  return (
    <>
      <NavbarWhite />
      {showWelcome && (
        <div className="welcome-container fixed inset-x-0 h-full top-1/8 mx-auto flex items-center justify-center flex-col bg-primary text-white z-10 p-16">
          <h3 className="text-5xl">Welcome, {username}!</h3>
          <p className="text-xl font-bold mt-4">
            Let's finish <span className="text-secondary">your</span> profile
          </p>
          <button
            onClick={handleNextClick}
            className="mt-6 bg-white text-primary py-2 px-8 rounded"
          >
            Next
          </button>
        </div>
      )}
      {step === 0 && (
        <SeekerIntro
          handleNextStep={handleNextStep}
          uid={uid}
          username={username}
        />
      )}
      {step === 1 && (
        <SeekerSkills
          handleNextStep={handleNextStep}
          name={uid}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 2 && (
        <SeekerChallenges
          handleNextStep={handleNextStep}
          name={uid}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 3 && (
        <SeekerEducation
          handleNextStep={handleNextStep}
          name={uid}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 4 && (
        <SeekerJobs
          handleNextStep={handleNextStep}
          name={uid}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 5 && (
        <SeekerProfilepic
          handleNextStep={handleNextStep}
          name={uid}
          handlePrevStep={handlePrevStep}
        />
      )}
    </>
  );
}

export default ParentComponent;
