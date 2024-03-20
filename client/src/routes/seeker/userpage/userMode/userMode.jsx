import PropTypes from "prop-types";
import ReactPlayer from "react-player/lazy";
import Lottie from "lottie-react";
import animationAI from "../../../../images/animatedAI.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faUserGraduate,
  faBook,
  faHatWizard,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

export default function UserMode({ userData, iconSize }) {
  const textSize = "text-base md:text-lg lg:text-xl xl:text-2xl";

  const educationIcons = {
    "High School": faSchool,
    "Associate's": faUserGraduate,
    "Bachelor's": faBook,
    "Master's": faHatWizard,
    PhD: faBrain,
  };

  const renderTextVideo = (content) => {
    if (content.startsWith("http")) {
      return (
        <div className="flex justify-center items-center p-5 mt-0">
          <div className="w-full max-w-lg aspect-video">
            <ReactPlayer
              url={content}
              controls={true}
              style={{ margin: "auto" }}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`${textSize} p-5`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  };

  return (
    <>
      {userData && (
        <>
          <section className="flex flex-wrap justify-center pb-0">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Introduction
              </h2>
              {userData.introduction ? (
                renderTextVideo(userData.introduction)
              ) : (
                <p>No introduction available.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Skills
              </h2>
              {userData.skills ? (
                renderTextVideo(userData.skills)
              ) : (
                <p>No skills available.</p>
              )}
            </div>
          </section>

          <section className="w-full flex flex-col md:flex-row items-start justify-center my-5">
            <div className="w-full md:w-2/5 xl:w-1/2 flex flex-col items-center">
              <h2
                className={`${textSize} md:rounded-r-md bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Challenges
              </h2>
              {userData.challenges ? (
                renderTextVideo(userData.challenges)
              ) : (
                <p>No challenges available.</p>
              )}
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
              {userData.education && userData.education.length > 0 ? (
                userData.education.map((education, index) => (
                  <div className="my-4 px-5" key={index}>
                    <div className="flex items-start space-x-4">
                      <FontAwesomeIcon
                        icon={educationIcons[education.DegreeType]}
                        size={iconSize}
                        className="text-secondary mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold">
                          {education.University}
                        </h3>
                        <p>
                          {education.DegreeType} {education.Major}
                        </p>
                      </div>
                      <div className="flex-initial text-primary text-lg">
                        | {education.ClassOf}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No education information available.</p>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Employment History
              </h2>
              {userData.jobs && userData.jobs.length > 0 ? (
                userData.jobs.map((job, index) => (
                  <div className="flex items-center my-4 px-5" key={index}>
                    <h4 className="flex-1 text-lg">{job.Job_Name}</h4>
                    <h4 className="flex-initial text-primary text-lg">
                      | {job.Job_Location}
                    </h4>
                  </div>
                ))
              ) : (
                <h2>Add some jobs on Edit Mode</h2>
              )}
            </div>
          </section>

          <section className="my-5">
            <h2
              className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
            >
              References
            </h2>
            {userData.references && userData.references.length > 0 ? (
              userData.references.map((reference, index) => (
                <div className="my-2 md:px-20 md:py-5 py-1 px-5 " key={index}>
                  <div className="flex items-center space-x-1">
                    <h3 className={`${textSize} text-primary font-semibold`}>
                      {reference.name
                        ? `${reference.name}, ${reference.company},`
                        : "Reference name not provided"}
                    </h3>
                    <h3
                      className={`${textSize} text-secondary pl-2 ml-0 font-normal pt-1`}
                    >
                      {reference.email || "Email not provided"}
                    </h3>
                  </div>
                  <p className="font-semibold">
                    {reference.desc || "Description not provided"}
                  </p>
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
  iconSize: PropTypes.string,
};
