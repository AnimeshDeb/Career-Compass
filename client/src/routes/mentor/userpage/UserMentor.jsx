import "./UserMentor.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getMentorById } from '../../../functions/mentorFunctions.js';
import Footer from "../../../components/footer/footer.jsx"
import Carousel from "react-multi-carousel"
import 'react-multi-carousel/lib/styles.css'
import Audio_Btn from "../../../components/btn_audio/audio_btn.jsx";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

export default function UserMentor() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = '42Aw4GuY4bsANuED2UEY';
        const fetchedUserData = await getMentorById(userId);
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
            <section className="men-sec top-sec">
            <div className="banner-container">
                <img className="banner" src={userData.banner} alt="banner" />
                <div className="men-profile">
                <img src={userData.pictureURL} alt="User" />
                <h3>{userData.displayName}</h3>
                </div>
            </div>
            </section>
        )}
        {userData && (
          <section className="men-sec men-intro-sec">
            <h2>Introduction</h2>
            <div className="men-intro-content">
              <p>{userData.intro_text}</p>
              <Audio_Btn className="audio-btn" audioSrc={userData.intro_audio}></Audio_Btn>
            </div>
          </section>
        )}
        {userData && (
            <section className="men-sec men-video-sec">
                <video controls>
                <source src={userData.intro_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </section>
        )}
          <section className="men-sec gallery-sec">
            <h2>Gallery</h2>
              {userData && (
                <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={3000}>
                  {userData.gallery.map((image, index) => (
                    <div className="gallery-item" key={index}>
                      <img  src={image.imageURL} alt="Picture" />
                    </div>
                  ))}
                </Carousel>
              )}
          </section>
      </div>  
      <div className="men-footer">
        <Footer className="men-footer"/>
      </div>
    </>
  );
}