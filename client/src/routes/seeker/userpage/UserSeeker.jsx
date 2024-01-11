import "./UserSeeker.css";
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase.js';

export default function UserSeeker() {
  const [seekers, setSeekers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, 'Users');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched data:', usersData);
        setSeekers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>User Page</h1>
        <ul>
          {seekers.map((seeker, index) => (
            <li key={index}>
              Username: {seeker.Username}, Password: {seeker.Password}, UID: {seeker.UID}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}