import { useState } from 'react';
import { Editor } from 'primereact/editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';


const EditorTxt = ({ seekerTxtIntro, handleEditorChange }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const newRecognition = new SpeechRecognition();
            newRecognition.lang = 'en-US';
            newRecognition.interimResults = true;
            newRecognition.start();

            newRecognition.onresult = (event) => {
                const speechToText = event.results[0][0].transcript;
                handleEditorChange({ htmlValue: seekerTxtIntro + ' ' + speechToText }); // Concatenate the transcribed text
            };

            newRecognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            newRecognition.onend = () => {
                setIsListening(false);
            };

            setRecognition(newRecognition);
            setIsListening(true);
        } else {
            if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support speech recognition. Please consider using Google Chrome for this feature.');
}
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setRecognition(null);
            setIsListening(false);
        }
    };
    const header = (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-list" value="bullet" aria-label="Bullet list"></button>
            <button onClick={toggleListening} aria-label="Speech to Text" className={`ql-speech ${isListening ? 'ql-speech-active' : ''}`}>
                <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />
            </button>
        </span>
    );

    return (
        <div className="bg-white rounded-md">
            <Editor
                value={seekerTxtIntro}
                onTextChange={handleEditorChange}
                headerTemplate={header}
                style={{ height: '90px' }}
            />
        </div>
    );
};

export default EditorTxt;
