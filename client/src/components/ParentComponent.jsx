import React, {useState} from "react";
import SeekerIntro from "./SeekerSignProcessIntro";
import SeekerSkills from "./SeekerSignupProcessSkills";
import SeekerChallenges from "./SeekerChallengers";
import { useLocation } from "react-router-dom";
import SeekerEducation from "./SeekerEducation";
import SeekerJobs from "./SeekerJobs";
import SeekerProfilepic from "./SeekerProfilepic";
import UserpageSeeker from "../routes/seeker/userpage/userpageSeeker";
import {useNavigate} from "react-router-dom";
function ParentComponent(){
    const navigate=useNavigate();
    const location=useLocation();
    const name=location.state?.fullName;
    console.log("name value is"+ name);
    const[step, setStep]=useState(0);

    const handleNextStep=()=>{
        console.log("reaching parent function");
        // switch(step){
        //     case 0:
        //         navigate("/SeekerIntro");
        //         break;
        //     case 1:
        //         navigate("/SeekerSkills");
        //         break;
        //     case 2:
        //         navigate("/SeekerChallenges");
        //         break;
        //     case 3:
        //         navigate("/SeekerEducation");
        //         break;
        //     case 4:
        //         navigate("/SeekerJobs");
        //         break;
        //     case 5:
        //         navigate("/SeekerProfilepic");
        //         break;
        //     case 6:
        //         navigate("/SeekerUserpage");
        //         break;

        // }
        setStep(step+1);
        
        
    };
    const handlePrevStep=()=>{
        setStep(step-1);
        
    }
    return(
        <>
        {step===0 && <SeekerIntro handleNextStep={handleNextStep} name={name} />}
        {step===1 && <SeekerSkills handleNextStep={handleNextStep} name={name} handlePrevStep={handlePrevStep}/>}
        {step===2 && <SeekerChallenges handleNextStep={handleNextStep} name={name} handlePrevStep={handlePrevStep}/>}
        {step===3 && <SeekerEducation handleNextStep={handleNextStep} name={name} handlePrevStep={handlePrevStep}/>}
        {step===4 && <SeekerJobs handleNextStep={handleNextStep} name={name} handlePrevStep={handlePrevStep} />}
        {step===5 && <SeekerProfilepic handleNextStep={handleNextStep} name={name} handlePrevStep={handlePrevStep}/>}
        {step===6 && <UserpageSeeker  name={name} />}

        </>
    );
}


export default ParentComponent