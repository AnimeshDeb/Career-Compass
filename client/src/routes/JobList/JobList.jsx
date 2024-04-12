import { useEffect, useState, useRef } from 'react';
import { getJobListings } from '../../functions/jobFunctions';
import Navbar from '../../components/navbar/version1/navbar';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from '../../components/footer/footer';
import anime from 'animejs';
import { doc, getDoc, runTransaction, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const JobListing = ({
  job,
  onJobClick,
  isRecommended,
  selectedJob,
  showDropdown,
  toggleDropdown,
}) => {
  const location = useLocation();
  const userType = location.state?.userType;
  const userId = location.state?.userId;
  const lowerCaseUserType = userType?.toLowerCase();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [groups, setGroups] = useState([]);
  const [mentees, setMentees] = useState([]);
  const bgColorClass = isRecommended ? 'bg-secondary' : 'bg-primary';
  const btnColor = isRecommended
    ? 'bg-primary hover:bg-primary-light'
    : 'bg-secondary hover:bg-secondary-light';

  useEffect(() => {
    if (selectedGroup) {
      const currentGroup = groups.find((group) => group.id === selectedGroup);
      console.log('Current', selectedGroup, currentGroup);
      if (currentGroup && currentGroup.mentees) {
        const menteesArray = Object.entries(currentGroup.mentees).map(
          ([id, mentee]) => ({
            id,
            ...mentee,
          })
        );
        setMentees(menteesArray);
      } else {
        setMentees([]);
      }
    }
  }, [selectedGroup, groups]);
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!userId) return;

      const userRef = doc(db, 'Mentors', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const groupIds = userData.groups || [];
        const groupsDetailsPromise = groupIds.map(async (groupId) => {
          const groupRef = doc(db, 'Groups', groupId);
          const groupSnap = await getDoc(groupRef);
          if (groupSnap.exists()) {
            return { id: groupId, ...groupSnap.data() };
          } else {
            console.log('No such group!');
            return null;
          }
        });

        const groupsDetails = await Promise.all(groupsDetailsPromise);
        setGroups(groupsDetails.filter((group) => group));
      } else {
        console.log('No such user!');
      }
    };

    fetchUserGroups();
  }, [userId]);

  const recommendJob = async (groupId, menteeId, jobId) => {
    if (!groupId || !menteeId || !jobId) {
      console.error('Missing groupId, menteeId, or jobId');
      return;
    }

    try {
      const menteeRef = doc(db, 'Seekers', menteeId);
      await runTransaction(db, async (transaction) => {
        const menteeDoc = await transaction.get(menteeRef);
        if (!menteeDoc.exists()) {
          console.error('Document does not exist!');
          return;
        }
        const currentRecommendations = menteeDoc.data().recommended || [];
        if (!currentRecommendations.includes(jobId)) {
          transaction.update(menteeRef, {
            recommended: arrayUnion(jobId),
          });
        }
      });

      alert('Job recommended successfully!');
    } catch (error) {
      console.error('Failed to recommend job:', error);
    }
  };
  return (
    <div
      className={`cursor-pointer border border-gray-300 p-4 my-2 ${bgColorClass} rounded-lg text-white shadow hover:shadow-md relative`}
      onClick={() => onJobClick(job)}
    >
      <div className="flex justify-between items-center ">
        <div className="">
          <h1 className="font-semibold pr-5 text-2xl">{job.title}</h1>
          <div className="flex items-start">
            <>
              <span className="text-lg pt-1">&#8226;</span>
              <h2 className="pl-2 text-lg">
                {job.position_summary?.split('.')[0] + '.' ||
                  'No summary available.'}
              </h2>
            </>
          </div>
        </div>
        {isRecommended && <h2>Recommended by Mentor</h2>}
        <div className="flex flex-col items-end space-y-2">
          <div
            className={`${btnColor} text-white px-10 py-2 rounded-full cursor-pointer text-center`}
          >
            Details
          </div>
          {lowerCaseUserType === 'seeker' && (
            <button
              className={`${btnColor} text-white px-10 py-2 rounded-full cursor-pointer`}
            >
              Apply
            </button>
          )}
          {lowerCaseUserType === 'mentor' && (
            <div>
              <button
                className={`${btnColor} text-white px-10 py-2 rounded-full cursor-pointer`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleDropdown(job.id);
                }}
              >
                Recommend
              </button>

              {showDropdown && (
                <div
                  className={`absolute z-20 right-1/4 mt-2 w-3/4 bg-white shadow-lg rounded-lg p-4 `}
                >
                  <p className="text-primary font-bold">Select Group</p>
                  <select
                    className="block w-full text-primary mt-1 border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={selectedGroup}
                    onChange={(e) => {
                      setSelectedGroup(e.target.value);
                      setSelectedMentee('');
                    }}
                  >
                    <option disabled value="">
                      Select Group
                    </option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-primary mt-2 font-bold">Select Mentee</p>
                  <select
                    className="block text-primary w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={selectedMentee}
                    onChange={(e) => setSelectedMentee(e.target.value)}
                  >
                    Select Mentee
                    <option className="text-primary " disabled value="">
                      Select Mentee
                    </option>
                    {mentees.map((mentee) => (
                      <option key={mentee.id} className="" value={mentee.id}>
                        {mentee.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() =>
                      recommendJob(selectedGroup, selectedMentee, job.id)
                    }
                  >
                    Recommend
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobList = () => {
  const location = useLocation();
  const userType = location.state?.userType;
  const userId = location.state?.userId;
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [isPartTime, setIsPartTime] = useState(false);
  const detailsRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState('2x');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const pageSize = 10;
  const handleShowMoreJobs = () => {
    setCurrentIndex((prevIndex) => prevIndex + pageSize);
  };
  const toggleDropdown = (jobId) => {
    if (openDropdownId === jobId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(jobId);
    }
  };
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      const menteeRef = doc(db, 'Seekers', userId);
      const docSnap = await getDoc(menteeRef);
      if (docSnap.exists() && docSnap.data().recommended) {
        const recommendedIds = docSnap.data().recommended;

        const recommendedJobDetails = await Promise.all(
          recommendedIds.map(async (id) => {
            const jobRef = doc(db, 'Jobs', id);
            const jobSnap = await getDoc(jobRef);
            return jobSnap.exists()
              ? { id: jobSnap.id, ...jobSnap.data() }
              : null;
          })
        );

        setRecommendedJobs(recommendedJobDetails.filter((job) => job !== null));
      }
    };

    if (userId && userType === 'seeker') {
      fetchRecommendedJobs();
    }
  }, [userId, userType]);
  useEffect(() => {
    if (windowWidth < 400) {
      setIconSize('xs');
    } else if (windowWidth < 769) {
      setIconSize('lg');
    } else {
      setIconSize('2x');
    }
  }, [windowWidth]);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedJobs = await getJobListings();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (selectedJob && detailsRef.current) {
      anime({
        targets: detailsRef.current,
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 700,
      });
    }
  }, [selectedJob]);
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setIsPartTime(false);
  };

  const filterJobs = (jobs, searchTerm, locationFilter, isPartTime) => {
    return jobs.filter((job) => {
      const idString = job.id ? job.id.toString().toLowerCase() : '';
      const descriptionString = job.Description
        ? job.Description.toLowerCase()
        : '';
      const matchesIdOrDescription =
        idString.includes(searchTerm.toLowerCase()) ||
        descriptionString.includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter
        ? job.Location === locationFilter
        : true;
      const matchesPartTime = isPartTime
        ? job.Availability === 'Part Time'
        : true;
      return (
        !recommendedJobs.some((rJob) => rJob.id === job.id) &&
        matchesIdOrDescription &&
        matchesLocation &&
        matchesPartTime
      );
    });
  };

  const filteredJobs = filterJobs(jobs, searchTerm, locationFilter, isPartTime);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar
          userType={userType}
          iconSize={iconSize}
          currentPage={'joblist'}
          userId={userId}
        />
        <div className="px-3">
          <h1 className="text-7xl pt-2 font-bold text-primary">Jobs</h1>
          <div className="md:flex items-center mb-4">
            <input
              type="text"
              placeholder="Search for jobs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2 w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mr-2 px-4 py-2 border mt-2 border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Locations</option>
              {states.map((state) => (
                <option value={state} key={state}>
                  {state}
                </option>
              ))}
            </select>

            {currentIndex + pageSize < filteredJobs.length && (
              <button
                onClick={handleShowMoreJobs}
                className="my-4 mx-auto py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors"
              >
                Show More
              </button>
            )}

            <button
              className={`py-2 px-4 ${
                isPartTime ? 'bg-primary' : 'bg-secondary'
              } text-white rounded-md mr-2`}
              onClick={() => setIsPartTime(!isPartTime)}
            >
              {isPartTime ? 'Part-Time Only' : 'All Jobs'}
            </button>
            <button
              className="py-2 px-4 bg-secondary text-white rounded-md"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
        <div
          className={`flex-grow relative ${
            selectedJob ? 'md:flex md:flex-row' : ''
          }`}
        >
          <div
            className={`px-2 overflow-auto transition-all duration-500 ease-in-out ${
              selectedJob ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            {recommendedJobs.length > 0 && (
              <div>
                <h2 className="px-3 text-xl font-semibold text-secondary">
                  Recommended for You
                </h2>
                {recommendedJobs.map((job) => (
                  <JobListing
                    key={job.title}
                    job={job}
                    selectedJob={selectedJob}
                    onJobClick={handleJobClick}
                    isRecommended={true}
                    showDropdown={openDropdownId === job.id}
                    toggleDropdown={toggleDropdown}
                  />
                ))}
              </div>
            )}
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobListing
                  key={job.id}
                  job={job}
                  selectedJob={selectedJob}
                  onJobClick={handleJobClick}
                  isRecommended={false}
                  showDropdown={openDropdownId === job.id}
                  toggleDropdown={toggleDropdown}
                />
              ))
            ) : (
              <p>No jobs found.</p>
            )}
          </div>

          {selectedJob && (
            <div
              ref={detailsRef}
              className={`absolute top-0 left-0 w-full h-full overflow-auto shadow-lg rounded-lg bg-white md:relative md:w-1/2 transition-all duration-500 ease-in-out z-10 ${
                selectedJob ? 'block' : 'hidden'
              }`}
            >
              <h3 className="text-4xl rounded-tl-lg font-semibold mt-2.5 text-white mb-4 px-3 py-2 pt-3 bg-primary w-full ">
                {selectedJob.title}
              </h3>
              <div className="flex flex-col space-y-3 px-4">
                <p className="text-md">
                  <span className="text-2xl font-medium text-primary">
                    {selectedJob.Description}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">
                    Company Name:
                  </strong>{' '}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.company}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">Salary:</strong>{' '}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.pay_range}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">Location:</strong>{' '}
                  <span className="text-lg font-medium text-primary">
                    {selectedJob.location}
                  </span>
                </p>
                <p className="text-md">
                  <strong className="text-secondary text-xl">
                    Position Summary:
                  </strong>{' '}
                  <span className="text-xl font-medium text-primary">
                    {selectedJob.position_summary}
                  </span>
                </p>
                <button
                  className="mt-5 py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors"
                  onClick={() => {
                    window.location.href = selectedJob.url;
                  }}
                >
                  Apply
                </button>

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

export default JobList;
JobListing.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Description: PropTypes.string,
    Location: PropTypes.string,
    Availability: PropTypes.string,
  }).isRequired,
  onJobClick: PropTypes.func.isRequired,
};
