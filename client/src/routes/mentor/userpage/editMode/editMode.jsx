import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  deleteFilesInFolder,
  uploadFileToStorage,
  updateUserField,
  updateUserGallery,
  deleteImageFromStorage,
} from "../../../../functions/mentorFunctions";
import DropFile from "../../../../components/DropFile/DropFileEditMode";
import EditorTxt from "../../../../components/texteditor/Editor";
import ReactPlayer from "react-player";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
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
const textSize = "text-base md:text-lg lg:text-xl xl:text-2xl";

export default function EditMode({
  userData,
  userId,
  pendingChanges,
  setPendingChanges,
  triggerUserDataRefresh
}) {
  const [currentGallery, setCurrentGallery] = useState(userData.gallery);
const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [content, setContent] = useState(userData.intro_text);
  const handleDeleteImage = (index) => {
    const imageToDelete = currentGallery[index];
    const newGallery = currentGallery.filter((_, i) => i !== index);
    
    setCurrentGallery(newGallery);
    setPendingChanges((prevChanges) => ({
      ...prevChanges,
      [`delete_gallery_${imageToDelete.imageURL}`]: {
        type: "deleteImage",
        value: imageToDelete,
      },
    }));
  };

  const handleNewImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const newImageFile = event.target.files[0];
      const objectURL = URL.createObjectURL(newImageFile);

      const newImageCount = Object.keys(pendingChanges).filter((key) =>
        key.startsWith("new_gallery_")
      ).length;
      const tempId = `new_gallery_${currentGallery.length + newImageCount}`;

      const newGalleryItem = {
        imageURL: objectURL,
        tempId: tempId,
      };

      setCurrentGallery((currentGallery) => [
        ...currentGallery,
        newGalleryItem,
      ]);

      setPendingChanges((prevChanges) => ({
        ...prevChanges,
        [tempId]: { type: "image", value: newImageFile },
      }));
    }
  };

  const renderEditableView = (dataType, data, field, index = null) => {
    const pendingKey = `${field}`;
    const pendingData = pendingChanges[pendingKey]
      ? pendingChanges[pendingKey].value
      : data;
    let cleanHtml
    const handleEditorChange = (e) => {
      cleanHtml = DOMPurify.sanitize(e.htmlValue);
      setContent(cleanHtml)
      handleChange(
        { target: { value: cleanHtml } },
        "text",
        field,
        index
      );
    };
    switch (dataType) {
      case "text":
        return (
          <>
          <div
              dangerouslySetInnerHTML={{ __html: content }}
              className={`${textSize} overflow-auto`}
              style={{ width: "100%", height: "100%" }}
            />
            <EditorTxt
            handleEditorChange={handleEditorChange}
            seekerTxtIntro={pendingData}
          />
          </>
        );
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
                <div className="w-full flex justify-center items-center p-5 mt-0">
            <div className="max-w-lg w-full aspect-video">
              <ReactPlayer
                className="react-player"
                url={fileUrl}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
          </div>
          <div
          className={`w-1/2 p-2 mt-0 flex  justify-center items-center space-y-2 rounded-md`}
        >
          <DropFile onFileChange={(downloadURL) => {
              handleChange(
                { target: { value: downloadURL } },
                "video",
                field,
                index
              );}} 
              maxFiles={1}
              acceptedFileTypes={{ "video/*": [] }}/></div>
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
          await updateUserField(updateObject, userId);
        } else if (type === "image") {
          const storagePath = `Users/Mentors/${userData.displayName}/gallery/${field}`;
          const newPath = await uploadFileToStorage(value, storagePath);
          updateObject["imageURL"] = newPath;
          await updateUserGallery(updateObject, userId);
        } else if (type === "deleteImage") {
          await deleteImageFromStorage(userId, value.imageURL);
        } else {
          const deletePrevious = `Users/Mentors/${userData.displayName}/${field}/`;
          await deleteFilesInFolder(deletePrevious);
          const storeChange = `${deletePrevious}/${field}_${userData.displayName}`;
          const newPath = await uploadFileToStorage(value, storeChange);
          updateObject[field] = newPath;
          await updateUserField(updateObject, userId);
        }
      }
    );
    try {
      await Promise.all(updates);
      console.log("All changes saved successfully.");
      const newGallery = pendingChanges["gallery"]
        ? [...currentGallery, pendingChanges["gallery"].value]
        : currentGallery;
      setCurrentGallery(
        newGallery.filter(
          (image) => !pendingChanges[`delete_gallery_${image.imageURL}`]
        )
      );
      setPendingChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const revertChange = (field) => {
    const updatedChanges = { ...pendingChanges };

    if (field.startsWith("delete_gallery_")) {
      const imageInfo = pendingChanges[field].value;
      setCurrentGallery((current) => [...current, imageInfo]);
    }

    if (field.startsWith("new_gallery_")) {
      setCurrentGallery((currentGallery) =>
        currentGallery.filter((image) => image.tempId !== field)
      );
    }

    delete updatedChanges[field];
    setPendingChanges(updatedChanges);
  };
  return (
    <>
<div
        className={`fixed top-1/10 right-0 z-50 ${
          isExpanded ? "" : "-mr-4"
        } transition-margin duration-300 ease-in-out -mr-0`}
      >
        <div className="flex flex-col items-end">
          <div className="bg-white border-4 border-secondary shadow-lg ">
            <button
              className="absolute bg-primary p-10 hover:bg-primary-dark text-white font-bold py-2 px-4 rounded mb-0 flex items-center justify-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FontAwesomeIcon
                icon={isExpanded ? faChevronRight : faChevronLeft}
              />
            </button>
            {isExpanded && (
              <>
                <h2 className="w-full text-right pl-12 pb-2 pt-1 pr-2 bg-secondary text-white font-bold ">
                  Pending Changes
                </h2>
                <div className="px-5 pb-5">
                  <div
                    className="mt-2 overflow-auto"
                    style={{ maxHeight: "50vh" }}
                  >
                    {Object.entries(pendingChanges).map(([key, change]) => {
                      let displayValue;
                      if (change.type === "delete") {
                        displayValue = `Eliminating - ${change.value.name}`;
                      } else if (change.type === "text") {
                        displayValue = "Text Change";
                      } else if (change.type === "video") {
                        displayValue = "Video Upload";
                      } else {
                        displayValue = "Picture Upload";
                      }
                      return (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-gray-100 p-2 space-x-2 rounded mt-1"
                        >
                          <span className="text-sm font-medium">
                            {change.section}: {displayValue}
                          </span>
                          <button
                            onClick={() => revertChange(key)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Revert
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={saveChanges}
                    disabled={saveStatus === "saving"}
                    className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded mt-4 w-full"
                  >
                    {saveStatus === "saving" ? "Updating..." : "Save changes"}
                  </button>

                  {saveMessage && (
                    <div className="text-center font-medium mt-2">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {userData && (
        <section className="pt-3 flex flex-col justify-center items-center pb-0">
          <h2
          className={`${textSize} bg-secondary text-white px-8 py-2 w-full text-center`}
        >
          Introduction
        </h2>
          <div className="men-intro-content">
            {renderEditableView("text", userData.intro_text, "intro_text")}
          </div>
        </section>
      )}
      {userData && (
        <section className="men-sec men-video-sec">
          {renderEditableView("video", userData.intro_video, "intro_video")}
        </section>
      )}
      <section className="men-sec gallery-sec">
       <h2
          className={`${textSize} bg-secondary text-white px-8 py-2 w-full text-center`}
        >
          Gallery
        </h2>
        {userData && (
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={3000}
          >
            {currentGallery.map((image, index) => {
              const isExistingImage = userData.gallery.some(
                (galleryImage) => galleryImage.imageURL === image.imageURL
              );
              return (
                <div className="gallery-item" key={index}>
                  {isExistingImage && (
                    <button onClick={() => handleDeleteImage(index)}>X</button>
                  )}
                  <img src={image.imageURL} alt="Picture" />
                </div>
              );
            })}
          </Carousel>
        )}
        <div
          className={`w-1/2 p-2 mt-0 flex  justify-center items-center space-y-2 rounded-md`}
        >
          <DropFile onFileChange={(downloadURL) => {
              handleChange(
                { target: { value: downloadURL } },
                "file",
              );}} 
              maxFiles={10}
              acceptedFileTypes={{ "image/*": [] }}/></div>

      </section>
    </>
  );
}
EditMode.propTypes = {
  userData: PropTypes.shape({
    intro_text: PropTypes.string,
    intro_video: PropTypes.string,
    displayName: PropTypes.string,
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        imageURL: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  pendingChanges: PropTypes.object.isRequired,
  setPendingChanges: PropTypes.func.isRequired,
};
