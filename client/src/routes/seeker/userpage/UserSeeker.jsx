import "./UserSeeker.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getUserById } from '../../../functions/seekerFunctions';

export default function UserSeeker() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'i0xxrmCRV1bG9i6rAt4Xgprtmy83';
        const fetchedUserData = await getUserById(userId);
        console.log(fetchedUserData)
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching user by ID:', error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Navbar />
      {userData && (
        <section className="intro-sec">
          <div className="profile">
            <img src={userData.pictureURL} alt="User" />
            <h3>{userData.username}</h3>
          </div>
          <div className="intro-vid">
            <h2>Introduction</h2>
            <video controls>
              <source src={userData.introduction} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="education">
            <h2>Education</h2>
          </div>
        </section>
      )}

      {userData && (
        <section className="skills-sec">
          <h2>Skills</h2>
        </section>
      )}

      {userData && (
        <section className="middle">
          <section className="challenges-sec">
            <h2>Challenges</h2>
          </section>
          <aside className="Maybolin-AI">
          </aside>
        </section>
      )}

      {userData && (
        <section className="references-sec">
          <h2>References</h2>
        </section>
      )}
    </>
  );
}