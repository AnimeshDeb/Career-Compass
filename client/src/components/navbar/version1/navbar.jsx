import medImage from "../../../images/logos/med_v1.png";
import "./navbar.css";
import PropTypes from "prop-types";
import SearchButton from "../../Buttons/navbar_btns/search/search";
import JobsButton from "../../Buttons/navbar_btns/jobsApplied/jobsApplied";
import LogoutButton from "../../Buttons/navbar_btns/Logout/logout";
import GroupButton from "../../Buttons/navbar_btns/Groups/Group";

export default function Navbar({ userType, userId, iconSize }) {
  return (
    <div className="navbar">
      <a href="/">
        <img src={medImage} alt="medium_logo" className="navbar-image" />
      </a>
      <div className="nav-btns">
        {(userType === "mentor" || userType === "seeker") && (
          <SearchButton
            userId={userId}
            className="one-btn"
            iconSize={iconSize}
          />
        )}
        {userType === "seeker" && (
          <JobsButton userId={userId} className="one-btn" iconSize={iconSize} />
        )}
        {(userType === "mentor" || userType === "seeker") && (
          <>
            <GroupButton
              userId={userId}
              className="one-btn"
              iconSize={iconSize}
            />
            <LogoutButton
              userId={userId}
              className="one-btn"
              iconSize={iconSize}
            />
          </>
        )}
      </div>
    </div>
  );
}
Navbar.propTypes = {
  userType: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
};
