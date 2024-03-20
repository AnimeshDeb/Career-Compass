import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function Edit_Btn({ iconSize, onEdit }) {
  return (
    <button
      onClick={onEdit}
      className="flex flex-col items-center absolute z-10 justify-center p-2.5 text-xs rounded-sm mt-2.5 ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn"
    >
      <FontAwesomeIcon icon={faUserPen} size={iconSize} />
    </button>
  );
}

Edit_Btn.propTypes = {
  iconSize: PropTypes.string,
  onEdit: PropTypes.func,
};
