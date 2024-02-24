import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your Firebase configuration object from your Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyDnuD5SMMOsLCSg2ipySD-Ogq5j-yDEr3g",
    authDomain: "career-compass-77175.firebaseapp.com",
    projectId: "career-compass-77175",
    storageBucket: "career-compass-77175.appspot.com",
    messagingSenderId: "481616322840",
    appId: "1:481616322840:web:6e1293fe80c1a76dfcbe6d",
    measurementId: "G-81EESP6VFY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

async function getJobDetails(jobId) {
  const docRef = doc(db, "Jobs", jobId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

// Call the function with the job title as the document ID
getJobDetails('Cashier')
  .then(jobDetails => {
    if(jobDetails) {
      console.log('Job details:', jobDetails);
    }
  })
  .catch(error => {
    console.error("Error getting document:", error);
  });
