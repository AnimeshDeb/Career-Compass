import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';
import Audio_Btn from '../../../../components/Buttons/audio__btn/audio_btn';
import Lottie from 'lottie-react';
import animationAI from '../../../../images/animatedAI.json';
import animationLoading from '../../../../images/Loading.json';
import DropFile from '../../../../components/DropFile/DropFileAuth';
import DOMPurify from 'dompurify';
import EditorTxt from '../../../../components/texteditor/Editor';

const acceptedIntroVideoTypes = {
  'video/mp4': [],
  'video/webm': [],
  'video/ogg': [],
};

function SeekerIntro({ handleNextStep, uid }) {
  const [seekerTxtIntro, setSeekerTxtIntro] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [activeArea, setActiveArea] = useState(null);
  const usersCollection = collection(db, 'Seekers');
  const docRef = doc(usersCollection, uid);

  const introAudio =
    'https://firebasestorage.googleapis.com/v0/b/career-compass-77175.appspot.com/o/static%2Faudio%2F2024-03-15%2002-43-20.mp3?alt=media&token=5ae4dced-3bd7-4933-a09a-2ade24daf577';

  async function uploadVideo(file) {
    setIsUploading(true);
    setActiveArea('video');
    if (!file) {
      console.error('No file selected for upload.');
      setIsUploading(false);
      return;
    }

    const fileRef = ref(storage, `Users/Seekers/${uid}/${file.name + v4()}`);
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Video uploaded successfully: ', downloadURL);
      await setDoc(docRef, { introduction: downloadURL }, { merge: true });
      console.log('Firestore updated with video URL.');
      setIsUploading(false);
      setUploadComplete(true);
    } catch (error) {
      console.error('Error handling video upload: ', error);
      setIsUploading(false);
    }
  }

  const handleEditorChange = (e) => {
    const cleanHtml = DOMPurify.sanitize(e.htmlValue);
    setSeekerTxtIntro(cleanHtml);
    if (activeArea !== 'text') setActiveArea('text');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seekerTxtIntro.trim()) {
      try {
        await setDoc(
          docRef,
          { introduction: seekerTxtIntro.trim()},
          
          { merge: true }
        );
        console.log('Text introduction saved successfully.');
      } catch (error) {
        console.error('Error saving text introduction: ', error);
      }
    }
    handleNextStep();
  };

  return (
    <>
      <div className="bg-primary mb-0 text-white flex items-center pl-10">
        <h1 className="mb-0 text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Introductions
        </h1>
      </div>
      <div className="maybolin-talk flex flex-col md:flex-row items-center justify-center m-4 mx-auto max-w-4xl">
        <div className="flex-1 flex-shrink-0 max-w-60 w-1/2 mr-0 ml-5 sm:p-0 sm:m-0">
          <Lottie
            animationData={animationAI}
            className="w-48 md:w-60 lg:w-full max-w-sm sm:p-0 sm:m-0"
          />
        </div>
        <div className="flex-1 bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mx-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            Tell me about yourself:
            <br />
            <span className="text-primary font-semibold">
              Record a video{' '}
            </span>{' '}
            or
            <span className="text-secondary font-semibold"> write </span> about
            yourself in the box below.
            <br />
            {/* You can also{" "}
            <span className="text-secondary font-semibold"> talk</span>, and
            we'll help turn it into writing. */}
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
          <div className="flex z-0 justify-end mt-0">
            <Audio_Btn audioSrc={introAudio} />
          </div>
        </div>
      </div>

      <div className="mt-0 mb-0 max-w-7xl mx-auto pl-4 pr-4 space-y-6 bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 h-auto md:min-h-120 lg:min-h-150">
            <div
              className={`w-full md:w-1/2 flex flex-col justify-between py-10 px-4 rounded-md ${
                activeArea === 'text' ? 'bg-primary' : 'hover:bg-primary'
              } h-auto md:min-h-120 lg:min-h-150`}
              onClick={() => setActiveArea('text')}
            >
              <EditorTxt
                seekerTxtIntro={seekerTxtIntro}
                handleEditorChange={handleEditorChange}
              />
            </div>

            <div className="flex justify-center p-2 h-full items-center md:flex-col md:justify-center md:items-center space-x-2 md:space-x-0 ">
              <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
              <span className="text-md font-semibold opacity-70">OR</span>
              <div className="w-0.5 h-4 bg-gray-400 md:w-4 md:h-0.5"></div>
            </div>

            <div
              className={`w-full md:w-1/2 py-10 px-4 rounded-md ${
                activeArea === 'video' ? 'bg-secondary' : 'hover:bg-secondary'
              } h-auto md:min-h-120 lg:min-h-150`}
              onClick={() => setActiveArea('video')}
            >
              <DropFile
                onFileChange={(file) => {
                  uploadVideo(file).catch(console.error);
                }}
                maxFiles={1}
                acceptedFileTypes={acceptedIntroVideoTypes}
                showFile={true}
              />
            </div>
          </div>

          <div className="flex justify-between pt-2 pb-2">
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flex justify-center items-center ${
                isUploading
                  ? 'text-white bg-primary'
                  : uploadComplete || seekerTxtIntro.trim()
                  ? 'text-white bg-secondary hover:bg-green-800'
                  : 'text-white bg-gray-400'
              }`}
              type="button"
            >
              {isUploading ? (
                <Lottie
                  animationData={animationLoading}
                  style={{ width: 50, height: 50 }}
                  loop={true}
                />
              ) : (
                <>{uploadComplete || seekerTxtIntro.trim() ? 'Next' : 'Skip'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

SeekerIntro.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
};

export default SeekerIntro;
