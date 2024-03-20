import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useAuth } from "../../../../Contexts/SeekerAuthContext";
import { useNavigate } from "react-router-dom";
export default function LogoutButton({ className, iconSize }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  async function loggingOut() {
    try {
      await logout();
      navigate("/");
    } catch {
      console.error("Error");
    }
  }
  return (
    <>
      <button
        onClick={loggingOut}
        className="flex flex-col items-center z-10 justify-center p-1.5 xs:p-2.5 text-xs rounded-sm mt-1 xs:mt-2.5 ml-2.5 xs:ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={iconSize} />
      </button>
    </>
  );
}
LogoutButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
};
