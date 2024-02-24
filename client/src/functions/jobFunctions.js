// jobFunctions.js
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Function to get a list of all job listings from the database
const getJobListings = async () => {
  try {
    const jobCollectionRef = collection(db, 'Jobs');
    const jobSnapshot = await getDocs(jobCollectionRef);
    const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(jobList)
    return jobList;
  } catch (error) {
    console.error('Error fetching job listings:', error.message);
    throw error;
  }
};

// Function to get a single job listing by ID
const getJobListingById = async (jobId) => {
  try {
    const jobDocRef = doc(db, 'JobListings', jobId);
    const jobDocSnapshot = await getDoc(jobDocRef);
    if (jobDocSnapshot.exists()) {
      return { id: jobDocSnapshot.id, ...jobDocSnapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching job listing by ID:', error.message);
    throw error;
  }
};

// Function to create a new job listing
const createJobListing = async (jobData) => {
  try {
    const jobCollectionRef = collection(db, 'JobListings');
    const jobDocRef = await addDoc(jobCollectionRef, jobData);
    return { id: jobDocRef.id, ...jobData };
  } catch (error) {
    console.error('Error creating job listing:', error.message);
    throw error;
  }
};

// Function to update a job listing
const updateJobListing = async (jobId, updateData) => {
  try {
    const jobDocRef = doc(db, 'JobListings', jobId);
    await updateDoc(jobDocRef, updateData);
    return { id: jobId, ...updateData };
  } catch (error) {
    console.error('Error updating job listing:', error.message);
    throw error;
  }
};

// Function to delete a job listing
const deleteJobListing = async (jobId) => {
  try {
    const jobDocRef = doc(db, 'JobListings', jobId);
    await deleteDoc(jobDocRef);
    return true;
  } catch (error) {
    console.error('Error deleting job listing:', error.message);
    throw error;
  }
};

export { getJobListings, getJobListingById, createJobListing, updateJobListing, deleteJobListing };
