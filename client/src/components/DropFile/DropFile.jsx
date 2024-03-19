import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faTimesCircle,
  faCheckCircle,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const DropFile = ({ onFileChange, maxFiles, acceptedFileTypes, showFile }) => {
  const [fileList, setFileList] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedList = [...fileList, ...acceptedFiles].slice(0, maxFiles);
      setFileList(updatedList);
      onFileChange(updatedList[0]);

      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              onFileChange(downloadURL);
            });
          }
        );
      }
    },
    [fileList, onFileChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
  });

  const fileRemove = (file) => {
    const updatedList = fileList.filter((f) => f !== file);
    setFileList(updatedList);
    onFileChange(null);
  };

  return (
    <div className="flex h-full space-x-4">
      <div
        {...getRootProps()}
        className={`flex flex-1 flex-col justify-center items-center border-dashed border-2 p-5 cursor-pointer rounded-lg ${
          isDragActive ? "bg-gray-100" : "bg-white"
        } ${
          fileList.length >= maxFiles ? "border-secondary" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <FontAwesomeIcon
          icon={fileList.length >= maxFiles ? faCheckCircle : faCloudUploadAlt}
          size="3x"
          className={`${
            fileList.length >= maxFiles ? "text-secondary" : "text-primary"
          } mb-3`}
        />
        <p>Drag & Drop your files here</p>
      </div>
      {fileList.length > 0 && showFile && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {fileList.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white rounded-md p-2 mb-2 overflow-hidden"
            >
              <FontAwesomeIcon
                icon={faFile}
                size="3x"
                className="text-gray-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 mx-2">
                <p className="text-sm truncate">{file.name}</p>
                <p className="text-xs">{file.size} bytes</p>
              </div>
              <button
                onClick={() => fileRemove(file)}
                className="flex-shrink-0 p-1 rounded-md bg-red-700 text-white"
              >
                <FontAwesomeIcon icon={faTimesCircle} size="1x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DropFile.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  acceptedFileTypes: PropTypes.object,
  showFile: PropTypes.bool,
};

export default DropFile;
