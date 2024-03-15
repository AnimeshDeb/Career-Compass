import PropTypes from "prop-types";
import ReactPlayer from 'react-player/lazy';

export default function UserMode({ userData }) {
  const renderTextVideo = (content) => {
    if (content.startsWith("http")) {
      return (
        <div className="flex justify-center">
        <ReactPlayer
          url={content}
          controls={true}
          className="react-player"
          width="100%"
          height="100%"
          style={{ aspectRatio: '16 / 9' }}
        />
      </div>
      );
    } else {
      return <p>{content}</p>;
    }
  };

  return (
    <>
      {userData && (
        <>
          <section className="flex flex-wrap justify-center my-5">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">Introduction</h2>
              {userData.introduction ? (
                renderTextVideo(userData.introduction)
              ) : (
                <p>No introduction available.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">Skills</h2>
              {userData.skills ? (
                renderTextVideo(userData.skills)
              ) : (
                <p>No skills available.</p>
              )}
            </div>
          </section>

          <section className="my-5">
            <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">Education</h2>
            {userData.education && userData.education.length > 0 ? (
              userData.education.map((education, index) => (
                <div className="my-2 px-5" key={index}>
                  <h3 className="text-lg">{education.University}</h3>
                  <div className="flex items-center space-x-5">
                    <h4>{education.DegreeType}</h4>
                    <h4>{education.Major}</h4>
                    <h4 className="text-indigo-400">| {education.ClassOf}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p>No education information available.</p>
            )}
          </section>

          <section className="w-full flex flex-col md:flex-row items-start justify-center my-5">
            <div className="w-3/5 flex flex-col items-center">
              <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">Challenges</h2>
              {userData.challenges ? (
                <div className="container mx-auto p-10 m-0">
                {renderTextVideo(userData.challenges)}
                </div>
              ) : (
                <p>No challenges available.</p>
              )}
            </div>
            <aside className="md:w-2/5 h-full bg-primary text-white p-5 text-lg">
              <p className="w-full h-full p-5">Keep on looking. You will find it! - Maybolin AI</p>
            </aside>
          </section>

          <section className="my-5">
            <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">Employment History</h2>
            {userData.jobs && userData.jobs.length > 0 ? (
              userData.jobs.map((job, index) => (
                <div className="flex items-center space-x-2 px-5" key={index}>
                  <h4 className="text-lg">{job.Job_Name}</h4>
                  <h4 className="text-md text-indigo-400">| {job.Job_location}</h4>
                </div>
              ))
            ) : (
              <h2>Add some jobs on Edit Mode</h2>
            )}
          </section>

          <section className="my-5">
            <h2 className="text-2xl bg-primary text-white px-8 py-2 w-full text-center">References</h2>
            {userData.references && userData.references.length > 0 ? (
              userData.references.map((reference, index) => (
                <div className="my-2 px-5" key={index}>
                  <div className="flex items-center space-x-5">
                    <h3 className="text-lg text-indigo-600">
                      {reference.name ? `${reference.name}, ${reference.company},` : "Reference name not provided"}
                    </h3>
                    <h3 className="text-md text-indigo-400">{reference.email || "Email not provided"}</h3>
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
