import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getUserById = async (userId) => {
    try {
      const userDocRef = doc(db, 'Seekers', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const challengesCollectionRef = collection(userDocRef, 'challenges');
        const challengesSnapshot = await getDocs(challengesCollectionRef);
        const challengesData = challengesSnapshot.docs.map(doc => doc.data());
  
        const referencesCollectionRef = collection(userDocRef, 'references');
        const referencesSnapshot = await getDocs(referencesCollectionRef);
        const referencesData = referencesSnapshot.docs.map(doc => doc.data());
  
        const skillsCollectionRef = collection(userDocRef, 'skills');
        const skillsSnapshot = await getDocs(skillsCollectionRef);
        const skillsData = skillsSnapshot.docs.map(doc => doc.data());
  
        const combinedData = {
          ...userData,
          challenges: challengesData,
          references: referencesData,
          skills: skillsData,
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

export { getUserById };