import { useState } from "react";
import SeekerIntro from "./SeekerSignProcessIntro";
import SeekerSkills from "./SeekerSignupProcessSkills";
import SeekerChallenges from "./SeekerChallengers";
import { useLocation } from "react-router-dom";
import SeekerEducation from "./SeekerEducation";
import SeekerJobs from "./SeekerJobs";
import SeekerProfilepic from "./SeekerProfilepic";
import { useNavigate } from "react-router-dom";
function ParentComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.fullName;
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
