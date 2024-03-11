import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Audio_Btn from "../../../../components/Buttons/audio__btn/audio_btn";
import PropTypes from "prop-types";
import { useEffect } from "react";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function UserMode({ userData, iconSize }) {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = window.location.pathname.split('/')[2]; // Get the user ID from the URL
        const fetchedUserData = await getMentorById(userId);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      {userData ? (
        <>
          <section className="men-sec men-intro-sec">
            <h2>Introduction</h2>
            <div className="men-intro-content">
              <p>{userData.intro_text || "Introduction text not available"}</p>
              {userData.intro_audio ? (
                <Audio_Btn
                  className="audio-btn"
                  audioSrc={userData.intro_audio}
                  iconSize={iconSize}
                ></Audio_Btn>
              ) : (
                <></>
              )}
            </div>
          </section>
          <section className="men-sec men-video-sec">
            {userData.intro_video ? (
              <video controls>
                <source src={userData.intro_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              "Introduction video not available"
            )}
          </section>
          <section className="men-sec gallery-sec">
            <h2>Gallery</h2>
            {userData.gallery && userData.gallery.length > 0 ? (
              <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
              >
                {userData.gallery.map((image, index) => (
                  <div className="gallery-item" key={index}>
                    <img src={image.imageURL} alt="Gallery item" />
                  </div>
                ))}
              </Carousel>
            ) : (
              "Gallery is empty"
            )}
          </section>
        </>
      ) : (
        <p>User data not available</p>
      )}
    </div>
  );
}

UserMode.propTypes = {
  userData: PropTypes.shape({
    intro_text: PropTypes.string,
    intro_audio: PropTypes.string,
    intro_video: PropTypes.string,
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        imageURL: PropTypes.string.isRequired,
      })
    ),
  }),
  iconSize: PropTypes.string,
};
