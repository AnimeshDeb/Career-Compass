import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";
import DropFile from "../DropFile/DropFile";

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
  const handleFileChange = (file, field) => {
    handlePendingChange(field, file, "image");
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
    <>
      <div className="relative text-center">
        <Edit_Btn onEdit={onEdit} iconSize={iconSize} />
        <img
          className="w-full block object-cover"
          src={
            editMode
              ? renderUrlImage("image", banner, "banner")
              : banner || placeholderBanner
          }
          alt="banner"
        />

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2 flex flex-col items-center">
          <div
            className="rounded-full overflow-hidden border-4 border-primary bg-white w-4/12 h-4/12 lg:h-1/4 lg:w-1/4"
            style={{ width: iconSize, height: iconSize }}
          >
            <img
              src={
                editMode
                  ? renderUrlImage("image", picture, "pictureURL")
                  : picture || placeholderPFP
              }
              className="object-cover object-center"
              alt="User"
            />
          </div>
          <h3 className="mt-0.5 -mb-0.5 bg-primary text-white py-0.5 px-1 rounded-full text-base md:text-lg lg:text-xl xl:text-2xl">
            {name || "User"}
          </h3>
        </div>
      </div>
      {editMode && (
        <div className="flex justify-center items-center pt-2 mx-8 space-x-10">
          <div className="w-1/2">
            <DropFile
              onFileChange={(file) => handleFileChange(file, "banner")}
              maxFiles={1}
              acceptedFileTypes={{ "image/*": [] }}
            />
          </div>
          <div className="w-1/2">
            <DropFile
              onFileChange={(file) => handleFileChange(file, "pictureURL")}
              maxFiles={1}
              acceptedFileTypes={{ "image/*": [] }}
            />
          </div>
        </div>
      )}
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
