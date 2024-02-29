// Import necessary hooks from React library
import { useEffect, useState } from "react";
// Import a function to fetch job listings from a relative path
import { getJobListings } from "../functions/jobFunctions";

// Define a functional component to display individual job listings
const JobListing = ({ job, onJobClick }) => {
  // Return a div that displays the job's ID and calls onJobClick with the job object when clicked
  return (
    <div onClick={() => onJobClick(job)} style={{ cursor: 'pointer' }}>
      <h1>{job.id}</h1>
      <h2>{job.Description}</h2>
      <h2>{job.Requirements}</h2>
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

  // Use useEffect hook to fetch job listings when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Asynchronously fetch job listings and update the jobs state
        const fetchedJobs = await getJobListings();
        setJobs(fetchedJobs);
      } catch (error) {
        // Log an error message if fetching jobs fails
        console.error("Error fetching jobs:", error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this effect runs only once after initial render

  // Define a function to handle clicks on job listings
  const handleJobClick = (job) => {
    setSelectedJob(job); // Update the selectedJob state with the clicked job
  };

  // Define a function to filter jobs based on the search term
  const filterJobs = (jobs, searchTerm) => {
    if (!searchTerm) return jobs; // Return all jobs if no search term is entered
    return jobs.filter((job) => {
      const idString = job.id.toString();
      return idString.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Filter jobs using the search term
  const filteredJobs = filterJobs(jobs, searchTerm);

  // Render the JobList component
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1, width: selectedJob ? '50%' : '100%' }}>
        <h1>Job Listings</h1>
        <input
          type="text"
          placeholder="Search for jobs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListing key={job.id} job={job} onJobClick={handleJobClick} />
            
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      
      {selectedJob && (
        <div style={{
          width: '50%',
          height: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          backgroundColor: '#ADD8E6',
          boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <h3>Job Details</h3>
          <p><strong>ID:</strong> {selectedJob.id}</p>
          <p><strong>Title:</strong> {selectedJob.Title}</p>
          <p><strong>Description:</strong> {selectedJob.Description}</p>
          <p><strong>Requirements:</strong> {selectedJob.Requirements}</p>
          <p><strong>Salary Range:</strong> {selectedJob.Salary}</p>
          {/* Additional job details can be displayed here */}
          <button onClick={() => setSelectedJob(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Export the JobList component for use in other parts of the application
export default JobList;
