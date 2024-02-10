import "./UserCompany.css";
import Navbar from "../../../components/navbar/navbar.jsx"
import { useEffect, useState } from 'react';
import { getCompanyById } from '../../../functions/companyFunctions.js';
import Footer from "../../../components/footer/footer.jsx"
import Carousel from "react-multi-carousel"
import 'react-multi-carousel/lib/styles.css'
import Audio_Btn from "../../../components/Buttons/audio__btn/audio_btn.jsx";
import Edit_Btn from "../../../components/Buttons/edit_btn/edit_btn.jsx";
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

export default function UserCompany() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
          <UserBanner banner={userData.banner} picture={userData.logo} name={userData.displayName}/>
        )}
        {userData && (
          <section className="com-sec com-intro-sec">
            <h2>Introduction</h2>
            <p>{userData.intro_text}</p>
            <Audio_Btn className="audio-btn" audioSrc={userData.intro_audio}></Audio_Btn>
          </section>
        )}
        {userData && (
            <section className="com-sec com-video-sec">
                <video controls>
                <source src={userData.intro_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </section>
        )}
          <section className="com-sec gallery-sec">
            <h2>Company Life</h2>
              {userData && (
                <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={3000}>
                  {userData.CompanyLife.map((image, index) => (
                    <div className="gallery-item" key={index}>
                      <img  src={image.imageURL} alt="Picture" />
                    </div>
                  ))}
                </Carousel>
              )}
          </section>
      </div>  
      <div className="com-footer">
        <Footer className="com-footer"/>
      </div>
    </>
  );
}