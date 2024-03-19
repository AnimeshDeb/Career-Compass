import { useEffect, useState } from "react";
import { getJobListings } from "../../functions/jobFunctions";
import Navbar from "../../components/navbar/version1/navbar";
import { useLocation } from "react-router-dom";
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

const JobListing = ({ job, onJobClick }) => {
  const location = useLocation();
  const uid = location.state?.uid;
  const userType = location.state?.userType;
  const lowerCaseUserType = userType?.toLowerCase();
  console.log("User type in JobListing is:", userType);

  return (
    <div
      className="cursor-pointer border border-gray-300 p-4 my-2 bg-blue-800 rounded-lg text-white shadow hover:shadow-md relative"
      onClick={() => onJobClick(job)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1>{job.id}</h1>
          <h2>{job.Description}</h2>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div
            className="bg-green-500 text-white px-10 py-2 rounded-full cursor-pointer text-center"
            onClick={(event) => {
              event.stopPropagation();
              onJobClick(job);
            }}
          >
            Details
          </div>
          {lowerCaseUserType === "mentor" ? (
            <button
              className="bg-blue-500 text-white px-10 py-2 rounded-full cursor-pointer"
              onClick={(event) => event.stopPropagation()}
            >
              Recommend
            </button>
          ) : lowerCaseUserType === "seeker" ? (
            <button
              className="bg-blue-500 text-white px-10 py-2 rounded-full cursor-pointer"
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
    <div className="flex flex-col">
      <div className={`flex-grow ${selectedJob ? "w-1/2" : "w-full"}`}>
        <Navbar userType="seeker" />
        <h1 style={{ color: "#0086fe", fontSize: "40px" }}>Job Listings</h1>
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
              isPartTime ? "bg-blue-600" : "bg-blue-500"
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
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListing key={job.id} job={job} onJobClick={handleJobClick} />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      {selectedJob && (
        <div className="w-1/2 h-full fixed top-0 right-0 bg-light-blue-500 shadow-lg p-5 overflow-y-auto">
          <h3>Job Details</h3>
          <p>
            <strong>ID:</strong> {selectedJob.id}
          </p>
          <p>
            <strong>Description:</strong> {selectedJob.Description}
          </p>
          <p>
            <strong>Requirements:</strong> {selectedJob.Requirements}
          </p>
          <p>
            <strong>Salary:</strong> {selectedJob.Salary}
          </p>
          <p>
            <strong>Location:</strong> {selectedJob.Location}
          </p>
          <p>
            <strong>Availability:</strong> {selectedJob.Availability}
          </p>
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-md"
            onClick={() => setSelectedJob(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
