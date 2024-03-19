import "../generalbtn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

export default function Audio_Btn({ className, audioSrc, iconSize }) {
  const audio = useRef(new Audio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleAudioEnd = () => setIsPlaying(false);

    audio.current = new Audio(audioSrc);
    audio.current.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.current.removeEventListener("ended", handleAudioEnd);
      audio.current.pause();
    };
  }, [audioSrc]);

  const playAudio = () => {
    if (isPlaying) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }

    setIsPlaying(true);
    audio.current.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    });
  };

  const buttonStyles = isPlaying
    ? { backgroundColor: "#fff", color: "var(--primary_color)" }
    : {};

  return (
    <button
      className="flex flex-col items-center absolute z-10 justify-center p-2.5 text-xs rounded-sm mt-2.5 ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn"
      onClick={playAudio}
      style={buttonStyles}
      title="Audio Button"
    >
      <FontAwesomeIcon icon={faHeadphones} size={iconSize} />
    </button>
  );
}

Audio_Btn.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  iconSize: PropTypes.string,
};
