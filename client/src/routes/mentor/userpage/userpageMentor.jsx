import "./userpageMentor.css";
import Navbar from "../../../components/navbar/version1/navbar.jsx";
import { useEffect, useState } from "react";
import { getMentorById } from "../../../functions/mentorFunctions.js";
import Footer from "../../../components/footer/footer.jsx";
import "react-multi-carousel/lib/styles.css";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
import UserMode from "./userMode/userMode.jsx";
import EditMode from "./editMode/editMode.jsx";

export default function UserpageMentor() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "a0MqGXB2hlJ5uJNheiKX";
        const fetchedUserData = await getMentorById(userId);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="main">
      <div className="men-navbar">
        <Navbar
          className="men-navbar"
          userType={"mentor"}
          iconSize={iconSize}
        />
      </div>
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
        />
      )}
      {editMode ? (
        // Edit Mode
        <>
          <EditMode
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            userId={"a0MqGXB2hlJ5uJNheiKX"}
            iconSize={iconSize}
            userData={userData}
          />
        </>
      ) : (
        // Normal page
        <>
          <UserMode iconSize={iconSize} userData={userData} />
        </>
      )}
      <div className="men-footer">
        <Footer />
      </div>
    </div>
  );
}
