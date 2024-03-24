import medImage from "../../../images/logos/large_v2.png";
import PropTypes from "prop-types";
import SearchButton from "../../Buttons/navbar_btns/search/search";
import LogoutButton from "../../Buttons/navbar_btns/Logout/logout";
import GroupButton from "../../Buttons/navbar_btns/Groups/Group";
import { Link } from "react-router-dom";
import UserpageButton from "../../Buttons/navbar_btns/UserpageButton";

export default function Navbar({ userType, userId, iconSize, currentPage }) {
 return (
  <nav className={`flex justify-between bg-secondary items-center py-4 px-6`}>
    <Link href="/">
      <img
        src={medImage}
        alt="medium_logo"
        className="h-12 lg:h-26 md:h-20 sm:h-14 filter brightness-0 invert"
      />
    </Link>
    <div className="flex space-x-4">
      {currentPage !== "signup" && (
        <>
          {currentPage !== "userpage" && (
            <UserpageButton
              userType={userType}
              iconSize={iconSize}
              userId={userId}
            />
          )}
          {currentPage !== "joblist" && (userType === "mentor" || userType === "seeker") && (
            <SearchButton
              userId={userId}
              userType={userType}
              iconSize={iconSize}
            />
          )}
          {(userType === "mentor" || userType === "seeker") && (
            <>
              {currentPage !== "groups" && (
                <GroupButton userId={userId} iconSize={iconSize} userType={userType} />
              )}
              <LogoutButton userId={userId} iconSize={iconSize} />
            </>
          )}
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
  currentPage: PropTypes.string,
};
