import "./edit_btn.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

export default function Edit_Btn({ className, iconSize }) {
    return (
        <button className={`edit-btn ${className}`}>
            <FontAwesomeIcon icon={faUserPen} size={iconSize} />
        </button>
    );
}

Edit_Btn.propTypes = {
    className: PropTypes.string,
    iconSize: PropTypes.string
};
