import { useState, useEffect } from "react";
import SeekerIntro from "./steps/introduction";
import SeekerSkills from "./steps/skills";
import SeekerChallenges from "./steps/challenges";
import { useLocation } from "react-router-dom";
import SeekerEducation from "./steps/education";
import SeekerJobs from "./steps/jobs";
import SeekerProfilepic from "./steps/picture";
import { useNavigate } from "react-router-dom";
import "../../../styling/UploadImages.css";
import NavbarWhite from "../../../components/navbar/version2/navbar";
import anime from "animejs";
const Step = ({ stepNumber, currentStep, label, goToStep, isCompleted }) => {
  // Base styling for the step container
  const baseStyle = "cursor-pointer flex justify-center items-center <h-2></h-2> pt-0 pb-0 p-2 ";
  const completedStyle = "bg-secondary text-white ";
  const activeStyle = "bg-primary text-white ";
  const defaultStyle = "bg-gray-600 text-white ";
  const textStyle = "text-center text-sm sm:text-base md:text-lg lg:text-xl ";

  // Determine the step's current styling
  let stepStyle = baseStyle + defaultStyle;
  if (isCompleted) stepStyle += completedStyle;
  if (stepNumber === currentStep) stepStyle += activeStyle;

  return (
    <div className={stepStyle + "flex-1"} onClick={() => goToStep(stepNumber)} title={label}>
    </div>
  );
};

function ParentComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid;
  const username = location.state?.username;
  const [step, setStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const steps = [
      "Introduction",
      "Skills",
      "Challenges",
      "Education",
      "Jobs",
      "Profile Picture"
    ];

  const goToStep = (stepIndex) => {
    if (stepIndex <= step) { // Prevent going forward but allow backward and direct jump to completed steps
      setStep(stepIndex);
    }
  };
  
  useEffect(() => {
    positionWelcomeContainer();
  }, []);

  const positionWelcomeContainer = () => {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.querySelector('.welcome-container').style.top = `${navbarHeight}px`;
  };
  const handleNextClick = () => {
    anime({
      targets: ".welcome-container",
      translateY: [0, -window.innerHeight ], 
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
      <div className="navbar sticky top-0 z-50 p-0 bg-white">
        <NavbarWhite />
      </div>
      <div className="w-full bg-gray-200 h-4 flex">
        {steps.map((label, index) => (
          <Step
            key={index}
            stepNumber={index}
            currentStep={step}
            label={label}
            goToStep={goToStep}
            isCompleted={index <= step}
          />
        ))}
      </div>
      {showWelcome && (
        <div className="welcome-container w-full h-full fixed inset-x-0 mx-auto flex items-center justify-center flex-col bg-primary text-white z-10 ">
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
