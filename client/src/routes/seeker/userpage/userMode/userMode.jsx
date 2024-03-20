import PropTypes from "prop-types";
import ReactPlayer from "react-player/lazy";
import Lottie from "lottie-react";
import animationAI from "../../../../images/animatedAI.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  faSchool,
  faUserGraduate,
  faBook,
  faHatWizard,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
export default function UserMode({ userData, iconSize, isLoading }) {
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
            <div className="w-full md:w-1/2 items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Introduction
              </h2>
              {isLoading ? (
                <div className="p-2 justify-between">
                  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                    <Skeleton height={35} width="50%" />
                    <div className="w-full">
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={35}
                            width="100%"
                            className="mt-2"
                          />
                        ))}
                    </div>
                  </SkeletonTheme>
                </div>
              ) : userData.introduction ? (
                // Data exists, render it
                renderTextVideo(userData.introduction)
              ) : (
                // Data doesn't exist, and it's not loading, suggest adding content
                <div className="text-center p-5">
                  <p className="text-lg text-primary">
                    Your introduction is missing.
                  </p>
                  <p className="text-sm text-secondary">
                    Add an introduction in Edit Mode to showcase yourself to
                    potential employers.
                  </p>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2  items-center">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Skills
              </h2>
              {isLoading ? (
                <div className="p-2 justify-between">
                  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                    <Skeleton height={35} width="50%" />
                    <div className="w-full">
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={35}
                            width="100%"
                            className="mt-2"
                          />
                        ))}
                    </div>
                  </SkeletonTheme>
                </div>
              ) : userData.skills ? (
                renderTextVideo(userData.skills)
              ) : (
                <div className="text-center p-5">
                  <p className="text-lg text-primary">
                    You haven't added any skills yet.
                  </p>
                  <p className="text-sm text-secondary">
                    Add some skills in Edit Mode to showcase your abilities.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="w-full flex flex-col md:flex-row items-start justify-center my-5">
            <div className="w-full md:w-2/5 xl:w-1/2  items-center">
              <h2
                className={`${textSize} md:rounded-r-md bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Challenges
              </h2>
              {isLoading ? (
                <div className="p-2  justify-between">
                  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                    <Skeleton height={35} width="50%" />
                    <div className="w-full">
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={35}
                            width="100%"
                            className="mt-2"
                          />
                        ))}
                    </div>
                  </SkeletonTheme>
                </div>
              ) : userData.challenges ? (
                renderTextVideo(userData.challenges)
              ) : (
                <div className="text-center p-5">
                  <p className="text-lg text-primary">
                    Looks like you haven't faced any challenges yet.
                  </p>
                  <p className="text-sm text-secondary">
                    Share your challenges in Edit Mode to inspire others.
                  </p>
                </div>
              )}
            </div>
            <aside
              className={`flex w-full m-0 p-0 md:w-3/5 xl:w-1/2 flex items-center justify-center sm:px-10 lg:px-0 md:px-0 bg-white text-white rounded-bl-lg ${textSize}`}
            >
              <div className="w-auto flex-shrink-0">
                <Lottie
                  animationData={animationAI}
                  className="sm:w-32 w-32 md:w-60 lg:w-76  max-w-sm sm:p-0 sm:m-0"
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
              {isLoading ? (
                <div className="p-2  justify-between">
                  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                    <Skeleton height={35} width="50%" />
                    <div className="w-full">
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={35}
                            width="100%"
                            className="mt-2"
                          />
                        ))}
                    </div>
                  </SkeletonTheme>
                </div>
              ) : userData.education && userData.education.length > 0 ? (
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
                <div className="text-center p-5">
                  <p className="text-lg text-primary">
                    Your educational background is missing.
                  </p>
                  <p className="text-sm text-secondary">
                    Highlight your education in Edit Mode to attract
                    opportunities.
                  </p>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <h2
                className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
              >
                Employment History
              </h2>
              {isLoading ? (
                <div className="p-2  justify-between">
                  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                    <Skeleton height={35} width="50%" />
                    <div className="w-full">
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={35}
                            width="100%"
                            className="mt-2"
                          />
                        ))}
                    </div>
                  </SkeletonTheme>
                </div>
              ) : userData.jobs && userData.jobs.length > 0 ? (
                userData.jobs.map((job, index) => (
                  <div className="flex items-center my-4 px-5" key={index}>
                    <h4 className="flex-1 text-lg">{job.Job_Name}</h4>
                    <h4 className="flex-initial text-primary text-lg">
                      | {job.Job_Location}
                    </h4>
                  </div>
                ))
              ) : (
                <div className="text-center p-5">
                  <p className="text-lg text-primary">
                    You haven't listed any jobs yet.
                  </p>
                  <p className="text-sm text-secondary">
                    Add your employment history in Edit Mode to show off your
                    work experience.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="my-5">
            <h2
              className={`${textSize} bg-primary text-white px-8 py-2 w-full text-center`}
            >
              References
            </h2>
            {isLoading ? (
              <div className="p-2 justify-between">
                <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                  <Skeleton height={35} width="50%" />
                  <div className="w-full">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton
                          key={index}
                          height={35}
                          width="100%"
                          className="mt-2"
                        />
                      ))}
                  </div>
                </SkeletonTheme>
              </div>
            ) : userData.references && userData.references.length > 0 ? (
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
              <div className="text-center p-5">
                <p className="text-lg text-primary">
                  You don't have any references yet.
                </p>
                <p className="text-sm text-secondary">
                  Ask your mentor to add one for you!
                </p>
              </div>
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
