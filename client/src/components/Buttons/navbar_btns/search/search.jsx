import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default function SearchButton({ className, userId, iconSize }) {
  
  return (
    <>
      <button className={className}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size={iconSize} />
      </button>
    </>
  );
}
SearchButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
};
