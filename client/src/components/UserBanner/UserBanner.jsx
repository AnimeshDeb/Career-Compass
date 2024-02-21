import "./UserBanner.css";
import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";
export default function UserBanner({ banner, picture, name, iconSize, onEdit, editMode, pendingChanges, handlePendingChange }) {

    const handleChange = (event, type, field) => {
        const newChange = event.target.files[0];
        handlePendingChange(field, newChange, type);
      };
    const renderUrlImage = (dataType, data, field, index = null) => {
      const pendingKey = `${field}`;
      const pendingData = pendingChanges[pendingKey] ? pendingChanges[pendingKey].value : data;
      const inputId = `file-input-${field}-${index}`;
      const fileUrl = dataType === 'image' && pendingData instanceof File ? URL.createObjectURL(pendingData) : pendingData;
      return fileUrl
    };
    return(
        <>
        {editMode ? (
            <>
            <div className="banner-container">
                <Edit_Btn onEdit={onEdit} iconSize={iconSize}/>
                <img className="banner" src={renderUrlImage('image',banner,'banner')} alt="banner" />
                <div className="banner-content">
                    <img src={renderUrlImage('image',picture,'pictureURL')} className= "profile-picture" alt="User" />
                    <h3 className="username">{name}</h3>
                </div>
                <input
                        id="banner-input"
                        type="file"
                        onChange={(e) => handleChange(e,"image","banner")}
                        accept="image/*"
                    />

                    <input
                        id="profile-input"
                        type="file"
                        onChange={(e) => handleChange(e,"image" ,"pictureURL")}
                        accept="image/*"
                    />
            </div>
            </>
        ):(
            <div className="banner-container">
                <Edit_Btn onEdit={onEdit} iconSize={iconSize}/>
                <img className="banner" src={banner} alt="banner" />
                <div className="banner-content">
                    <img src={picture} className= "profile-picture" alt="User" />
                    <h3 className="username">{name}</h3>
                </div>
            </div>
        )}
        </>
    )
}
UserBanner.propTypes = {
    banner: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    iconSize: PropTypes.string,
    onEdit: PropTypes.func,
    editMode: PropTypes.bool,
    handlePendingChange: PropTypes.func,
};
    