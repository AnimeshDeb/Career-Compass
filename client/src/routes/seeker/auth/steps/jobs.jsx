import { useState } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Card, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn"
import Select from 'react-select'
const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FM', label: 'Federated States of Micronesia' },
  { value: 'GU', label: 'Guam' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MP', label: 'Northern Mariana Islands' },
  { value: 'PW', label: 'Palau' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'VI', label: 'Virgin Islands' }
];
function SeekerJobs({ handleNextStep, handlePrevStep, name }) {
  const [jobLocation, setJobLocation] = useState({ city: "", state: "", country: "United States" });
  const [jobName, setJobName] = useState("");

  const handleStateChange = (selectedOption) => {
    setJobLocation(prevState => ({ ...prevState, state: selectedOption.value }));
  };

  const handleCityChange = (e) => {
    setJobLocation(prevState => ({ ...prevState, city: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const docRef = doc(collection(db, "Seekers"), name);
      await addDoc(collection(docRef, "Jobs"), {
        Job_Name: jobName,
        Job_Location: `${jobLocation.city}, ${jobLocation.state}, ${jobLocation.country}`,
      });
      handleNextStep();
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Jobs
        </h1>
      </div>
      <div className="maybolin-talk flex items-center  m-4 mx-auto max-w-4xl">
        <div className="flex-shrink-0 max-w-40 w-1/4 mr-0 ml-5">
          <img
            src={placeholderAI}
            alt="Maybolin AI"
            className="w-3/4 object-cover"
          />
        </div>
      <div className="bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mr-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
        What <span className="text-secondary">jobs</span> have you done in the
        past?
      </p>
      <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
      </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Job name"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              required
            />
            
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="City"
              value={jobLocation.city}
              onChange={handleCityChange}
              required
            />
            <Select
              options={stateOptions}
              onChange={handleStateChange}
              placeholder="Select State"
              isClearable={true}
              className="mb-4"
            />
            
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold p-2 flex-grow">
          United States
        </h1>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
SeekerJobs.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerJobs;
