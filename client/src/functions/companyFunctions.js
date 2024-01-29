import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getCompanyById = async (userId) => {
    try {
      const userDocRef = doc(db, 'Companies', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const combinedData = {
          ...userData,
        };
        console.log(combinedData)
        return combinedData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      throw error;
    }
  };

export { getCompanyById };