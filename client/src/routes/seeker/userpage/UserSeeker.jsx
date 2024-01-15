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
        <section className="sec intro-sec">
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
        <section className="sec skills-sec">
          <h2>Skills</h2>
          {userData.skills.map((skill, index) => (
            <div key={index}>
              <video controls>
                <source src={skill.videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </section>
      )}

      {userData && (
          <section className="middle">
              <div className="middle-container">
                  <section className="sec challenges-sec">
                      <h2>Challenges</h2>
                      {userData.challenges.map((challenge, index) => (
                          <div key={index}>
                              <video controls>
                                  <source src={challenge.videoURL} type="video/mp4" />
                                  Your browser does not support the video tag.
                              </video>
                          </div>
                      ))}
                  </section>
                  <aside className="Maybolin-AI">
                    <p>"Keep on looking. You will find it!" - Maybolin AI</p>
                  </aside>
              </div>
          </section>
      )}

      {userData && (
        <section className="sec references-sec">
          <h2>References</h2>
          {userData.references.map((reference, index) => (
            <div className="reference-item" key={index}>
              <div className="top-company">
                <h3 className="company-name">{reference.name}, {reference.company},</h3>
                <h3 className="company-email">{reference.email}</h3>
              </div>
              <p>
                {reference.desc}
              </p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}