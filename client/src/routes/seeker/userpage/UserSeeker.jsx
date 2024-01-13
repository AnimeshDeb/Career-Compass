import "./UserSeeker.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import axios from 'axios'
import { useEffect } from 'react';

export default function UserSeeker() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user/i0xxrmCRV1bG9i6rAt4Xgprtmy83');
        console.log('Fetched user by ID:', response.data);
      } catch (error) {
        console.error('Error fetching user by ID:', error.message);
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