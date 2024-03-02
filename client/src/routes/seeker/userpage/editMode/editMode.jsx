import "./editMode.css";
import {
  uploadFileToStorage,
  deleteFilesInFolder,
  updateUserField,
  deleteReference,
} from "../../../../functions/seekerFunctions";
import PropTypes from "prop-types";
import { useCallback, useState, useEffect } from "react";
import React from "react";

const JobItem = React.memo(({ job, index, handleChange }) => {
  const jobNameValue = job.Job_Name;
  const jobLocationValue = job.Job_location;

  return (
    <div className="job-item">
      <input
        type="text"
        value={jobNameValue}
        placeholder="Job Name"
        onChange={(e) => handleChange(e, "text", `jobs[${index}].Job_Name`)}
      />
      <input
        type="text"
        value={jobLocationValue}
        placeholder="Job Location"
        onChange={(e) => handleChange(e, "text", `jobs[${index}].Job_location`)}
      />
    </div>
  );
});
const ReferenceItem = React.memo(({ reference, handleDelete, index }) => {
  const { name, company, email, desc } = reference;

  return (
    <div className="reference-item">
      <div className="top-company">
        <h3 className="company-name">
          {name}, {company}
        </h3>
        <h3 className="company-email">{email}</h3>
        <button
          onClick={() => handleDelete(index)}
          className="delete-reference"
        >
          X
        </button>
      </div>
      <p>{desc}</p>
    </div>
  );
});
const VideoOrTextItem = React.memo(
  ({ videoData, handleChange, field, index }) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const isUrl =
      typeof videoData === "string" && /^https?:\/\//.test(videoData);

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    useEffect(() => {
      if (videoData instanceof File) {
        // Create a URL for the file
        const fileUrl = URL.createObjectURL(videoData);
        setPreviewUrl(fileUrl);
      } else if (
        typeof videoData === "string" &&
        (videoData.startsWith("http://") || videoData.startsWith("https://"))
      ) {
        setPreviewUrl(videoData);
      } else {
        setPreviewUrl("");
      }
    }, [videoData]);

    const inputId = `input-${field}-${index}`;

    const handleFileChange = (e) => {
      handleChange(e, "video", field, index);
    };

    const handleTextChange = (e) => {
      handleChange(e, "text", field, index);
    };

    return (
      <div className="media-container">
        {previewUrl ? (
          <video key={`${index}_${new Date().getTime()}`} controls>
            <source src={previewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          typeof videoData === "string" && <p>{videoData}</p>
        )}
        <div>
          <label htmlFor={`${inputId}-video`}>Upload New Video</label>
          <input
            id={`${inputId}-video`}
            type="file"
            onChange={handleFileChange}
            accept="video/*"
          />
        </div>
        <div>
          <label htmlFor={`${inputId}-text`}>Or Enter Text</label>
          <input
            id={`${inputId}-text`}
            type="text"
            defaultValue={
              !isUrl && typeof videoData === "string" ? videoData : ""
            }
            onBlur={handleTextChange}
            placeholder="Enter text"
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
      <div className="education-item">
        <input
          type="text"
          value={universityValue}
          onChange={(e) =>
            handleChange(e, "text", `education[${index}].University`)
          }
          placeholder="University"
        />
        <select
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
          value={majorValue}
          onChange={(e) => handleChange(e, "text", `education[${index}].Major`)}
          placeholder="Major"
        />
        <select
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
          <section className="sec intro-sec">
            <div className="intro-vid">
              <h2>Introduction</h2>
              <VideoOrTextItem
                videoData={
                  pendingChanges["introduction"]?.value || userData.introduction
                }
                handleChange={handleChange}
                field="introduction"
                index="testseeker"
              />
            </div>

            <div className="skill-vid">
              <h2>Skills</h2>
              <VideoOrTextItem
                videoData={pendingChanges["skills"]?.value || userData.skills}
                handleChange={handleChange}
                field="skills"
                index="testseeker"
              />
            </div>
          </section>
          <section className="sec education">
            <h2>Education</h2>
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
          </section>
          <section className="middle">
            <div className="middle-container">
              <div className="sec challenges-sec">
                <h2>Challenges</h2>
                <VideoOrTextItem
                  videoData={
                    pendingChanges["challenges"]?.value || userData.challenges
                  }
                  handleChange={handleChange}
                  field="challenges"
                  index="testseeker"
                />
              </div>
              <aside className="Maybolin-AI">
                <p>Keep on looking. You will find it. - Maybolin AI</p>
              </aside>
            </div>
          </section>
          <section className="sec job-sec">
            <h2>Employment History</h2>
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
          </section>
          <section className="sec references-sec">
            <h2>References</h2>
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
