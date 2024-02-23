import "./editMode.css";
import {
  uploadFileToStorage,
  deleteFilesInFolder,
  updateUserField,
} from "../../../../functions/seekerFunctions";
import PropTypes from "prop-types";
import { useState } from "react";

export default function EditMode({
  userData,
  userId,
  pendingChanges,
  setPendingChanges,
}) {
  const [markedForDeletion, setMarkedForDeletion] = useState([]);

  const markForDeletion = (index) => {
    setMarkedForDeletion((current) => [...current, index]);
  };

  const undoMarkForDeletion = (index) => {
    setMarkedForDeletion((current) => current.filter((i) => i !== index));
  };
  const handleChange = (event, type, field) => {
    let newChange = event.target.files[0];
    if (type === "text") {
      newChange = event.target.value;
    }

    setPendingChanges((prevChanges) => ({
      ...prevChanges,
      [`${field}`]: { value: newChange, type },
    }));
  };

  const saveChanges = async () => {
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
        console.log(updateObject);
        updateUserField(updateObject, userId);
      }
    );

    try {
      await Promise.all(updates);
      console.log("All changes saved successfully.");
      setPendingChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  const renderEditableView = (dataType, data, field, index = null) => {
    const pendingKey = `${field}`;
    const pendingData = pendingChanges[pendingKey]
      ? pendingChanges[pendingKey].value
      : data;

    switch (dataType) {
      case "text":
        return (
          <input
            type="text"
            value={pendingData}
            onChange={(e) => handleChange(e, dataType, field, index)}
          />
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
      case "reference": {
        if (markedForDeletion.includes(index)) {
          return (
            <div className="reference-item" key={index}>
              <button onClick={() => undoMarkForDeletion(index)}>Back</button>
            </div>
          );
        }

        return (
          <div className="reference-item" key={index}>
            <div className="top-company">
              <h3 className="company-name">
                {pendingData.name}, {pendingData.company}
              </h3>
              <h3 className="company-email">{pendingData.email}</h3>
              <button
                className="delete-reference"
                onClick={() => markForDeletion(index)}
              >
                X
              </button>
            </div>
            <p>{pendingData.desc}</p>
          </div>
        );
      }

      default:
        return null;
    }
  };
  return (
    <>
      <button onClick={saveChanges}>Save changes</button>
      {userData && (
        <section className="sec intro-sec">
          <div className="intro-vid">
            <h2>Introduction</h2>
            {renderEditableView(
              "video",
              userData.introduction,
              "introduction",
              "testseeker"
            )}
          </div>
          <div className="education">
            <h2>Education</h2>
            {userData.education.map((education, index) => (
              <div className="edit-education-text" key={index}>
                <h3>Level</h3>
                {renderEditableView(
                  "text",
                  education.level,
                  "level",
                  "testseeker",
                  index
                )}
                <h3>School Name</h3>
                {renderEditableView(
                  "text",
                  education.name,
                  "name",
                  "testseeker",
                  index
                )}
                <h3>Score</h3>
                {renderEditableView(
                  "text",
                  education.score,
                  "score",
                  "testseeker",
                  index
                )}
              </div>
            ))}
          </div>
          <div className="skill-vid">
            <h2>Skills</h2>
            {renderEditableView(
              "video",
              userData.skills,
              "skills",
              "testseeker"
            )}
          </div>
        </section>
      )}

      {userData && (
        <section className="middle">
          <section className="middle-container">
            <div className="sec challenges-sec">
              <h2>Challenges</h2>
              {renderEditableView(
                "video",
                userData.challenges,
                "challenges",
                "testseeker"
              )}
            </div>
            <aside className="Maybolin-AI">
              <p>Keep on looking. You will find it. - Maybolin AI</p>
            </aside>
          </section>
        </section>
      )}

      {userData && (
        <section className="sec references-sec">
          <h2>References</h2>
          {userData.references.map((reference, index) =>
            renderEditableView(
              "reference",
              reference,
              "references",
              "testseeker",
              index
            )
          )}
        </section>
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
    challenges: PropTypes.array,
    skills: PropTypes.array,
    introduction: PropTypes.string,
    banner: PropTypes.string,
    pictureURL: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  pendingChanges: PropTypes.object.isRequired,
  setPendingChanges: PropTypes.func.isRequired,
};
