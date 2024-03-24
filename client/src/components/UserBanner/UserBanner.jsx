import PropTypes from "prop-types";
import Edit_Btn from "../Buttons/edit_btn/edit_btn";
import DropFile from "../DropFile/DropFileEditMode";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const textSize = "text-sm md:text-base lg:text-lg xl:text-xl";
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
    handlePendingChange(field, file, "image", section, null);
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:translate-y-16 -translate-y-2 z-10 flex flex-col items-center">
          <div className="rounded-full overflow-hidden border-4 border-primary bg-white flex justify-center items-center w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 xl:w-36 xl:h-36">
            {isLoading ? (
              <Skeleton circle={true} width="100%" height="100%" />
            ) : (
              <img
                src={
                  editMode
                    ? renderUrlImage("image", picture, "pictureURL")
                    : picture || placeholderPFP
                }
                className="w-full h-full object-cover"
                alt="User"
              />
            )}
          </div>
          <h3 className="break-words -mt-3 -mb-1.5 bg-primary text-white md:py-1 md:px-3 px-1.5 py-0 rounded-lg md:rounded-br-lg md:rounded-bl-lg text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xs">
            {name || "User"}
          </h3>
        </div>
      </div>
      {editMode && (<>
        <h2
                className={`${textSize} bg-primary text-white px-8 py-6 w-full text-center`}
              ></h2>
        <div className="flex justify-center items-center pt-3  mt-8 space-x-10">
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
        </>
      )}
    </>
  );
}

UserBanner.propTypes = {
  banner: PropTypes.string,
  picture: PropTypes.string,
  name: PropTypes.string,
  iconSize: PropTypes.string,
  onEdit: PropTypes.func,
  editMode: PropTypes.bool,
  pendingChanges: PropTypes.object,
  handlePendingChange: PropTypes.func,
};
