import {
  uploadFileToStorage,
  deleteFilesInFolder,
  updateUserField,
  deleteReference,
} from "../../../../functions/seekerFunctions";
import PropTypes from "prop-types";
import { useCallback, useState, useEffect } from "react";
import React from "react";
import Lottie from "lottie-react";
import animationAI from "../../../../images/animatedAI.json";
import DropFile from "../../../../components/DropFile/DropFile";
import EditorTxt from "../../../../components/texteditor/Editor";
import ReactPlayer from "react-player";
import DOMPurify from "dompurify";
const textSize = "text-base md:text-lg lg:text-xl xl:text-2xl";
const JobItem = React.memo(({ job, index, handleChange }) => {
  const jobNameValue = job.Job_Name;
  const jobLocationValue = job.Job_location;

  return (
    <div className="flex flex-col gap-2 ">
      <input
        type="text"
        className="form-input p-2 border border-gray-300 rounded-md"
        placeholder="Job Name"
        value={jobNameValue}
        onChange={(e) => handleChange(e, "text", `jobs[${index}].Job_Name`)}
      />
      <input
        type="text"
        className="form-input p-2 border border-gray-300 rounded-md"
        placeholder="Job Location"
        value={jobLocationValue}
        onChange={(e) => handleChange(e, "text", `jobs[${index}].Job_location`)}
      />
    </div>
  );
});
const ReferenceItem = React.memo(({ reference, handleDelete, index }) => {
  const { name, company, email, desc } = reference;

  return (
    <div className="my-2 md:px-20 md:py-5 py-1 px-5 " key={index}>
      <button
        onClick={() => handleDelete(index)}
        className="bg-red-500 text-white px-2 ml-0 rounded-full hover:bg-red-700 transition-colors"
      >
        Eliminate
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
const VideoOrTextItem = React.memo(
  ({ videoData, handleChange, field, index }) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const isUrl =
      typeof videoData === "string" && /^https?:\/\//.test(videoData);

    useEffect(() => {
      if (videoData instanceof File) {
        const fileUrl = URL.createObjectURL(videoData);
        setPreviewUrl(fileUrl);
        console.log(fileUrl);
      } else if (isUrl) {
        setPreviewUrl(videoData);
      } else {
        setPreviewUrl("");
      }
    }, [videoData]);
    const handleFileChange = (file) => {
      handleChange({ target: { files: [file] } }, "video", field, index);
    };

    const handleEditorChange = (e) => {
      const cleanHtml = DOMPurify.sanitize(e.htmlValue);
      handleChange({ target: { value: cleanHtml } }, "text", field, index);
    };

    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="w-full max-w-lg px-5 pt-5 pb-0 mb-0 aspect-video "
          style={{ minHeight: "28vh", maxHeight: "28vh" }}
        >
          {isUrl ? (
            <div className="w-full max-w-lg pb-0 mb-0 aspect-video">
              <ReactPlayer
                url={previewUrl}
                controls={true}
                style={{ margin: "auto" }}
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div
              className={`${textSize} px-5 pt-5 pb-0 mb-0  overflow-auto`}
              style={{ width: "100%", height: "100%" }}
              dangerouslySetInnerHTML={{ __html: videoData }}
            />
          )}
        </div>
        <div className="flex justify-center items-center space-x-5 w-full pt-5 mt-0 pl-5 pr-5 pb-5">
          <div
            className={`w-full pt-0 mt-0 md:w-1/2 flex flex-col justify-between rounded-md`}
          >
            {isUrl ? (
              <EditorTxt
                seekerTxtIntro=""
                handleEditorChange={handleEditorChange}
              />
            ) : (
              <EditorTxt
                seekerTxtIntro={videoData}
                handleEditorChange={handleEditorChange}
              />
            )}
          </div>
          <div className="flex justify-center py-2 p-0 m-0 h-full items-center md:flex-col md:justify-center md:items-center space-x-2 md:space-x-0 ">
            <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
            <span className="text-md font-semibold opacity-70">OR</span>
            <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
          </div>
          <div
            className={`w-full md:w-1/2 pt-0 mt-0 px-4 rounded-md h-auto min-h-250 lg:min-h-250`}
          >
            <DropFile
              onFileChange={handleFileChange}
              maxFiles={1}
              acceptedFileTypes={{ "video/*": [] }}
              showFile={false}
            />
          </div>
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
  }) => {
    const degreeOptions = [
      "Associate",
      "High School",
      "Bachelor's",
      "Master's",
      "PhD",
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          className="form-input w-full p-2 border border-gray-300 rounded-md"
          placeholder="University"
          value={universityValue}
          onChange={(e) =>
            handleChange(e, "text", `education[${index}].University`)
          }
        />
        <select
          className="form-select w-full p-2 border border-gray-300 rounded-md"
          value={degreeTypeValue}
          onChange={(e) =>
            handleChange(e, "text", `education[${index}].DegreeType`)
          }
        >
          {degreeOptions.map((degree, idx) => (
            <option key={idx} value={degree}>
              {degree}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-input w-full p-2 border border-gray-300 rounded-md"
          placeholder="Major"
          value={majorValue}
          onChange={(e) => handleChange(e, "text", `education[${index}].Major`)}
        />
        <select
          className="form-select w-full p-2 border border-gray-300 rounded-md"
          value={classOfValue}
          onChange={(e) =>
            handleChange(e, "text", `education[${index}].ClassOf`)
          }
        >
          {years.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

VideoOrTextItem.displayName = "VideoOrTextItem";
ReferenceItem.displayName = "ReferenceItem";
EducationItem.displayName = "EducationItem";
JobItem.displayName = "JobItem";

export default function EditMode({
  userData,
  userId,
  pendingChanges,
  setPendingChanges,
}) {
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
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
  const revertChange = (field) => {
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
  };
  const handleChange = useCallback(
    (event, type, field, index) => {
      let value;
      const key = `${field}`;

      if (type === "text") {
        value = event.target.value;
        if (pendingChanges[key] && pendingChanges[key].type === "video") {
          URL.revokeObjectURL(pendingChanges[key].value);
        }
      } else if (type === "video") {
        value = event.target.files[0];
      }

      setPendingChanges((prev) => ({
        ...prev,
        [key]: { value, type },
      }));
      console.log(pendingChanges);
    },
    [setPendingChanges]
  );

  const saveChanges = async () => {
    const updatedReferences = userData.references.filter(
      (ref, index) => !markedForDeletion.includes(index)
    );

    try {
      const deletionPromises = markedForDeletion.map(async (index) => {
        const refFields = userData.references[index];
        if (refFields) {
          await deleteReference(userId, refFields);
        } else {
          console.error("Invalid reference fields:", refFields);
        }
      });
      const updates = Object.entries(pendingChanges).map(
        async ([field, { value, type }]) => {
          const updateObject = {};
          if (type === "text") {
            updateObject[field] = value;
          } else {
            const deletePrevious = `Users/Seekers/${userData.displayName}/${field}/`;
            await deleteFilesInFolder(deletePrevious);
            const storeChange = `${deletePrevious}/${field}_${userData.displayName}`;
            const newPath = await uploadFileToStorage(value, storeChange);
            updateObject[field] = newPath;
          }
          updateUserField(updateObject, userId);
        }
      );

      await Promise.all([...updates, ...deletionPromises]);

      console.log("All changes saved successfully.");
      setPendingChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <>
      <button onClick={saveChanges}>Save changes</button>
      <div className="pending-changes">
        {Object.entries(pendingChanges).map(([key, change]) => {
          const isDeletion = key.startsWith("delete_");
          const isFileChange = change.type === "video" || "pictureURL";
          const displayKey = isDeletion ? key.replace("delete_", "") : key;
          let displayValue;
          if (isDeletion) {
            displayValue = "Marked for deletion - " + change.value.name;
          } else if (isFileChange) {
            displayValue = `File selected - ${change.value.name}`;
          } else {
            if (key.includes("education")) {
              displayValue = `${key.split(".")[1]}: ${change.value}`;
            } else {
              displayValue = change.value;
            }
          }

          return (
            <div key={key} className="pending-change">
              <span>
                {displayKey}: {displayValue}
              </span>
              <button onClick={() => revertChange(key)}>X</button>
            </div>
          );
        })}
      </div>
      {userData && (
        <>
          <section className="flex flex-wrap justify-center pb-0">
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
                index="testseeker"
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
                index="testseeker"
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
              />
            </div>
            <aside
              className={`flex w-full md:w-3/5 xl:w-1/2 flex items-center justify-center sm:px-10 lg:px-0 md:px-0 bg-white text-white rounded-bl-lg ${textSize}`}
            >
              <div className="w-auto flex-shrink-0">
                <Lottie
                  animationData={animationAI}
                  className="sm:w-36 w-36 md:w-60 lg:w-80 max-w-sm sm:p-0 sm:m-0"
                />
              </div>
              <div className="flex-1 bg-blue-100 px-2 py-2 ml-0 mr-4 shadow-lg relative text-left mx-5 my-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
                <p className={`${textSize} text-primary`}>
                  Keep on looking. You will find it! -{" "}
                  <span className="text-secondary font-bold">Maybolin AI</span>
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
                  pendingChanges[`jobs[${index}].Job_location`]?.value ||
                  job.Job_location;

                return (
                  <JobItem
                    key={index}
                    index={index}
                    job={{
                      ...job,
                      Job_Name: jobNameValue,
                      Job_location: jobLocationValue,
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
