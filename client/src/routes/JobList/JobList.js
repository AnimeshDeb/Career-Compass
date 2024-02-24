import React, { useState, useEffect } from 'react';
import axios from 'axios'; // make sure to install axios with npm or yarn

const JobListing = () => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch job data when the component mounts
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get('"career-compass-77175.firebaseapp.com",'); // Replace with your actual API endpoint
        setJobData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job data: ', error);
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  // The rest of your component logic...
  
  if (loading) {
    return <p>Loading job listings...</p>;
  }

  return (
    <div>
      {jobData && jobData.length > 0 ? (
        <div>
          {jobData.map((job, index) => (
            <div key={index}>
              <h2>Job Title: {job.title}</h2>
              <p>Description: {job.description}</p>
              <p>Location: {job.location}</p>
              <p>Full Time: {job.isFullTime ? 'Yes' : 'No'}</p>
              {/* ... and so on for the other job fields */}
            </div>
          ))}
        </div>
      ) : (
        <p>No job listings available.</p>
      )}
    </div>
  );
};

export default JobListing;
