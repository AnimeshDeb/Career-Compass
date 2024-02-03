import "./UserMentor.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getCompanyById } from '../../../functions/mentorFunctions.js';
import Footer from "../../../components/footer/footer.jsx"

export default function UserMentor() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'N5wtfaCiNSe1Yh85tr8hjA4ygsO2';
        const fetchedUserData = await getCompanyById(userId);
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
        <Navbar/>
        {userData && (
            <section className="sec top-sec">
            <div className="banner-container">
                <img className="banner" src={userData.banner} alt="banner" />
                <div className="men-profile">
                <img src={userData.logo} alt="User" />
                <h3>{userData.displayName}</h3>
                </div>
            </div>
            </section>
        )}
        {userData && (
          <section className="sec intro-sec">
            <h3>Introduction</h3>
            <p>{userData.intro_text}</p>
          </section>
        )}
        {userData && (
            <section className="sec video-sec">
                <video controls>
                <source src={userData.intro_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </section>
        )}
        {userData && (
          <section className="sec gallery-sec">
            <h2>Gallery</h2>
            {userData.gallery.map((reference, index) => (
              <div className="gallery-item" key={index}>
                Hello
              </div>
            ))}
          </section>
        )}
      </div>  
      <Footer/>
    </>
  );
}