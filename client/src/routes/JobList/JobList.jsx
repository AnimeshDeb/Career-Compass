import { useEffect, useState, useRef } from "react";
import { getJobListings } from "../../functions/jobFunctions";
import Navbar from "../../components/navbar/version1/navbar";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../../components/footer/footer";
import anime from "animejs";
// Array of all 50 U.S. states
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const JobListing = ({ job, onJobClick, isFirst }) => {
  const location = useLocation();
  const userType = "seeker";
  const lowerCaseUserType = userType?.toLowerCase();
  const jobStyle = isFirst
    ? "bg-green-500" // replace with your actual green color class
    : "bg-primary"; // the default background color class

  return (
    <div
      className="cursor-pointer border border-gray-300 p-4 my-2 bg-primary rounded-lg text-white shadow hover:shadow-md relative"
      onClick={() => onJobClick(job)}
    >
      
      <div className="flex justify-between items-center">
        <div className="flex">
          <h1 className="font-semibold pr-5 text-2xl">{job.id}</h1>
          <div className="flex items-start">
            {job.Description && (
              <>
                <span className="text-lg pt-1">&#8226;</span>
                <h2 className="pl-2 text-lg">{job.Description}</h2>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div
            className="bg-secondary hover:bg-secondary-dark text-white px-10 py-2 rounded-full cursor-pointer text-center"
            onClick={(event) => {
              event.stopPropagation();
              onJobClick(job);
            }}
          >
            Details
          </div>
          {lowerCaseUserType === "mentor" ? (
            <button
              className="bg-primary hover:bg-primary-dark text-white px-10 py-2 rounded-full cursor-pointer"
              onClick={(event) => event.stopPropagation()}
            >
              Recommend
            </button>
          ) : lowerCaseUserType === "seeker" ? (
            <button
             className="bg-secondary hover:bg-secondary-dark text-white px-10 py-2 rounded-full cursor-pointer"
              onClick={(event) => event.stopPropagation()}
            >
              Apply
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [isPartTime, setIsPartTime] = useState(false);
  const detailsRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedJobs = await getJobListings();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (selectedJob && detailsRef.current) {
      anime({
        targets: detailsRef.current,
        translateX: ["100%", "0%"],
        opacity: [0, 1],
        easing: "easeOutQuad",
        duration: 700,
      });
    }
  }, [selectedJob]);
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setIsPartTime(false);
  };

  const filterJobs = (jobs, searchTerm, locationFilter, isPartTime) => {
    return jobs.filter((job) => {
      const idString = job.id ? job.id.toString().toLowerCase() : "";
      const descriptionString = job.Description
        ? job.Description.toLowerCase()
        : "";
      const matchesIdOrDescription =
        idString.includes(searchTerm.toLowerCase()) ||
        descriptionString.includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter
        ? job.Location === locationFilter
        : true;
      const matchesPartTime = isPartTime
        ? job.Availability === "Part Time"
        : true;
      return matchesIdOrDescription && matchesLocation && matchesPartTime;
    });
  };

  const filteredJobs = filterJobs(jobs, searchTerm, locationFilter, isPartTime);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar userType="seeker" />
        <div className="px-3">
          <h1 className="text-7xl pt-2 font-bold text-primary">Jobs</h1>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search for jobs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Locations</option>
              {states.map((state) => (
                <option value={state} key={state}>
                  {state}
                </option>
              ))}
            </select>
            <button
              className={`py-2 px-4 ${
                isPartTime ? "bg-primary" : "bg-secondary"
              } text-white rounded-md mr-2`}
              onClick={() => setIsPartTime(!isPartTime)}
            >
              {isPartTime ? "Part-Time Only" : "All Jobs"}
            </button>
            <button
              className="py-2 px-4 bg-secondary text-white rounded-md"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex-grow flex">
          <div
            className={`${selectedJob ? "w-1/2" : "w-full"} px-2 overflow-auto`}
      >


<div
      className="cursor-pointer border border-gray-300 p-4 my-2 bg-secondary rounded-lg text-white shadow hover:shadow-md relative"
    >
      
      <div className="flex justify-between items-center ">
        <div className="flex">
          <h1 className="font-semibold pr-5 text-2xl">Cleaner</h1>
          <div className="flex items-start">
              <>
                <span className="text-lg pt-1">&#8226;</span>
                <h2 className="pl-2 text-lg">To clean a home</h2>
              </>
          </div>
        </div>
          <h2>Recommended by Mentor</h2>
          <div className="flex flex-col items-end space-y-2">
          <div
            className="bg-primary hover:bg-secondary-dark text-white px-10 py-2 rounded-full cursor-pointer text-center"
          >
            Details
          </div>
            <button
             className="bg-primary hover:bg-secondary-dark text-white px-10 py-2 rounded-full cursor-pointer"
            >
              Apply
            </button>
        </div>
      </div>
    </div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobListing
                  key={job.id}
                  job={job}
                  onJobClick={handleJobClick}
                />
              ))
            ) : (
              <p>No jobs found.</p>
            )}
          </div>

          {selectedJob && (
            <div
              ref={detailsRef}
              className="w-1/2 overflow-auto shadow-lg rounded-lg transition-opacity duration-500"
            >
              <h3 className="text-4xl rounded-tl-lg font-semibold mt-2.5 text-white mb-4 px-3 py-2 pt-3 bg-primary w-full ">
                {selectedJob.id}
              </h3>
              <div className="space-y-3 px-4">
                <p className="text-md">
                  <span className="text-2xl font-medium text-primary">
                    {selectedJob.Description}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">
                    Requirements:
                  </strong>{" "}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.Requirements}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">Salary:</strong>{" "}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.Salary}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">Location:</strong>{" "}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.Location}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">
                    Availability:
                  </strong>{" "}
                  <span className="text-xl font-medium text-primary">
                    {selectedJob.Availability}
                  </span>
                </p>
                <button
                  className="mt-5 py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const JobListingStyle = () => {
  return (
    <div className="w-full bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="bg-green-800 p-2">
          <span className="font-bold text-lg">Long Technician II</span>
        </div>
        <div>
          <p>Help employees with their IT problems</p>
          <p className="font-bold">Requirements:</p>
          <ul className="list-inside list-disc">
            <li>Windows</li>
            <li>Communication skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobList;
JobListing.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Description: PropTypes.string,
    Location: PropTypes.string,
    Availability: PropTypes.string,
    // etc...
  }).isRequired,
  onJobClick: PropTypes.func.isRequired,
};
