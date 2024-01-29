import "./UserSeeker.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getSeekerById } from '../../../functions/seekerFunctions';
import Footer from "../../../components/footer/footer.jsx"
export default function UserSeeker() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'i0xxrmCRV1bG9i6rAt4Xgprtmy83';
        const fetchedUserData = await getSeekerById(userId);
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
    <div className="main">
      <Navbar className="nav"/>
      {userData && (
        <section className="sec top-sec">
          <div className="banner-container">
            <img className="banner" src={userData.banner} alt="banner" />
            <div className="profile">
              <img src={userData.pictureURL} alt="User" />
              <h3>{userData.name}</h3>
            </div>
          </div>
        </section>
      )}
      {userData && (
        <section className="sec intro-sec">
          <div className="intro-vid">
            <h2>Introduction</h2>
              <video controls>
                <source src={userData.introduction} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
          </div>
          <div className="education">
            <h2>Education</h2>
            {userData.education.map((education, index) => (
              <div className="education-text" key={index}>
                <h4>{education.level}</h4>
                <h4>{education.name}</h4>
                <h4>{education.score}</h4>
              </div>
            ))}
          </div>
          <div className="skill-vid">
            <h2>Skills</h2>
            {userData.skills.map((skill, index) => (
                <video key= {index} controls>
                  <source src={skill.videoURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
            ))}
          </div>
        </section>
      )}

      {userData && (
          <section className="middle">
              <section className="middle-container">
                  <div className="sec challenges-sec">
                    <h2>Challenges</h2>
                    {userData.challenges.map((challenge, index) => (
                      <video key={index} controls>
                          <source src={challenge.videoURL} type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                  <aside className="Maybolin-AI">
                    <p>"Keep on looking. You will find it." - Maybolin AI</p>
                  </aside>
              </section>
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
    </div>
    <Footer/>
    </>
  );
}