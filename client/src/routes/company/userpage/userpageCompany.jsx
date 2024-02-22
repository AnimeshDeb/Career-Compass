import "./userpageCompany.css";
import Navbar from "../../../components/navbar/navbar.jsx";
import { useEffect, useState } from "react";
import { getCompanyById } from "../../../functions/companyFunctions.js";
import Footer from "../../../components/footer/footer.jsx";
import UserBanner from "../../../components/UserBanner/UserBanner.jsx";
import EditMode from "./editMode/editMode.jsx";
import UserMode from "./userMode/userMode.jsx";

export default function UserpageCompany() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iconSize, setIconSize] = useState("2x");
  const [editMode, setEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  const handlePendingChange = (field, value, type) => {
    setPendingChanges((prev) => ({
      ...prev,
      [field]: { value, type },
    }));
    console.log(pendingChanges);
  };
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "N5wtfaCiNSe1Yh85tr8hjA4ygsO2";
        const fetchedUserData = await getCompanyById(userId);
        console.log(fetchedUserData);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="main">
        <Navbar iconSize={iconSize} userType={"company"} />
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
          <>
            <EditMode
              pendingChanges={pendingChanges}
              setPendingChanges={setPendingChanges}
              userId={"N5wtfaCiNSe1Yh85tr8hjA4ygsO2"}
              iconSize={iconSize}
              userData={userData}
            />
          </>
        ) : (
          <>
            <UserMode userData={userData} iconSize={iconSize} />
          </>
        )}
      </div>
      <div className="com-footer">
        <Footer className="com-footer" />
      </div>
    </>
  );
}
