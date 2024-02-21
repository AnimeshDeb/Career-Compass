import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  uploadFileToStorage,
  deleteFilesInFolder,
  updateUserField,
} from "../../../../functions/companyFunctions";
import PropTypes from "prop-types";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
export default function EditMode({
  userData,
  userId,
  pendingChanges,
  setPendingChanges,
}) {
  const renderEditableView = (dataType, data, field, index = null) => {
    const pendingKey = `${field}`;
    const pendingData = pendingChanges[pendingKey]
      ? pendingChanges[pendingKey].value
      : data;
    switch (dataType) {
      case "text":
        return (
          <>
            <input
              type="text"
              value={pendingData}
              onChange={(e) => handleChange(e, dataType, field, index)}
            />
          </>
        );
      case "image":
      case "video": {
        const inputId = `file-input-${field}-${index}`;
        const fileUrl =
          dataType === "video" && pendingData instanceof File
            ? URL.createObjectURL(pendingData)
            : pendingData;
        return (
          <div className={`media-container ${dataType}`}>
            {dataType === "video" ? (
              <>
                <video key={`${index}_${new Date().getTime()}`} controls>
                  <source src={fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <label htmlFor={inputId}>Upload New Video</label>
                <input
                  id={inputId}
                  type="file"
                  onChange={(e) => handleChange(e, dataType, field, index)}
                  accept="video/*"
                />
              </>
            ) : (
              <img src={fileUrl} alt={field} />
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };
  const handleChange = (event, type, field) => {
    let newChange;
    if (type === "text") {
      newChange = event.target.value;
    } else if (event.target.files && event.target.files.length > 0) {
      newChange = event.target.files[0];
    }
    if (newChange !== undefined) {
      setPendingChanges((prevChanges) => ({
        ...prevChanges,
        [`${field}`]: { value: newChange, type },
      }));
    }
  };
  const saveChanges = async () => {
    const updates = Object.entries(pendingChanges).map(
      async ([field, { value, type }]) => {
        const updateObject = {};
        if (type === "text") {
          updateObject[field] = value;
        } else {
          const deletePrevious = `Users/Mentors/${userData.displayName}/${field}/`;
          await deleteFilesInFolder(deletePrevious);
          const storeChange = `${deletePrevious}/${field}_${userData.displayName}`;
          const newPath = await uploadFileToStorage(value, storeChange);
          updateObject[field] = newPath;
        }
        console.log(updateObject);
        updateUserField(updateObject, userId);
      }
    );

    try {
      await Promise.all(updates);
      console.log("All changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
    setPendingChanges({});
  };
  return (
    <>
      <button onClick={saveChanges}>Save changes</button>
      {userData && (
        <section className="com-sec com-intro-sec">
          <h2>Introduction</h2>
          {renderEditableView("text", userData.intro_text, "intro_text")}
        </section>
      )}
      {userData && (
        <section className="com-sec com-video-sec">
          {renderEditableView(
            "video",
            userData.intro_video,
            "intro_video",
            "testcompany"
          )}
        </section>
      )}
      <section className="com-sec gallery-sec">
        <h2>Company Life</h2>
        {userData && (
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={3000}
          >
            {userData.CompanyLife.map((image, index) => (
              <div className="gallery-item" key={index}>
                <img src={image.imageURL} alt="Picture" />
              </div>
            ))}
          </Carousel>
        )}
      </section>
    </>
  );
}
EditMode.propTypes = {
  userData: PropTypes.shape({
    intro_text: PropTypes.string,
    intro_video: PropTypes.string,
    displayName: PropTypes.string,
    CompanyLife: PropTypes.arrayOf(
      PropTypes.shape({
        imageURL: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  pendingChanges: PropTypes.object.isRequired,
  setPendingChanges: PropTypes.func.isRequired,
};
