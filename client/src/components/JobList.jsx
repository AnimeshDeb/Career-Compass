// client/src/components/JobList.jsx
import { useEffect, useState } from "react";
import { getJobListings } from "../functions/jobFunctions";

const JobListing = ({ job }) => {
  // ... (JobListing code remains unchanged)
};

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState(null);

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
      {jobs ? (
        jobs.map((job, index) => (
          <div key={index}>
            <h2>{job.id}</h2>
          </div>
        ))
      ) : (
        <p>Loading jobs...</p>
      )}
    </div>
  );
};

export default JobList;
