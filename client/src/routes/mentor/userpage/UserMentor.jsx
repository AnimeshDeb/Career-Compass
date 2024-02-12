import "./UserMentor.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getMentorById } from '../../../functions/mentorFunctions.js';
import Footer from "../../../components/footer/footer.jsx"
import Carousel from "react-multi-carousel"
import 'react-multi-carousel/lib/styles.css'
import Audio_Btn from "../../../components/Buttons/audio__btn/audio_btn.jsx";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");

  useEffect(() => {
      function handleResize() {
          setWindowWidth(window.innerWidth);
      }

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      if (windowWidth < 400) {
          setIconSize("xs");
      } else if (windowWidth < 769) {
          setIconSize("lg");
      } else {
          setIconSize("2x");
      }
  }, [windowWidth]);

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
        <div className="men-navbar">
          <Navbar className="men-navbar" userType={"mentor"} iconSize={iconSize}/>
        </div>
        {userData && (
          <UserBanner banner={userData.banner} iconSize={iconSize} picture={userData.pictureURL} name={userData.displayName}/>
        )}
        {userData && (
          <section className="men-sec men-intro-sec">
            <h2>Introduction</h2>
            <div className="men-intro-content">
              <p>{userData.intro_text}</p>
              <Audio_Btn className="audio-btn" audioSrc={userData.intro_audio} iconSize={iconSize}></Audio_Btn>
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
        <Footer/>
      </div>
    </>
  );
}