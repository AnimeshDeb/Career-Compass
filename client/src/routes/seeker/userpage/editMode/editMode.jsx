import {
  uploadFileToStorage,
  deleteFilesInFolder,
  updateUserField,
  deleteReference,
  updateJobField,
  updateEducationField,
} from "../../../../functions/seekerFunctions";
import PropTypes from "prop-types";
import { useCallback, useState, useEffect } from "react";
import React from "react";
import Lottie from "lottie-react";
import animationAI from "../../../../images/animatedAI.json";
import DropFile from "../../../../components/DropFile/DropFileEditMode";
import EditorTxt from "../../../../components/texteditor/Editor";
import ReactPlayer from "react-player";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faUserGraduate,
  faBook,
  faHatWizard,
  faBrain,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import AIface from "../../../../images/flat_illustrations/AIface.png";
const stateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "AS", label: "American Samoa" },
  { value: "DC", label: "District of Columbia" },
  { value: "FM", label: "Federated States of Micronesia" },
  { value: "GU", label: "Guam" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "PW", label: "Palau" },
  { value: "PR", label: "Puerto Rico" },
  { value: "VI", label: "Virgin Islands" },
];
const textSize = "text-sm md:text-base lg:text-lg xl:text-xl";
const JobItem = React.memo(({ job, index, handleChange }) => {
  const [jobName, setJobName] = useState(job.Job_Name);
  const [location, setLocation] = useState(() => {
    const parts = job.Job_Location.split(", ");
    return {
      city: parts[0] || "",
      state: parts[1] || "",
      country: parts[2] || "United States",
    };
  });
  const handleJobNameChange = (e) => {
    // Extract the new value from the event.
    const newValue = e.target.value;
    setJobName(newValue);
    // Call handleChange with the updated value.
    handleChange(
      {
        target: {
          value: newValue,
        },
      },
      "text",
      `jobs[${index}].Job_Name`,
      "Job name",
      index
    );
  };
  const handleCityChange = (e) => {
    const newLocation = { ...location, city: e.target.value };
    setLocation(newLocation);
    handleChange(
      {
        target: {
          value: `${newLocation.city}, ${location.state}, ${location.country}`,
        },
      },
      "text",
      `jobs[${index}].Job_Location`, // Ensure the index is used to correctly target the job
      "Job location",
      index
    );
  };

  const handleStateChange = (selectedOption) => {
    const newLocation = {
      ...location,
      state: selectedOption ? selectedOption.value : location.state, // Preserve the current state if selection is cleared
    };
    setLocation(newLocation);
    handleChange(
      {
        target: {
          value: `${location.city}, ${newLocation.state}, ${location.country}`,
        },
      },
      "text",
      `jobs[${index}].Job_Location`,
      "Job location",
      index
    );
  };

  return (
    <div className="flex flex-col gap-2 p-5">
      <input
        type="text"
        className="form-input p-2 border border-gray-300 rounded-md"
        placeholder="Job Name"
        value={jobName}
        onChange={handleJobNameChange}
      />
      <input
        type="text"
        className="form-input p-2 border border-gray-300 rounded-md"
        placeholder="City"
        value={location.city}
        onChange={handleCityChange}
      />
      <Select
        options={stateOptions}
        onChange={handleStateChange}
        value={stateOptions.find((option) => option.value === location.state)}
        placeholder="Select State"
        isClearable={true}
        className="mb-4"
      />
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold p-2 flex-grow text-primary">
        United States
      </h1>
    </div>
  );
});
const VideoOrTextItem = React.memo(
  ({ videoData, handleChange, field, pendingChanges, section, index }) => {
    // Determine initial content type. If videoData is a URL, we set it as a video, otherwise, it's text.
    const initialContentType =
      typeof videoData === "string" &&
      (/^https?:\/\//.test(videoData) || /^blob:/.test(videoData))
        ? "video"
        : "text";
    const [content, setContent] = useState({
      type: initialContentType,
      value: videoData,
    });

    useEffect(() => {
      // Check for pending changes to update the local state accordingly
      const pendingChange = pendingChanges[field];
      if (pendingChange) {
        setContent({
          type: pendingChange.type,
          value:
            pendingChange.type === "video" &&
            pendingChange.value.startsWith("blob:")
              ? pendingChange.value
              : pendingChange.value,
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
          style={{ minHeight: "28vh" }}
        >
          {content.type === "video" ? (
            <ReactPlayer
              url={content.value}
              controls={true}
              style={{ margin: "auto" }}
              width="100%"
              height="100%"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: content.value }}
              className={`${textSize} overflow-auto`}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
        <div
          className={`w-full p-2 mt-0 flex flex-col justify-between space-y-2 rounded-md`}
        >
          <EditorTxt
            handleEditorChange={handleEditorChange}
            seekerTxtIntro={content.type === "text" ? content.value : ""}
          />
          <div className="flex justify-center p-2 h-full items-center md:flex-col md:justify-center md:items-center space-x-2 md:space-x-0 ">
            <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
            <span className="text-md font-semibold opacity-70">OR</span>
            <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
          </div>
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

const EducationItem = React.memo(
  ({
    index,
    universityValue,
    degreeTypeValue,
    majorValue,
    classOfValue,
    handleChange,
    id,
  }) => {
    const [university, setUniversity] = useState(universityValue);
    const [degreeType, setDegreeType] = useState(degreeTypeValue);
    const [major, setMajor] = useState(majorValue);
    const [classOf, setClassOf] = useState(classOfValue);

    const handleInputChange = (setter, type) => (e) => {
      const { value } = e.target;
      setter(value);
      // Depending on your implementation, you may wish to update parent state here
      handleChange(e, "text", e.target.name, `Education ${type}`, id);
    };

    // For degree type, which is a special case since it's not directly linked to an input field
    const handleDegreeTypeChange = (type) => {
      setDegreeType(type);
      // Update the parent state with the new degree type
      handleChange(
        { target: { value: type, name: "degreeType" } },
        "text",
        "education.DegreeType",
        "Education Degree",
        id
      );
    };

    const educationIcons = {
      "High School": faSchool,
      "Associate's": faUserGraduate,
      "Bachelor's": faBook,
      "Master's": faHatWizard,
      PhD: faBrain,
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
      <div className="flex flex-col gap-2 mb-4 p-5">
        <input
          type="text"
          name="education.University"
          className="form-input w-full p-2 border border-gray-300 rounded-md"
          placeholder="University"
          value={university}
          onChange={handleInputChange(setUniversity, "Name")}
        />

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
          {Object.entries(educationIcons).map(([type, icon]) => (
            <button
              key={type}
              className={`py-2 px-4 border rounded-md ${
                degreeType === type
                  ? "bg-primary text-white"
                  : "bg-white text-primary border-gray-400"
              } flex items-center justify-center`}
              onClick={() => handleDegreeTypeChange(type)}
            >
              <FontAwesomeIcon icon={icon} className="mr-2" />
              {type}
            </button>
          ))}
        </div>

        <input
          type="text"
          name="education.Major"
          className="form-input w-full p-2 border border-gray-300 rounded-md"
          placeholder="Major"
          value={major}
          onChange={handleInputChange(setMajor, "Major")}
        />

        <select
          name="education.classOf"
          className="form-select w-full p-2 border border-gray-300 rounded-md"
          value={classOf}
          onChange={handleInputChange(setClassOf, "ClassOf")}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
const ReferenceItem = React.memo(({ reference, handleDelete, index }) => {
  const { name, company, email, desc } = reference;

  return (
    <div className="my-2 md:px-20 md:py-5 py-1 px-5 " key={index}>
      <button
        onClick={() => handleDelete(index)}
        className="bg-red-500 text-white px-2 ml-0 rounded-full hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
      <div className="flex items-center space-x-1">
        <h3 className={`${textSize} text-primary font-semibold`}>
          {name ? `${name}, ${company},` : "Reference name not provided"}
        </h3>
        <h3 className={`${textSize} text-secondary pl-2 ml-0 font-normal pt-1`}>
          {email || "Email not provided"}
        </h3>
      </div>
      <p className="font-semibold">{desc || "Description not provided"}</p>
    </div>
  );
});
VideoOrTextItem.displayName = "VideoOrTextItem";
ReferenceItem.displayName = "ReferenceItem";
EducationItem.displayName = "EducationItem";
JobItem.displayName = "JobItem";

export default function EditMode({
  userData,
  userId,
  pendingChanges,
  setPendingChanges,
  triggerUserDataRefresh,
}) {
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const textSize = "text-base md:text-lg lg:text-xl xl:text-2xl";
  const markForDeletion = useCallback(
    (index) => {
      setMarkedForDeletion((current) => [...current, index]);
      const referenceToDelete = userData.references[index];
      if (referenceToDelete) {
        const identifier = referenceToDelete.email;
        setPendingChanges((prevChanges) => ({
          ...prevChanges,
          [`delete_${identifier}`]: {
            type: "delete",
            value: referenceToDelete,
            section: "Reference",
          },
        }));
      } else {
        console.error("Reference to delete not found at index:", index);
      }
    },
    [userData.references]
  );
  const handleDeleteReference = useCallback(
    (index) => {
      markForDeletion(index);
    },
    [markForDeletion]
  );

  const revertChange = useCallback(
    (field) => {
      if (
        pendingChanges[field] &&
        pendingChanges[field].type === "video" &&
        pendingChanges[field].value.startsWith("blob:")
      ) {
        // Revoke the blob URL to free up resources
        URL.revokeObjectURL(pendingChanges[field].value);
      }
      if (field.startsWith("delete_")) {
        const identifier = field.replace("delete_", "");
        const referenceIndex = userData.references.findIndex(
          (ref) => ref.email === identifier
        );
        if (referenceIndex !== -1) {
          setMarkedForDeletion((current) =>
            current.filter((index) => index !== referenceIndex)
          );
        }
      }
      setPendingChanges((currentChanges) => {
        const updatedChanges = { ...currentChanges };
        delete updatedChanges[field];
        return updatedChanges;
      });
    },
    [pendingChanges, setPendingChanges]
  );
  const handleChange = useCallback(
    (event, type, field, section, index) => {
      console.log("Pending CHanges:", pendingChanges);
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
      }));
      console.log("Pending CHanges:", pendingChanges);
    },
    [setPendingChanges]
  );
  const saveChanges = async () => {
    setSaveStatus("saving");
    try {
      // Handle deletion of references
      const deletionPromises = markedForDeletion.map(async (index) => {
        const refFields = userData.references[index];
        if (refFields) {
          return deleteReference(userId, refFields);
        }
        console.error("Invalid reference fields:", refFields);
      });

      // Handle specific changes for "education" and "jobs" before general updates
      const educationChanges = Object.entries(pendingChanges).filter(
        ([field]) => field.startsWith("education")
      );
      const jobChanges = Object.entries(pendingChanges).filter(([field]) =>
        field.startsWith("jobs")
      );

      // Process education changes
      for (const [field, change] of educationChanges) {
        const { index, ...updateData } = change;
        await updateEducationField(userId, field, index, updateData);
      }

      // Process job changes
      for (const [field, change] of jobChanges) {
        const { index, ...updateData } = change;
        await updateJobField(userId, field, index, updateData);
      }

      // Filter out "jobs" and "education" changes from general updates
      const generalChanges = Object.entries(pendingChanges).filter(
        ([field]) => !field.startsWith("jobs") && !field.startsWith("education")
      );

      // Prepare general update operations
      const updateOperations = generalChanges.map(
        async ([field, { value, type }]) => {
          if (type === "text") {
            return { [field]: value };
          }

          // Process file uploads for video and image types
          const filename = `${field}_${userData.displayName}.mp4`;
          const deletePrevious = `Users/Seekers/${userId}/${field}/`;
          await deleteFilesInFolder(deletePrevious);
          const storeChange = `${deletePrevious}${filename}`;

          if (type === "video" || type === "image") {
            const response = await fetch(value);
            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });
            value = await uploadFileToStorage(file, storeChange);
          }
          return { [field]: value };
        }
      );

      await Promise.all([...deletionPromises, ...updateOperations]);

      // Apply all updates
      const updates = await Promise.all(updateOperations);
      for (const update of updates) {
        await updateUserField(update, userId);
      }

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
        <>
          <section className="flex flex-wrap justify-center pb-0 mt-3">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Introduction
              </h2>
              <VideoOrTextItem
                videoData={
                  pendingChanges["introduction"]?.value || userData.introduction
                }
                handleChange={handleChange}
                field="introduction"
                index={null}
                section="Introduction"
                pendingChanges={pendingChanges}
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Skills
              </h2>
              <VideoOrTextItem
                videoData={pendingChanges["skills"]?.value || userData.skills}
                handleChange={handleChange}
                field="skills"
                index={null}
                section="Skills"
                pendingChanges={pendingChanges}
              />
            </div>
          </section>

          <section className="w-full flex flex-col md:flex-row items-start justify-center my-5">
            <div className="w-full md:w-2/5 xl:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} md:rounded-r-md bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Challenges
              </h2>
              <VideoOrTextItem
                videoData={
                  pendingChanges["challenges"]?.value || userData.challenges
                }
                handleChange={handleChange}
                field="challenges"
                index="testseeker"
                section="Challenges"
                pendingChanges={pendingChanges}
              />
            </div>
            <aside
              className={`flex w-full md:w-3/5 xl:w-1/2 flex items-center justify-center sm:px-10 lg:px-0 md:px-0 bg-white text-white rounded-bl-lg ${textSize}`}
            >
              <div className="w-auto flex-shrink-0">
                <img
                  src={AIface}
                  alt="Maybolin"
                  className="sm:w-24 w-24 md:w-36 lg:w-56 max-w-sm sm:p-0 sm:m-0"
                />
              </div>
              <div className="flex-1 bg-blue-100 px-2 py-2 ml-0 mr-4 shadow-lg relative text-left mx-5 my-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
                <p className={`${textSize} text-primary`}>
                  Edit and show your best self to the world!
                </p>
                <div className="absolute top-0 -left-2 w-10 h-0 border-l-transparent border-b-[10px] border-b-primary"></div>
                <div className="flex justify-end mt-0"></div>
              </div>
            </aside>
          </section>
          <section className="flex flex-wrap justify-center pb-0">
            <div className="w-full md:w-1/2">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Education
              </h2>
              {userData.education.map((education, index) => {
                const universityValue =
                  pendingChanges[`education[${index}].University`]?.value ||
                  education.University ||
                  "";
                const degreeTypeValue =
                  pendingChanges[`education[${index}].DegreeType`]?.value ||
                  education.DegreeType ||
                  "";
                const majorValue =
                  pendingChanges[`education[${index}].Major`]?.value ||
                  education.Major ||
                  "";
                const classOfValue =
                  pendingChanges[`education[${index}].ClassOf`]?.value ||
                  education.ClassOf ||
                  "";

                return (
                  <EducationItem
                    key={index}
                    index={index}
                    universityValue={universityValue}
                    degreeTypeValue={degreeTypeValue}
                    majorValue={majorValue}
                    classOfValue={classOfValue}
                    id={education.id}
                    handleChange={handleChange}
                  />
                );
              })}
            </div>
            <div className="w-full md:w-1/2">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Employment History
              </h2>
              {userData.jobs.map((job, index) => {
                const jobNameValue =
                  pendingChanges[`jobs[${index}].Job_Name`]?.value ||
                  job.Job_Name;
                const jobLocationValue =
                  pendingChanges[`jobs[${index}].Job_Location`]?.value ||
                  job.Job_Location;

                return (
                  <JobItem
                    key={index}
                    index={job.id}
                    job={{
                      ...job,
                      Job_Name: jobNameValue,
                      Job_Location: jobLocationValue,
                    }}
                    handleChange={handleChange}
                  />
                );
              })}
            </div>
          </section>
          <section className="sec references-sec">
            <h2
              className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
            >
              References
            </h2>
            {userData.references.map((reference, index) => (
              <ReferenceItem
                key={index}
                index={index}
                reference={reference}
                handleDelete={handleDeleteReference}
              />
            ))}
          </section>
        </>
      )}
    </>
  );
}

EditMode.propTypes = {
  userData: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        level: PropTypes.string,
        name: PropTypes.string,
        score: PropTypes.string,
      })
    ),
    references: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        company: PropTypes.string,
        email: PropTypes.string,
        desc: PropTypes.string,
      })
    ),
    challenges: PropTypes.string,
    skills: PropTypes.string,
    introduction: PropTypes.string,
    banner: PropTypes.string,
    pictureURL: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  pendingChanges: PropTypes.object.isRequired,
  setPendingChanges: PropTypes.func.isRequired,
};
JobItem.propTypes = {
  job: PropTypes.shape({
    Job_Name: PropTypes.string.isRequired,
    Job_location: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};
VideoOrTextItem.propTypes = {
  videoData: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)])
    .isRequired,
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
EducationItem.propTypes = {
  index: PropTypes.number.isRequired,
  universityValue: PropTypes.string.isRequired,
  degreeTypeValue: PropTypes.string.isRequired,
  majorValue: PropTypes.string.isRequired,
  classOfValue: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
ReferenceItem.propTypes = {
  reference: PropTypes.shape({
    name: PropTypes.string,
    company: PropTypes.string,
    email: PropTypes.string,
    desc: PropTypes.string,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
