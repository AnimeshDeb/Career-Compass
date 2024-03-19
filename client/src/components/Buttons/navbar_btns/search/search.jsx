import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
export default function SearchButton({ className, userId, iconSize, userType}) {
  const navigate = useNavigate()

  async function directPage(){
    navigate("/joblist", {state: {uid:userId, userType:userType}})
  }
  return (
    <>
      <button onClick={directPage} className={className}>
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
