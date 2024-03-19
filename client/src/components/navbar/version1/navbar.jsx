import medImage from "../../../images/logos/med_v1.png";
import PropTypes from "prop-types";
import SearchButton from "../../Buttons/navbar_btns/search/search";
import JobsButton from "../../Buttons/navbar_btns/jobsApplied/jobsApplied";
import LogoutButton from "../../Buttons/navbar_btns/Logout/logout";
import GroupButton from "../../Buttons/navbar_btns/Groups/Group";
import { Link } from "react-router-dom";
export default function Navbar({ userType, userId, iconSize }) {
  return (
    <nav className="flex justify-between bg-primary items-center py-4 px-6">
      <Link href="/">
        <img
          src={medImage}
          alt="medium_logo"
          className="h-10 filter brightness-0 invert"
        />
      </Link>
      <div className="flex space-x-4">
        {(userType === "mentor" || userType === "seeker") && (
          <SearchButton
            userId={userId}
            userType={userType}
            className="one-btn"
            iconSize={iconSize}
          />
        )}
        {userType === "seeker" && (
          <JobsButton userId={userId} iconSize={iconSize} />
        )}
        {(userType === "mentor" || userType === "seeker") && (
          <>
            <GroupButton userId={userId} iconSize={iconSize} />
            <LogoutButton userId={userId} iconSize={iconSize} />
          </>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  userType: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
};
