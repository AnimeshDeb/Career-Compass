import Lottie from "lottie-react";
import animationAI from "../../images/animatedAI.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPlayer from "react-player";

import AIface from "../../images/flat_illustrations/AIface.png";
import "react-loading-skeleton/dist/skeleton.css";
import {
  faSchool,
  faUserGraduate,
  faBook,
  faHatWizard,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

export default function PublicSeeker({
  userData,
  textSize,
  isLoading,
  iconSize,
}) {
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
        <div className="flex justify-center items-center p-5 mt-5">
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
                <div className="p-2 mt-5 justify-between">
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
                <div className="text-center mt-5 p-5">
                  <p className="text-lg text-primary">No introduction yet.</p>
                  <p className="text-sm text-secondary">Working on it!</p>
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
                <div className="p-2 mt-5  justify-between">
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
                <div className="text-center mt-5  p-5">
                  <p className="text-lg text-primary">No skills added yet.</p>
                  <p className="text-sm text-secondary">Working on it!</p>
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
                    No chhalenges added yet.
                  </p>
                  <p className="text-sm text-secondary">Working on it!</p>
                </div>
              )}
            </div>
            <aside
              className={`flex w-full m-0 p-0 md:w-3/5 xl:w-1/2 flex items-center justify-center sm:px-10 lg:px-0 md:px-0 bg-white text-white rounded-bl-lg ${textSize}`}
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
                  <span className="text-secondary text-3xl">Sign up</span> to
                  create your own profile, today!
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
                    No educational background added.
                  </p>
                  <p className="text-sm text-secondary">Working on it!</p>
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
                  <p className="text-lg text-primary">No jobs added.</p>
                  <p className="text-sm text-secondary">Working on it!</p>
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
                <p className="text-lg text-primary">No references yet.</p>
                <p className="text-sm text-secondary">
                  Become their mentor to add one!
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
