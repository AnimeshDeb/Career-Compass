import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
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
  faChevronLeft, faTimes
} from "@fortawesome/free-solid-svg-icons";
import anime from "animejs"

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
const VideoItem = React.memo(
  ({ videoData, handleChange, field, pendingChanges, section, index }) => {
    const [content, setContent] = useState({
      value: videoData,
    });

    useEffect(() => {
      // Check for pending changes to update the local state accordingly
      const pendingChange = pendingChanges[field];
      if (pendingChange) {
        setContent({
          value:pendingChange.value,
        });
      }
    }, [field, pendingChanges]);

    return (
      <div className="flex flex-col items-center gap-4 w-full h-full">
        <div
  className="w-full max-w-lg px-5 pt-5 pb-0 mb-0 aspect-video h-full"
  style={{ minHeight: "31vh" }}
>
  <ReactPlayer
    url={content.value}
    controls={true}
    style={{ margin: "auto" }}
    width="100%"
    height="100%"
  />
</div>
        <div
          className={`w-full p-3 mt-0 flex flex-col justify-between h-full rounded-md`}
        >
          <DropFile
            onFileChange={(downloadURL) => {
              handleChange(
                { target: { value: downloadURL } },
                "video",
                field,
                section,
                index
              );
            }}
            maxFiles={1}
            acceptedFileTypes={{ "video/*": [] }}
          />
        </div>
      </div>
    );
  }
);
VideoItem.displayName = "VideoItem";
const TextItem = React.memo(
  ({ textData, handleChange, field, pendingChanges, section, index }) => {

    const [content, setContent] = useState({
      value: textData,
    });

    useEffect(() => {
      // Check for pending changes to update the local state accordingly
      const pendingChange = pendingChanges[field];
      if (pendingChange) {
        setContent({
          value: pendingChange.value
        });
      }
    }, [field, pendingChanges]);

    const handleEditorChange = (e) => {
      const cleanHtml = DOMPurify.sanitize(e.htmlValue);
      // Update the local state to reflect the new text
      setContent({ ...content, value: cleanHtml });
      // Propagate the change up to the parent component
      handleChange(
        { target: { value: cleanHtml } },
        "text",
        field,
        section,
        index
      );
    };

    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="w-full max-w-lg px-5 pt-5 pb-0 mb-0 aspect-video "
          style={{ minHeight: "28vh", maxHeight: "28vh" }}
        >
            <div
              dangerouslySetInnerHTML={{ __html: content.value }}
              className={`${textSize} overflow-auto`}
              style={{ width: "100%", height: "100%" }}
            />
        </div>
        <div
          className={`w-full p-2 mt-0 flex flex-col justify-between space-y-2 rounded-md`}
        >
          <EditorTxt
            handleEditorChange={handleEditorChange}
            seekerTxtIntro={content.type === "text" ? content.value : ""}
          />
        </div>
      </div>
    );
  }
);
TextItem.displayName = "TextItem";
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
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
useEffect(() => {
    // Check if the limit has been reached and update the state accordingly
    const totalImages = currentGallery.length + Object.keys(pendingChanges).filter(key => key.startsWith("new_gallery_")).length;
    setUploadLimitReached(totalImages >= 10);
  }, [currentGallery, pendingChanges]);
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
  if (uploadLimitReached) {
      anime({
        targets: '#uploadFeedback',
        translateX: [
          {value: -10, duration: 100},
          {value: 10, duration: 100},
          {value: -10, duration: 100},
          {value: 10, duration: 100},
          {value: 0, duration: 100}
        ],
        easing: 'easeInOutSine'
      });
      return;
    }
  const files = event.target.value;
  if (files.length) {
    // Process each file
    const newEntries = Array.from(files).map((file, index) => {
      const newImageCount = Object.keys(pendingChanges).filter((key) =>
        key.startsWith("new_gallery_")
      ).length;

      const tempId = `new_gallery_${currentGallery.length + newImageCount + index}`;

      const newGalleryItem = {
        imageURL: file,
        tempId,
      };

      // Update pendingChanges for each file
      setPendingChanges((prevChanges) => ({
        ...prevChanges,
        [tempId]: { type: "image", value: file },
      }));

      return newGalleryItem;
    });

    // Update currentGallery with new entries
    setCurrentGallery((currentGallery) => [
      ...currentGallery,
      ...newEntries,
    ]);
  }
};

  
  const handleChange = (event, type, field, section, index) => {
    let newValue = event.target.value;
    if (pendingChanges[field] && pendingChanges[field].type !== type) {
        if (type === "video") {
          newValue = event.target.value;
        } else {
          newValue = DOMPurify.sanitize(event.target.value);
        }

        // Revoke previous blob URL if switching away from a video
        if (
          pendingChanges[field].type === "video" &&
          pendingChanges[field].value.startsWith("blob:")
        ) {
          URL.revokeObjectURL(pendingChanges[field].value);
        }
      }

      setPendingChanges((prevChanges) => ({
        ...prevChanges,
        [field]: {
          value: newValue,
          type: type,
          section: section,
          index: index,
        },
      }),
    [setPendingChanges]);
  };
  const saveChanges = async () => {
    const updates = Object.entries(pendingChanges).map(
      async ([field, { value, type }]) => {
        console.log(value)
        const updateObject = {};
        if (type === "text") {
          updateObject[field] = value;
          await updateUserField(updateObject, userId);
        } else if (type === "image") {
          const storagePath = `Users/Mentors/${userData.UID}/gallery/${field}`;
                    const response = await fetch(value);
            const blob = await response.blob();
            const file = new File([blob], `${field}_${userData.displayName}`, { type: blob.type });
          const newPath = await uploadFileToStorage(file, storagePath);
          updateObject["imageURL"] = newPath;
          await updateUserGallery(updateObject, userId);
        } else if (type === "deleteImage") {
          await deleteImageFromStorage(userId, value.imageURL);
        } else {
          const deletePrevious = `Users/Mentors/${userData.UID}/${field}/`;
          await deleteFilesInFolder(deletePrevious);
          const storeChange = `${deletePrevious}/${field}_${userData.displayName}`;
          const response = await fetch(value);
            const blob = await response.blob();
            const file = new File([blob], `${field}_${userData.displayName}`, { type: blob.type });
          const newPath = await uploadFileToStorage(file, storeChange);
          updateObject[field] = newPath;
          console.log(updateObject)
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
      console.log("All changes saved successfully.");
      setPendingChanges({});
      triggerUserDataRefresh();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSaveStatus("success");
      setSaveMessage("Successfully Updated");
      setTimeout(() => setSaveMessage(""), 3000);
      setSaveStatus("idle");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("An error occurred. Please try again.");
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
        
            <TextItem
                textData={
                  pendingChanges["intro_text"]?.value || userData.intro_text
                }
                handleChange={handleChange}
                field="intro_text"
                index={null}
                section="Introduction Text"
                pendingChanges={pendingChanges}
              />
        </section>
      )}
      <div className="flex flex-col items-start">
  <h2 className="text-3xl text-secondary font-semibold ml-5 mb-5">Text</h2>
  <div className="w-full h-2 bg-gray-300 my-2"></div>
  <h2 className="text-3xl text-secondary font-semibold ml-5 mb-5">Video</h2>
</div>
{userData && (
            <VideoItem
                videoData={
                  pendingChanges["intro_video"]?.value || userData.intro_video
                }
                handleChange={handleChange}
                field="intro_video"
                index={null}
                section="Introduction Video"
                pendingChanges={pendingChanges}
              />
      )}
      <section className="men-sec gallery-sec">
       <h2
          className={`${textSize} bg-secondary text-white px-8 py-2 w-full text-center`}
        >
          Gallery
        </h2>
        <div id="uploadFeedback" className={`${uploadLimitReached ? "text-red-500 animate-shake" : "text-black"}`}>
        Images: {currentGallery.length}/10
      </div>
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
        <div className="relative p-2" key={index}>
          {isExistingImage && (
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 z-10 p-1 px-2.5 text-white bg-red-600 hover:bg-red-700 rounded-full m-1" // Adjusted for visibility and aesthetics
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <img src={image.imageURL} alt="Picture" className="rounded-lg" />
        </div>
      );
    })}
  </Carousel>
)}
        <div
          className={`w-full p-2 mt-0 flex  justify-center items-center space-y-2 rounded-md`}
        >
              <DropFile
            onFileChange={(downloadURL) => {
              handleNewImage(
                { target: { value: downloadURL } },
              );
            }}
            maxFiles={10}
            acceptedFileTypes={{ "image/*": [] }}
          />
              </div>

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
