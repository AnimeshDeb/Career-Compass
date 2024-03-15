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
<div className="relative text-center">
  <Edit_Btn onEdit={onEdit} iconSize={iconSize} />
  <img
    className="w-full block object-cover"
    src={editMode ? renderUrlImage("image", banner, "banner") : banner || placeholderBanner}
    alt="banner"
  />
  {/* Adjust the translate-y values for different screen sizes using Tailwind's responsive classes */}
  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
    <div className="w-24 h-24 md:w-28 md:h-28 lg:w-28 lg:h-28 xl:w-28 xl:h-28 rounded-full overflow-hidden border-4 border-primary bg-white">
      <img
        src={editMode ? renderUrlImage("image", picture, "pictureURL") : picture || placeholderPFP}
        className="object-cover object-center w-full h-full"
        alt="User"
      />
    </div>
    {/* Adjust margin-top to control the vertical spacing between the profile picture and username */}
    <h3 className="mt-2 bg-primary text-white py-2 px-4 rounded-full text-xl md:text-2xl">{name || "User"}</h3>
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
