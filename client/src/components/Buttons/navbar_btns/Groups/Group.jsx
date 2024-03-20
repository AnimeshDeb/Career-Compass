import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function GroupButton({ className, iconSize }) {
  return (
    <>
      <button className="flex flex-col items-center z-10 justify-center p-1.5 xs:p-2.5 text-xs rounded-sm mt-1 xs:mt-2.5 ml-2.5 xs:ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn">
        <FontAwesomeIcon icon={faUserGroup} size={iconSize} />
      </button>
    </>
  );
}

GroupButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
};
