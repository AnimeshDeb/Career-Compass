import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../../components/navbar/version1/navbar.jsx";
import Footer from "../../../components/footer/footer.jsx";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
import UserMode from "./userMode/userMode.jsx";
import EditMode from "./editMode/editMode.jsx";
import ChatBox from "../../../components/Chat/ChatBox.jsx";
import { getSeekerById } from "../../../functions/seekerFunctions.js";

export default function UserpageSeeker() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [iconSize, setIconSize] = useState("2x");
  const location = useLocation();
  const name = location.state?.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedUserData = await getSeekerById(name);
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
  }, [name]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setIconSize("xs");
      } else if (width < 769) {
        setIconSize("lg");
      } else {
        setIconSize("2x");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handlePendingChange = (field, value, type, section) => {
    setPendingChanges((prev) => ({
      ...prev,
      [field]: { value, type, section },
    }));
  };

  const triggerUserDataRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 750);
  };

  return (
    <div className="bg-primary-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg w-full overflow-hidden">
          <Navbar
            className="nav"
            userId={name}
            userType="seeker"
            iconSize={iconSize}
            currentPage="userpage"
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
              isLoading={isLoading}
            />
          )}
          {editMode ? (
            <EditMode
              pendingChanges={pendingChanges}
              setPendingChanges={setPendingChanges}
              userId={name}
              iconSize={iconSize}
              userData={userData}
              triggerUserDataRefresh={triggerUserDataRefresh}
            />
          ) : (
            <UserMode
              iconSize={iconSize}
              userData={userData}
              isLoading={isLoading}
            />
          )}
          <Footer userType="Seeker" />
        </div>
      </div>
      <ChatBox />
    </div>
  );
}
