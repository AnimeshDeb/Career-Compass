import Navbar from "../../../components/navbar/version1/navbar.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSeekerById } from "../../../functions/seekerFunctions.js";
import Footer from "../../../components/footer/footer.jsx";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
import UserMode from "./userMode/userMode.jsx";
import EditMode from "./editMode/editMode.jsx";
export default function UserpageSeeker() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});
  const location = useLocation();
  const name = location.state?.name;
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

  //Get User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = name;
        const fetchedUserData = await getSeekerById(userId);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-primary-dark">
      <div className="w-full bg-white max-w-[100%] mx-auto lg:max-w-[80%] shadow-md">
        <Navbar
          className="nav"
          userId={name}
          userType={"seeker"}
          iconSize={iconSize}
        />
        {userData && (
          <UserBanner
            iconSize={iconSize}
            banner={userData.banner}
            picture={userData.pictureURL}
            name={userData.displayName}
            onEdit={toggleEditMode}
            editMode={editMode}
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
              userId={name}
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

        <Footer className="seek-footer" />
      </div>
    </div>
  );
}
