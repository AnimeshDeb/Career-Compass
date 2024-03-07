import PropTypes from "prop-types";

const StarIcon = ({ progress }) => (
  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .587l3.668 7.431L24 9.557l-6 5.848 1.417 8.248L12 18.896l-7.417 3.757L6 15.405 0 9.557l8.332-1.539L12 .587z" fill={progress === 100 ? "#FFD700" : "#e0e0de"} />
  </svg>
);
StarIcon.propTypes = {
  progress: PropTypes.any
};
export default StarIcon;