import Lottie from "lottie-react";
import animationAI from "../../images/animatedAI.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
export default function PublicMentor({
  userData,
  textSize,
  isLoading,
  iconSize,
}) {
  const introText = userData?.intro_text ?? "Introduction text not available";
  const introAudio = userData?.intro_audio;
  const introVideo = userData?.intro_video;
  const galleryItems = userData?.gallery;
  console.log(userData);
  return (
    <>
      <section className="flex flex-col justify-center items-center pb-0">
        <h2
          className={`${textSize} bg-primary text-white px-8 py-2 w-full text-left`}
        >
          Introduction
        </h2>
        {isLoading ? (
          <div className="p-2 w-full flex justify-center">
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              <Skeleton height={35} width="50%" />
              <div className="w-full mt-4">
                {Array(4)
                  .fill()
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
        ) : (
          <div className="men-intro-content p-5  w-full flex flex-col items-center">
            {userData?.intro_text ? (
              <div
                dangerouslySetInnerHTML={{ __html: userData.intro_text }}
                className={`${textSize} text-center pt-8 overflow-auto`}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="text-center w-full m-10">
                <p className="text-lg text-primary">
                  Introduction text not available.
                </p>
                <p className="text-sm text-secondary">Check back later!</p>
              </div>
            )}
            {userData?.intro_audio && (
              <Audio_Btn
                className="audio-btn mt-4"
                audioSrc={userData.intro_audio}
                iconSize={iconSize}
              />
            )}
          </div>
        )}

        {introVideo ? (
          <div className="w-full flex justify-center items-center p-5 mt-0">
            <div className="max-w-lg w-full aspect-video">
              <ReactPlayer
                className="react-player"
                url={introVideo}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-5 m-10">
            <p className="text-lg text-primary">
              Introduction video not added yet.
            </p>
            <p className="text-sm text-secondary">Check back later!</p>
          </div>
        )}
      </section>

      <section className="flex flex-wrap justify-center pb-0">
        <h2
          className={`${textSize} bg-secondary text-white px-8 py-2 w-full text-center`}
        >
          Gallery
        </h2>
        {isLoading ? (
          <div className="p-2 w-full">
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              <Skeleton height={35} width="50%" />
              <div className="w-full">
                {Array(4)
                  .fill()
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
        ) : galleryItems && galleryItems.length > 0 ? (
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={3000}
            className="w-full p-5"
          >
            {galleryItems.map((image, index) => (
              <div
                key={index}
                className="gallery-item p-2 flex justify-center items-center h-[300px] w-full"
              >
                <img
                  src={image.imageURL}
                  alt="Gallery item"
                  className="max-h-full max-w-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="text-center p-5 m-10">
            <p className="text-lg text-primary">Gallery is empty.</p>
            <p className="text-sm text-secondary">Check back later!</p>
          </div>
        )}
      </section>
    </>
  );
}
