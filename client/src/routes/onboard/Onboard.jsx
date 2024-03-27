import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import largeLogo from "../../images/logos/large_v1.png";
import "./Onboard.css";
import SeekerLogin from "../seeker/auth/SeekerLogin";
import anime from "animejs";
import { useNavigate } from "react-router-dom";
import one from "../../images/onboard/one.png";
import two from "../../images/onboard/two.png";
import three from "../../images/onboard/three.png";
import four from "../../images/onboard/four.png";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
function Onboard() {
  const [tab, setTab] = useState("login");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();
  const handleNextPage = () => {
    navigate("/searchUser");
  };

  useEffect(() => {
    if (isSearchActive) {
      anime({
        targets: ".left-side",
        translateY: [0, -110],
        duration: 500,
        easing: "easeOutQuad",
      });
    }
  }, [isSearchActive]);
  return (
    <div className="flex min-h-screen w-full justify-center items-center p-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="left-side flex flex-col xl:pr-0 items-center justify-center -mt-14 md:-mt-22 lg:-mt-24 xl:-mt-36 2xl:-mt-36 mr-0 pl-0">
            <img
              src={largeLogo}
              alt="Career Compass"
              className="max-w-full h-auto mr-0 pl-0 mb-4"
            />
            <Carousel
  responsive={responsive}
  autoPlay={true}
  autoPlaySpeed={1750}
  className="w-full mb-5 h-128 mr-0"
>
  <div className="bg-gray-300 w-full h-full text-center flex items-center justify-center">
    <img
      src={one}
      alt="Gallery item"
      className="max-h-full max-w-full object-contain"
    />
  </div>
  <div className="bg-gray-300 w-full h-full text-center flex items-center justify-center">
    <img
      src={two}
      alt="Gallery item"
      className="max-h-full max-w-full object-contain"
    />
  </div>
  <div className="bg-gray-300 w-full h-full text-center flex items-center justify-center">
    <img
      src={three}
      alt="Gallery item"
      className="max-h-full max-w-full object-contain"
    />
  </div>
  <div className="bg-gray-300 w-full h-full text-center flex items-center justify-center">
    <img
      src={four}
      alt="Gallery item"
      className="max-h-full max-w-full object-contain"
    />
  </div>
</Carousel>
            <div className="h-10 text-secondary text-xl font-bold w-full align-center text-center">
              Some of our features
            </div>
          </div>
          <div className="right-side flex flex-col items-center md:items-start xl:pl-0">
            <div className="flex flex-col border border-gray-300 rounded-t-lg w-full max-w-md mx-auto min-h-[500px]">
              <div className="flex bg-gray-100 p-2 justify-center">
                <button
                  onClick={() => setTab("login")}
                  className={`px-4 text-xl py-2 ${
                    tab === 'login'
                      ? 'bg-primary text-white rounded-lg'
                      : 'bg-transparent'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className={`px-4 text-xl py-2 ${
                    tab === "signup"
                      ? "bg-secondary text-white rounded-lg hover:bg-secondaryDark"
                      : "bg-transparent"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <div className="flex-grow flex items-center justify-center p-4 pt-0 h-full">
                {tab === "login" && <SeekerLogin />}
                {tab === "signup" && (
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-2xl">Choose what you are</h4>
                    <Link
                      to="/SeekerSignup"
                      className="px-4 py-2 text-xl bg-primary hover:bg-primary-light rounded-md text-white text-center hover:bg-primaryDark hover:text-gray-200 hover:shadow-md transition-colors duration-300"
                    >
                      Seeker
                    </Link>
                    <Link
                      to="/MentorSignup"
                      className="px-4 py-2 text-xl bg-secondary hover:bg-secondary-light rounded-md text-white text-center hover:bg-secondaryDark hover:text-gray-200 hover:shadow-md transition-colors duration-300"
                    >
                      Mentor
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleNextPage}
              className="bg-secondary hover:bg-secondary-light text-white text-xl py-2 w-full max-w-md rounded-b-lg mt-0 mx-auto hover:bg-secondaryDark hover:text-gray-200 hover:shadow-md transition-colors duration-300"
            >
              Looking for someone? Search them!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboard;
