import { getDoc,addDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';
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
const deleteImageFromStorage = async (imageUrl) => {
  const imageRef = storageRef(storage, imageUrl);
  try {
    await deleteObject(imageRef);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
const uploadFileToStorage = async (file, path) => {
  try {
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to storage:', error.message);
    throw error;
  }
};
const updateUserGallery = async(object, userId) =>{
  try{
    const userDocRef = doc(db, 'Mentors', userId);
    const gallerySubcollectionRef = collection(userDocRef, "gallery");
  
    await addDoc(gallerySubcollectionRef, object)
  } catch(error){
    console.log("Error updating gallery:", error.message);
    throw error;
  }
}
const updateUserField = async(object,userId)=>{
  try{
    const userDocRef = doc(db, 'Mentors', userId);
    await updateDoc(userDocRef, object)
  } catch(error){
    console.log("Error updating field:", error.message);
    throw error;
  }
};
const getMentorById = async (userId) => {
    try {
      const userDocRef = doc(db, 'Mentors', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const galleryCollectionRef = collection(userDocRef, 'gallery');
        const gallerySnapshot = await getDocs(galleryCollectionRef);
        const galleryData = gallerySnapshot.docs.map(doc => doc.data());
        const combinedData = {
          ...userData,
          gallery: galleryData,
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

export { deleteImageFromStorage, uploadFileToStorage, deleteFilesInFolder, updateUserField, getMentorById };