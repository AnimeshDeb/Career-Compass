import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimesCircle, faCheckCircle, faFile } from '@fortawesome/free-solid-svg-icons';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const DropFile = ({ onFileChange, maxFiles, acceptedFileTypes }) => {
  const [fileList, setFileList] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedList = [...fileList, ...acceptedFiles].slice(0, maxFiles);
    setFileList(updatedList);
    onFileChange(updatedList[0]);

    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
          });
        }
      );
    }
  }, [fileList, onFileChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: acceptedFileTypes });

  const fileRemove = (file) => {
    const updatedList = fileList.filter((f) => f !== file);
    setFileList(updatedList);
    onFileChange(null);
  };

  return (
    <div className="flex space-x-4">
      <div
        {...getRootProps()}
        className={`flex-1 border-dashed border-2 p-5 text-center cursor-pointer rounded-lg ${
          isDragActive ? "bg-gray-100" : "bg-white"
        } ${fileList.length >= maxFiles ? "border-green-500" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        <FontAwesomeIcon icon={fileList.length >= maxFiles ? faCheckCircle : faCloudUploadAlt} size="3x" className={`${fileList.length >= maxFiles ? "text-green-500" : "text-blue-500"} mb-3`} />
        <p>Drag & Drop your files here</p>
      </div>
      {fileList.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap transition duration-300 ease-in-out">
            {fileList.map((file, index) => (
              <div key={index} className="inline-block p-2 align-middle">
                <div className="relative">
                  <FontAwesomeIcon icon={faFile} size="3x" className="text-gray-500" />
                  <p className="text-sm">{file.name}</p>
                  <p className="text-xs">{file.size} bytes</p>
                  <button
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                    onClick={() => fileRemove(file)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="1x" className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DropFile.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  acceptedFileTypes: PropTypes.object,
};

export default DropFile;