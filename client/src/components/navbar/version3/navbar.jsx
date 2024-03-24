import medImage from "../../../images/logos/large_v2.png";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className={`flex justify-between bg-secondary items-center py-4 px-6`}>
      <Link to="/">
        <img
          src={medImage}
          alt="medium_logo"
          className="h-12 lg:h-26 md:h-20 sm:h-14 filter brightness-0 invert"
        />
      </Link>
    </nav>
  );
}

Navbar.propTypes = {
  userType: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
  currentPage: PropTypes.string,
};
