import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimesCircle, faCheckCircle, faFile } from '@fortawesome/free-solid-svg-icons';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './DropFile.css';

const DropFile = ({ onFileChange, maxFiles }) => {
    const [fileList, setFileList] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const updatedList = [...fileList, ...acceptedFiles].slice(0, maxFiles);
        setFileList(updatedList);
        onFileChange(updatedList);



        if (acceptedFiles[0]) {
            const file = acceptedFiles[0];
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.error(error);
                }, 
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('Shit works. URL for file ->', downloadURL);
                        // Here you can call a function to update the state or inform the parent component
                    });
                }
            );
        }
    }, [fileList, onFileChange, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const fileRemove = (file) => {
        const updatedList = fileList.filter((f) => f !== file);
        setFileList(updatedList);
        onFileChange(updatedList);
    };

    return (
        <>
            <div {...getRootProps()} className={`drop-file-input ${isDragActive ? 'dragover' : ''} ${fileList.length >= maxFiles ? 'max-files-reached' : ''}`}>
                <input {...getInputProps()} />
                <div className="drop-file-input__label">
                    {fileList.length >= maxFiles ? <FontAwesomeIcon icon={faCheckCircle} size="3x" className="checkmark-icon" /> : <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />}
                    <p>Drag & Drop your files here</p>
                </div>
            </div>
            {fileList.length > 0 && (
                <div className="drop-file-preview">
                    <p className="drop-file-preview__title">Ready to upload</p>
                    {fileList.map((item, index) => (
                        <div key={index} className="drop-file-preview__item">
                            {/* Display file icon based on type or use a default */}
                            <FontAwesomeIcon icon={faFile} size="2x" />
                            <div className="drop-file-preview__item__info">
                                <p>{item.name}</p>
                                <p>{item.size} bytes</p>
                            </div>
                            <FontAwesomeIcon icon={faTimesCircle} size="2x" className="drop-file-preview__item__del" onClick={() => fileRemove(item)} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

DropFile.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    maxFiles: PropTypes.number,
};



/* debug later


DropFile.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    maxFiles: PropTypes.number,
};
*/ 

export default DropFile;