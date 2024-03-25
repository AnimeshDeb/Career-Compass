import Navbar from "../../../components/navbar/version1/navbar.jsx";
import { useEffect, useState } from "react";
import { getMentorById } from "../../../functions/mentorFunctions.js";
import Footer from "../../../components/footer/footer.jsx";
import "react-multi-carousel/lib/styles.css";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
import UserMode from "./userMode/userMode.jsx";
import EditMode from "./editMode/editMode.jsx";
import { useLocation } from "react-router-dom";

export default function UserpageMentor() {
  const location = useLocation();
  const mentorId = location.state?.name;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshUserData, setRefreshUserData] = useState(false);

  const triggerUserDataRefresh = () => {
    setRefreshUserData((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedUserData = await getMentorById(mentorId);
        setUserData(fetchedUserData);
        console.log(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 750);
      }
    };

    fetchData();
  }, [mentorId, refreshUserData]);

  const handlePendingChange = (field, value, type) => {
    setPendingChanges((prev) => ({
      ...prev,
      [field]: { value, type },
    }));
  };
  //Edit Mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

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

  return (
    <div className="bg-primary-dark">
      <div className="w-full bg-white max-w-[100%] mx-auto xl:max-w-[75%] shadow-md">
        <Navbar
          className="nav"
          userType={"mentor"}
          iconSize={iconSize}
          userId={mentorId}
          currentPage={"userpage"}
        />

        {userData && (
          <UserBanner
            editMode={editMode}
            onEdit={toggleEditMode}
            banner={userData.banner}
            iconSize={iconSize}
            picture={userData.pictureURL}
            name={userData.displayName}
            handlePendingChange={handlePendingChange}
            pendingChanges={pendingChanges}
            isLoading={isLoading}
          />
        )}
        {editMode ? (
          // Edit Mode
          <>
            <EditMode
              pendingChanges={pendingChanges}
              setPendingChanges={setPendingChanges}
              userId={mentorId}
              iconSize={iconSize}
              userData={userData}
              triggerUserDataRefresh={triggerUserDataRefresh}
            />
          </>
        ) : (
          // Normal page
          <>
            <UserMode iconSize={iconSize} userData={userData} />
          </>
        )}
        <div className="bg-secondary">
          <Footer mentorType={"Mentor"} />
        </div>
      </div>
    </div>
  );
}
