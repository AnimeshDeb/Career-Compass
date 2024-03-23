import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
export default function UserpageButton({
  className,
  userId,
  iconSize,
  userType,
}) {
  const navigate = useNavigate();

  async function directPage() {
    if (userType === "mentor") {
      navigate("/mentor", { state: { userId: userId } });
    } else if (userType === "seeker") {
      navigate("/user", { state: { name: userId } });
    }
  }

  return (
    <button
      onClick={directPage}
      className={`flex flex-col items-center z-2 justify-center  rounded-sm mt-1 xs:mt-2.5 ml-2.5 xs:ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn ${className}`}
    >
      <FontAwesomeIcon icon={faUserCircle} size={iconSize} />
    </button>
  );
}

UserpageButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
  userType: PropTypes.oneOf(["mentor", "seeker"]),
};
