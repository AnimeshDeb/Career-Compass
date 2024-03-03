// Import necessary hooks from React library
import { useEffect, useState } from "react";
// Import a function to fetch job listings from a relative path
import { getJobListings } from "../../functions/jobFunctions";

// Define a functional component to display individual job listings
const JobListing = ({ job, onJobClick }) => {
  // Style for the job listing container with a border
  const jobListingStyle = {
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "16px",
    margin: "8px 0",
    backgroundColor: "#2e318e",
    borderRadius: "10px",
    color: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const greenBoxStyle = {
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    minWidth: "10px", // A minimum width for the green box to contain the "Details" text
    backgroundColor: "green", // Green color for the box
    color: "white", // Text color
    border: "none",
    borderRadius: "40px",
    padding: "10px", // Padding inside the green box
    marginLeft: "1700px", // Space between the green box and the job title
    cursor: "pointer", // Change cursor to pointer when hovering over the box
  };

  const applyButtonStyle = {
    backgroundColor: "blue", // Blue color for the apply button
    color: "white", // Text color for the apply button
    padding: "10px 125px", // Padding inside the apply button
    minWidth: "10px",
    border: "none", // No border for the apply button
    borderRadius: "40px", // Rounded corners for the apply button
    cursor: "pointer", // Change cursor to pointer when hovering over the button
    marginLeft: "1700px",
    textDecoration: "none", // No underline for the text
  };

  return (
    <div style={jobListingStyle} onClick={() => onJobClick(job)}>
      <div>
        <div style={greenBoxStyle}>
          Details {/* Text inside the green box */}
        </div>
        <div>
          {" "}
          {/* Job details */}
          <h1>{job.id}</h1>
          <h2>{job.Description}</h2>
        </div>
      </div>
      {/* Apply button */}
      <button
        style={applyButtonStyle}
        onClick={(event) => handleApplyClick(event, job)}
      >
        Apply
      </button>
    </div>
  );
};

// Define the main functional component to display the job list
const JobList = () => {
  // Initialize state for search term with default empty string
  const [searchTerm, setSearchTerm] = useState("");
  // Initialize state for storing jobs with default empty array
  const [jobs, setJobs] = useState([]);
  // Initialize state for selected job with default null
  const [selectedJob, setSelectedJob] = useState(null);
  // Initialize state for showing the location submenu
  const [showLocationSubMenu, setShowLocationSubMenu] = useState(false);
  const [locationFilter, setLocationFilter] = useState(""); // Added state for location filter

  // Placeholder for the location submenu action
  const handleLocationClick = (location) => {
    console.log("Location filter to be implemented:", location);
    // Here you would filter the jobs by the selected location
  };

  // Use useEffect hook to fetch job listings when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedJobs = await getJobListings();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    fetchData();
  }, []);

  // Define a function to handle clicks on job listings
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  // Define a function to filter jobs based on the search term
  const filterJobs = (jobs, searchTerm) => {
    if (!searchTerm) return jobs;
    return jobs.filter((job) => {
      const idString = job.id.toString();
      return idString.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Toggle the location submenu
  const toggleLocationSubMenu = () => {
    setShowLocationSubMenu(!showLocationSubMenu);
  };

  // Filter jobs using the search term
  const filteredJobs = filterJobs(jobs, searchTerm);

  // Render the JobList component
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1, width: selectedJob ? "50%" : "100%" }}>
        <h1>Job Listings</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Search for jobs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "8px", width: "300px" }}
          />
          <button onClick={toggleLocationSubMenu}>Filter</button>{" "}
          {/* Toggles the location submenu */}
        </div>
        {showLocationSubMenu && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px",
              border: "1px solid #ddd",
            }}
          >
            <button onClick={() => handleLocationClick("New York")}>
              New York
            </button>
            <button onClick={() => handleLocationClick("San Francisco")}>
              San Francisco
            </button>
            <button onClick={() => handleLocationClick("Austin")}>
              Austin
            </button>
            {/* More locations can be added here */}
          </div>
        )}
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListing key={job.id} job={job} onJobClick={handleJobClick} />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      {selectedJob && (
        <div
          style={{
            width: "50%",
            height: "100%",
            position: "fixed",
            top: 0,
            right: 0,
            backgroundColor: "#ADD8E6",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h3>Job Details</h3>
          <p>
            <strong>ID:</strong> {selectedJob.id}
          </p>
          <p>
            <strong>Title</strong> {selectedJob.Title}
          </p>
          <p>
            <strong>Description:</strong> {selectedJob.Description}
          </p>
          <p>
            <strong>Requirements:</strong> {selectedJob.Requirements}
          </p>
          <p>
            <strong>Salary Range:</strong> {selectedJob.Salary}
          </p>
          <p>
            <strong>Location:</strong> {selectedJob.Location}
          </p>
          {/* Additional job details can be displayed here */}
          <button onClick={() => setSelectedJob(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Export the JobList component for use in other parts of the application
export default JobList;
