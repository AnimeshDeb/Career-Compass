import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getSubcollectionData = async (parentDocRef, subcollectionName) => {
  const collectionRef = collection(parentDocRef, subcollectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => doc.data());
};

const getSeekerJobsById = async (userId) => {
  try {
    const userDocRef = doc(db, 'Seekers', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const jobsData = await getSubcollectionData(userDocRef, 'challenges');
      return {jobs: jobsData}
    }
  } catch(error){
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

const getSeekerById = async (userId) => {
  try {
    const userDocRef = doc(db, 'Seekers', userId);
    const userDocSnapshot = await getDoc(userDocRef);
  
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const challengesData = await getSubcollectionData(userDocRef, 'challenges');
      const referencesData = await getSubcollectionData(userDocRef, 'references');
      const skillsData = await getSubcollectionData(userDocRef, 'skills');
      const educationData = await getSubcollectionData(userDocRef, 'education');
  
      const combinedData = {
        ...userData,
        challenges: challengesData,
        references: referencesData,
        skills: skillsData,
        education: educationData,
      };
  
      return combinedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

export { getSeekerById, getSeekerJobsById };