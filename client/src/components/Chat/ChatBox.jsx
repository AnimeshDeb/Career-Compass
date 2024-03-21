import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCommentDots, faPaperPlane, faMicrophone, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './ChatBox.css';
import axios from 'axios';

const ChatBox = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [threadId, setThreadId] = useState(null);

    useEffect(() => {
        createThread();
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === 'outgoing') {
                addMessageToThread(lastMessage.text);
            }
        }
    }, [messages]);

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const handleInput = (e) => setInputMessage(e.target.value);

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        setMessages(msgs => [...msgs, { type: 'outgoing', text: inputMessage }]);
        setInputMessage('');
    };

    const createThread = async () => {
        try {
            const response = await axios.post('https://api.openai.com/v1/threads', null, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v1',
                },
            });
            setThreadId(response.data.id);
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const addMessageToThread = async (message) => {
        try {
            await axios.post(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                role: 'user',
                content: message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v1',
                },
            });
            createRun();
        } catch (error) {
            console.error('Error adding message to thread:', error);
        }
    };

    const createRun = async () => {
        try {
            let run = await axios.post(`https://api.openai.com/v1/threads/${threadId}/runs`, {
                assistant_id: `${import.meta.env.VITE_REACT_APP_ASSISTANT_ID}`,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v1',
                },
            });
            

            while (['queued', 'in_progress', 'cancelling'].includes(run.data.status)) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                run = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${run.data.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v1',
                    },
                });
            }

            if (run.data.status === 'completed') {
                const messages = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v1',
                    },
                });

                

                if (messages.data && messages.data.items) {
                    const assistantMessages = messages.data.items
                        .filter(message => message.role === 'assistant')
                        .reverse();
                    
                    setMessages(msgs => [
                        ...msgs,
                        ...assistantMessages.map(message => ({
                            type: 'incoming',
                            text: message.content.parts[0], // Assuming the response is in the 'parts' array
                        })),
                    ]);
                } else {
                    console.error('Unexpected message format:', messages.data);
                }
            } else {
                console.log('Run status:', run.data.status);
            }
        } catch (error) {
            console.error('Error creating run:', error);
        }
    };

    const checkRunStatus = async (threadId, runId) => {
        try {
            const response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error checking run status:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    };

    const waitForRunCompletion = async (threadId, runId) => {
        let runStatus = await checkRunStatus(threadId, runId);
        while (runStatus && runStatus.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
            runStatus = await checkRunStatus(threadId, runId);
        }
        return runStatus;
    };

    const getLastThreadMessage = async (threadId) => {
        try {
            const response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            const messages = response.data.items;
            return messages[messages.length - 1];
        } catch (error) {
            console.error('Error fetching last thread message:', error);
        }
    };

    const handleMicrophoneClick = () => {
        setTimeout(() => {
            setInputMessage("How do I navigate to the jobs page?");
        }, 1000);
    };


    return (
        <div>
            <button className="chatbot-toggler" onClick={toggleChat}>
                <FontAwesomeIcon icon={isChatOpen ? faClose : faCommentDots} />
            </button>
            <div className={`chatbot ${isChatOpen ? '' : 'chatbot-hidden'}`}>
                <header className="chat-header">
                    <h2>Chat</h2>
                    <FontAwesomeIcon icon={faClose} className="close-btn" onClick={toggleChat} />
                </header>
                <ul className="chatbox">
                    {messages.map((msg, index) => (
                        <li key={index} className={`chat ${msg.type}`}>
                            <p>{msg.text} {msg.type === 'incoming' && <FontAwesomeIcon icon={faVolumeUp} className="volume-icon" />}</p>
                        </li>
                    ))}
                </ul>
                <div className="chat-input">
                    <FontAwesomeIcon icon={faMicrophone} className="microphone-btn" onClick={handleMicrophoneClick} />
                    <textarea
                        placeholder="Enter a message..."
                        spellCheck="false"
                        required
                        value={inputMessage}
                        onChange={handleInput}
                    ></textarea>
                    <FontAwesomeIcon icon={faPaperPlane} className="send-btn" onClick={sendMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatBox;