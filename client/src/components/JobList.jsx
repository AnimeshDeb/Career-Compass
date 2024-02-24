// client/src/components/JobList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getJobListings } from '../functions/jobFunctions';

const JobListing = ({ job }) => {
  // ... (JobListing code remains unchanged)
};

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedJob = await getJobListings();
        setJobs(fetchedJob);
    console.log(jobs)
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const querySnapshot = await getDocs(collection(db, "jobs"));
  //     const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setJobs(jobsData);
  //   };

  //   fetchData();
  // }, []);

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // const filteredJobs = jobs.filter(job =>
  //   job.Title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div>
      <h1>Job Listings</h1>
      {/* <input
        type="text"
        placeholder="Search for jobs..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }} // Adjust style as needed
      /> */}
    {jobs.map((job, index) => (
        <>
          <h1 key={index}>{job.id}</h1>
        </>
      ))}

      <div style={{ 
        display: searchTerm ? 'block' : 'none', // Only display the box if there is a search term
        border: '1px solid #ddd', // Example box border
        padding: '10px', // Example padding inside the box
        borderRadius: '5px', // Example border radius
        maxHeight: '300px', // Maximum height of the box
        overflowY: 'auto' // Scroll for overflow content
      }}>
        {/* Render the JobListing component for each filtered job */}
        {filteredJobs.map((job) => (
          <JobListing key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
