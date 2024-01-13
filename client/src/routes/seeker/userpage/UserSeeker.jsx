import "./UserSeeker.css";
import Navbar from "../../../components/navbar/navbar.jsx"
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
      <Navbar/>
      <section className="intro-sec">
        <div className="image">
          <img src=""></img>
        </div>
        <div className="video">
          <h2>Introduction</h2>
        </div>
        <div className="education">
          <h2>Education</h2>
        </div>
      </section>

      <section className="skills-sec">
        <h2>Skills</h2>
      </section>

      <section className="middle">
        <section className="challenges-sec">
          <h2>Challenges</h2>
        </section>
        <aside className="Maybolin-AI">

        </aside>
      </section>

      <section className="references-sec">
        <h2>References</h2>
      </section>
    </>
  );
}