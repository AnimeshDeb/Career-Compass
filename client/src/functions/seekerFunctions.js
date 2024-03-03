import { getDoc, query, where, doc,deleteDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref as storageRef, uploadBytes, listAll, deleteObject  } from 'firebase/storage';

const deleteFilesInFolder = async (folderPath) => {
  const folderRef = storageRef(storage, folderPath);

  try {
    const fileList = await listAll(folderRef);
    const deletionPromises = fileList.items.map(fileRef => {
      return deleteObject(fileRef);
    });
    await Promise.all(deletionPromises);
    console.log('All files in folder deleted successfully');
  } catch (error) {
    console.error('Error deleting files in folder:', error);
    throw error;
  }
};
const deleteReference = async (userId, refFields) => {
  const userDocRef = doc(db, "Seekers", userId);
  const referencesSubcollectionRef = collection(userDocRef, "references");
  const queryRef = query(referencesSubcollectionRef, where("email", "==", refFields.email)); // Use the appropriate field to match
  const snapshot = await getDocs(queryRef);

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await deleteDoc(docRef);
    console.log("Reference deleted successfully");
  } else {
    console.error("No matching reference found to delete");
  }
}
const uploadFileToStorage = async (file, path) => {
  try {
    console.log(file,path)
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to storage:', error.message);
    throw error;
  }
};

const updateUserField = async(object,userId)=>{
  try{
    console.log(object)
    const userDocRef = doc(db, 'Seekers', userId);
    await updateDoc(userDocRef, object)
  } catch(error){
    console.log("Error updating field:", error.message);
    throw error;
  }
};

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
      const referencesData = await getSubcollectionData(userDocRef, 'References');
      const educationData = await getSubcollectionData(userDocRef, 'Education');
      const jobsData = await getSubcollectionData(userDocRef, 'Jobs');
      const combinedData = {
        ...userData,
        jobs: jobsData,
        references: referencesData,
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

export { getSeekerById, deleteReference, updateUserField, deleteFilesInFolder, getSeekerJobsById, uploadFileToStorage};