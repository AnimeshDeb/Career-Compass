import Navbar from "../../components/navbar/version3/navbar.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/footer/footer.jsx";
import UserBannerPublic from "../../components/UserBanner/UserBannerPublic.jsx";
import PublicMentor from "./PublicMentor.jsx";
import PublicSeeker from "./PublicSeeker.jsx";
import { Link } from "react-router-dom";
import { getSeekerById } from "../../functions/seekerFunctions.js";
import { getMentorById } from "../../functions/mentorFunctions.js";

export default function PublicUserPage() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const userId = location.state?.userId;
  const userType = location.state?.userType;

  //Icon Size
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let fetchedUserData;
        if (userType === "seeker") {
          fetchedUserData = await getSeekerById(userId);
        } else {
          fetchedUserData = await getMentorById(userId);
        }
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 750);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="bg-primary-dark">
      <div className="w-full bg-white max-w-[100%] mx-auto xl:max-w-[75%] shadow-md">
        <Navbar />
        {userData && (
          <UserBannerPublic
            banner={userData.banner}
            picture={userData.pictureURL}
            name={userData.displayName}
            isLoading={isLoading}
          />
        )}
        {userType === "mentor" && (
          <PublicMentor
            userData={userData}
            textSize={textSize}
            isLoading={isLoading}
            iconSize={iconSize}
          />
        )}
        {userType === "seeker" && (
          <PublicSeeker
            userData={userData}
            textSize={textSize}
            isLoading={isLoading}
            iconSize={iconSize}
          />
        )}
        {!userData && (
          <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary-dark mb-4">
                User Not Found
              </h1>
              <p className="text-xl mb-8 text-secondary-dark">
                Oops! The user you are looking for does not exist or may have
                been removed.
              </p>
              <Link
                to="/searchUser"
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-md shadow"
              >
                Go Back
              </Link>
            </div>
          </div>
        )}
        <Footer userType="Seeker" />
      </div>
    </div>
  );
}
