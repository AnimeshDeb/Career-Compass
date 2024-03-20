import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";
import DropFile from "../DropFile/DropFileEditMode";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserBanner({
  banner,
  picture,
  name,
  iconSize,
  onEdit,
  editMode,
  pendingChanges,
  handlePendingChange,
  isLoading,
}) {
  const handleFileChange = (file, field, section) => {
    const fileUrl = URL.createObjectURL(file);
    handlePendingChange(field, fileUrl, "image", section, null);
  };

  const placeholderBanner = "/placeholderBanner.jpg";
  const placeholderPFP = "/placeholderPFP.png";
  const renderUrlImage = (dataType, data, field) => {
    const pendingKey = `${field}`;
    const pendingData = pendingChanges[pendingKey]
      ? pendingChanges[pendingKey].value
      : data;
    return (
      pendingData || (field === "banner" ? placeholderBanner : placeholderPFP)
    );
  };

  return (
    <>
      <div className="relative text-center">
        <Edit_Btn onEdit={onEdit} iconSize={iconSize} />
        <div className="w-full block object-cover">
          {isLoading ? (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              <Skeleton height={200} width={`100%`} />
            </SkeletonTheme>
          ) : (
            <img
              src={
                editMode
                  ? renderUrlImage("image", banner, "banner")
                  : banner || placeholderBanner
              }
              alt="banner"
            />
          )}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2 flex flex-col items-center">
          <div
            className="rounded-full overflow-hidden border-4 border-primary bg-white w-1/5 h-1/5 lg:h-1/4 lg:w-1/4 flex justify-center items-center"
            style={{ width: iconSize, height: iconSize }}
          >
            {isLoading ? (
              <div className="-my-1 mx-40">
                <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                  <Skeleton height={100} width={100} />
                </SkeletonTheme>
              </div>
            ) : (
              <img
                src={
                  editMode
                    ? renderUrlImage("image", picture, "pictureURL")
                    : picture || placeholderPFP
                }
                className="object-cover object-center"
                alt="User"
              />
            )}
          </div>
          <h3 className="mt-0.5 -mb-0.5 bg-primary text-white py-0.5 px-1 rounded-full text-base md:text-lg lg:text-xl xl:text-2xl">
            {name || "User"}
          </h3>
        </div>
      </div>
      {editMode && (
        <div className="flex justify-center items-center pt-2 mx-8 space-x-10">
          {/* <DropFile
            onFileChange={(file) => handleFileChange(file, "banner", "Banner")}
            maxFiles={1}
            acceptedFileTypes={{ "image/*": [] }}
            label="Update Banner"
          /> */}
          <DropFile
            onFileChange={(file) =>
              handleFileChange(file, "pictureURL", "Profile Picture")
            }
            maxFiles={1}
            acceptedFileTypes={{ "image/*": [] }}
            label="Update Profile Picture"
          />
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
