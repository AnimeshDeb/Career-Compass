import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';
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

const uploadFileToStorage = async (file, path) => {
  try {
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
    const userDocRef = doc(db, 'Companies', userId);
    await updateDoc(userDocRef, object)
  } catch(error){
    console.log("Error updating field:", error.message);
    throw error;
  }
};
const getCompanyById = async (userId) => {
    try {
      const userDocRef = doc(db, 'Companies', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const galleryCollectionRef = collection(userDocRef, 'CompanyLife');
        const gallerySnapshot = await getDocs(galleryCollectionRef);
        const galleryData = gallerySnapshot.docs.map(doc => doc.data());
        const combinedData = {
          ...userData,
          CompanyLife: galleryData,
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

export { getCompanyById, updateUserField, uploadFileToStorage, deleteFilesInFolder};