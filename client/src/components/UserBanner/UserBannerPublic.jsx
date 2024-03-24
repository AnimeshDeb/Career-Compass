import PropTypes from "prop-types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function UserBannerPublic({ banner, picture, name, isLoading }) {
  const placeholderBanner = "/placeholderBanner.jpg";
  const placeholderPFP = "/placeholderPFP.png";
  const renderUrlImage = (dataType, data, field) => {
    return data || (field === "banner" ? placeholderBanner : placeholderPFP);
  };

  return (
    <>
      <div className="relative text-center">
        <div className="w-full block object-cover">
          {isLoading ? (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              <Skeleton height={200} width="100%" />
            </SkeletonTheme>
          ) : (
            <img
              src={banner || placeholderBanner}
              alt="banner"
              className="w-full h-48 object-cover" // Adjusted the class for banner image height
            />
          )}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:translate-y-16 -translate-y-2 z-10 flex flex-col items-center">
          <div className="rounded-full overflow-hidden border-4 border-primary bg-white flex justify-center items-center w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 xl:w-36 xl:h-36">
            {isLoading ? (
              <Skeleton circle={true} width="100%" height="100%" />
            ) : (
              <img
                src={picture || placeholderPFP}
                className="w-full h-full object-cover"
                alt="User"
              />
            )}
          </div>
          <h3 className="break-words -mt-3 -mb-1.5 bg-primary text-white md:py-1 md:px-3 px-1.5 py-0 rounded-lg md:rounded-br-lg md:rounded-bl-lg text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xs">
            {name || "User Name"} {/* Fallback text adjusted */}
          </h3>
        </div>
      </div>
    </>
  );
}

UserBannerPublic.propTypes = {
  banner: PropTypes.string,
  picture: PropTypes.string,
  name: PropTypes.string,
};
