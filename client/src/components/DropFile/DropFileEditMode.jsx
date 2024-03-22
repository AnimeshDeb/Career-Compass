import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const DropFile = ({ onFileChange, maxFiles = 1, acceptedFileTypes }) => {
  const [files, setFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedFiles = acceptedFiles.slice(0, maxFiles).map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));
      setFiles(updatedFiles);

      // Adjust the invocation of onFileChange based on the number of files
      if (updatedFiles.length === 1) {
        // If only one file is uploaded, return a single URL
        onFileChange(updatedFiles[0].preview);
      } else if (updatedFiles.length > 1) {
        // If multiple files are uploaded, return an array of URLs
        const fileURLs = updatedFiles.map(file => file.preview);
        onFileChange(fileURLs);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    },
    [maxFiles, onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: maxFiles > 1, // This ensures that the dropzone allows multiple files if maxFiles is greater than 1
  });

  return (
    <div className="flex flex-col space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col justify-center items-center border-dashed border-2 p-5 cursor-pointer rounded-lg ${
          isDragActive
            ? "bg-gray-100 border-primary"
            : "bg-white border-gray-300"
        } hover:border-primary ${
          files.length >= maxFiles ? "border-secondary" : ""
        }`}
      >
        <input {...getInputProps()} />
        <FontAwesomeIcon
          icon={uploadSuccess ? faCheckCircle : faCloudUploadAlt}
          size="3x"
          className={`${
            uploadSuccess ? "text-secondary" : "text-primary"
          } mb-3`}
        />
        <p>Drag & Drop your files here, or click to select files</p>
      </div>
    </div>
  );
};

export default DropFile;
