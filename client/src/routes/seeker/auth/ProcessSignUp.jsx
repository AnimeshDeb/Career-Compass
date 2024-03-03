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
function ParentComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.uid;
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      console.log(step);
      navigate("/user", { state: { name: name } });
    }
  };
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  return (
    <>
      {step === 0 && (
        <SeekerIntro handleNextStep={handleNextStep} name={name} />
      )}
      {step === 1 && (
        <SeekerSkills
          handleNextStep={handleNextStep}
          name={name}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 2 && (
        <SeekerChallenges
          handleNextStep={handleNextStep}
          name={name}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 3 && (
        <SeekerEducation
          handleNextStep={handleNextStep}
          name={name}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 4 && (
        <SeekerJobs
          handleNextStep={handleNextStep}
          name={name}
          handlePrevStep={handlePrevStep}
        />
      )}
      {step === 5 && (
        <SeekerProfilepic
          handleNextStep={handleNextStep}
          name={name}
          handlePrevStep={handlePrevStep}
        />
      )}
    </>
  );
}

export default ParentComponent;
