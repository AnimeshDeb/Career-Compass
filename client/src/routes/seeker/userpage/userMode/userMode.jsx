import "./userMode.css";
import PropTypes from "prop-types";

export default function UserMode({ userData }) {
  const renderTextVideo = (content) => {
    if (content.startsWith("http")) {
      return (
        <video controls>
          <source src={content} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p>{content}</p>;
    }
  };
  return (
    <>
      {userData && (
        <>
          <section className="sec intro-sec">
            <div className="intro-vid">
              <h2>Introduction</h2>
              {userData.introduction ? (
                renderTextVideo(userData.introduction)
              ) : (
                <p>No introduction available.</p>
              )}
            </div>
            <div className="skill-vid">
              <h2>Skills</h2>
              {userData.skills ? (
                renderTextVideo(userData.skills)
              ) : (
                <p>No skills available.</p>
              )}
            </div>
          </section>
          <section className="sec education">
            <h2>Education</h2>
            {userData.education && userData.education.length > 0 ? (
              userData.education.map((education, index) => (
                <div className="education-item" key={index}>
                  <h3>{education.University}</h3>
                  <div className="education-bottom">
                    <h4>{education.DegreeType}</h4>
                    <h4>{education.Major}</h4>
                    <h4 className="education-classof">| {education.ClassOf}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p>No education information available.</p>
            )}
          </section>
          <section className="middle">
            <section className="middle-container">
              <div className="sec challenges-sec">
                <h2>Challenges</h2>
                {userData.challenges ? (
                  renderTextVideo(userData.challenges)
                ) : (
                  <p>No challenges available.</p>
                )}
              </div>
              <aside className="Maybolin-AI">
                <p>Keep on looking. You will find it! - Maybolin AI</p>
              </aside>
            </section>
          </section>
          <section className="sec job-sec">
            <h2>Employment History</h2>
            {userData.jobs && userData.jobs.length > 0 ? (
              userData.jobs.map((job, index) => (
                <>
                  <div className="job-item" key={index}>
                    <h4 className="job-name">{job.Job_Name}</h4>
                    <h4 className="job-location"> | {job.Job_location}</h4>
                  </div>
                </>
              ))
            ) : (
              <h2>Add some jobs on Edit Mode</h2>
            )}
          </section>
          <section className="sec references-sec">
            <h2>References</h2>
            {userData.references && userData.references.length > 0 ? (
              userData.references.map((reference, index) => (
                <div className="reference-item" key={index}>
                  <div className="top-company">
                    <h3 className="company-name">
                      {reference.name
                        ? `${reference.name}, ${reference.company},`
                        : "Reference name not provided"}
                    </h3>
                    <h3 className="company-email">
                      {reference.email || "Email not provided"}
                    </h3>
                  </div>
                  <p>{reference.desc || "Description not provided"}</p>
                </div>
              ))
            ) : (
              <p>No references available.</p>
            )}
          </section>
        </>
      )}
    </>
  );
}

UserMode.propTypes = {
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
};
