import "../generalbtn.css";
import "./edit_btn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function Edit_Btn({ iconSize, onEdit }) {
  return (
    <button onClick={onEdit} className={`edit-btn general-btn`}>
      <FontAwesomeIcon icon={faUserPen} size={iconSize} />
    </button>
  );
}

Edit_Btn.propTypes = {
  iconSize: PropTypes.string,
  onEdit: PropTypes.func,
};
