import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function JobsButton({ className, iconSize }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/myjobs");
  };

  return (
    <>
      <button
        className="flex flex-col items-center z-10 justify-center p-1.5 xs:p-2.5 text-xs rounded-sm mt-1 xs:mt-2.5 ml-2.5 xs:ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faSuitcase} size={iconSize} />
      </button>
    </>
  );
}
JobsButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
};
