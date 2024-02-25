import "./UserBanner.css";
import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";

export default function UserBanner({
  banner,
  picture,
  name,
  iconSize,
  onEdit,
  editMode,
  pendingChanges,
  handlePendingChange,
}) {
  const handleChange = (event, type, field) => {
    const newChange = event.target.files[0];
    handlePendingChange(field, newChange, type);
  };

  // Use process.env.PUBLIC_URL to reference images in the public folder
  const placeholderBanner = "/placeholderBanner.jpg";
  const placeholderPFP = "/placeholderPFP.png";
  const renderUrlImage = (dataType, data, field) => {
    const pendingKey = `${field}`;
    const pendingData = pendingChanges[pendingKey]
      ? URL.createObjectURL(pendingChanges[pendingKey].value)
      : data;
    return (
      pendingData || (field === "banner" ? placeholderBanner : placeholderPFP)
    );
  };

  return (
    <>
      <div className="banner-container">
        <Edit_Btn onEdit={onEdit} iconSize={iconSize} />
        <img
          className="banner"
          src={
            editMode
              ? renderUrlImage("image", banner, "banner")
              : banner || placeholderBanner
          }
          alt="banner"
        />
        <div className="banner-content">
          <img
            src={
              editMode
                ? renderUrlImage("image", picture, "pictureURL")
                : picture || placeholderPFP
            }
            className="profile-picture"
            alt="User"
          />
          <h3 className="username">{name || "User"}</h3>
        </div>
        {editMode && (
          <>
            <input
              id="banner-input"
              type="file"
              onChange={(e) => handleChange(e, "image", "banner")}
              accept="image/*"
            />
            <input
              id="profile-input"
              type="file"
              onChange={(e) => handleChange(e, "image", "pictureURL")}
              accept="image/*"
            />
          </>
        )}
      </div>
    </>
  );
}

UserBanner.propTypes = {
  banner: PropTypes.string,
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  onEdit: PropTypes.func,
  editMode: PropTypes.bool,
  pendingChanges: PropTypes.object,
  handlePendingChange: PropTypes.func,
};
