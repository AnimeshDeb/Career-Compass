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

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;
        setMessages(msgs => [...msgs, { type: 'outgoing', text: inputMessage }]);
        setInputMessage('');
    
        try {
            const response = await axios.post('/api/chat', { message: inputMessage });
            setMessages(msgs => [...msgs, { type: 'incoming', text: response.data.text }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
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

    // add logic for microphone button here
    // const handleMicrophoneClick = () => {
    //     setTimeout(() => {
    //         setInputMessage("How do I navigate to the jobs page?");
    //     }, 1000);
    // };


    return (
<div>
    <button 
        className="z-1000 fixed bottom-8 right-9 outline-none border-none h-12 w-12 flex cursor-pointer items-center justify-center rounded-full bg-primary-light text-white transition-transform duration-200"
        onClick={toggleChat}>
        <FontAwesomeIcon icon={isChatOpen ? faClose : faCommentDots} />
    </button>
    <div className={`fixed right-9 bottom-[5.625rem] w-[26.25rem] bg-white rounded-2xl overflow-hidden transform transition-all duration-100 ${isChatOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'} shadow-xl`}>
        <header className="p-4 relative text-center text-white bg-primary shadow">
            <h2 className="text-lg">Chat</h2>
            <FontAwesomeIcon icon={faClose} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleChat} />
        </header>
        <ul className="overflow-y-auto h-[31.875rem] p-8 pb-20">
            {messages.map((msg, index) => (
                <li key={index} className={`flex list-none ${msg.type === 'outgoing' ? 'justify-end' : ''} my-5`}>
                    <p className={`whitespace-pre-wrap px-4 py-3 rounded-lg max-w-[75%] text-sm ${msg.type === 'incoming' ? 'text-black bg-gray-200 rounded-l-none' : 'text-white bg-blue-500 rounded-r-none'}`}>
                        {msg.text} {msg.type === 'incoming' && <FontAwesomeIcon icon={faVolumeUp} className="ml-2 text-green-500 cursor-pointer text-xl" />} {/* Adjusted icon size to text-xl */}
                    </p>
                </li>
            ))}
        </ul>
        <div className="flex gap-1 absolute bottom-0 w-full bg-white p-1 px-5 border-t border-gray-200">
            {/* <FontAwesomeIcon icon={faMicrophone} className="self-end text-primary cursor-pointer flex items-center text-3xl" onClick={handleMicrophoneClick} /> */}
            <textarea
                className="h-14 w-full border-none outline-none resize-none max-h-[11.25rem] p-4 text-sm rounded-full bg-gray-100"
                placeholder="Enter a message..."
                spellCheck="false"
                required
                value={inputMessage}
                onChange={handleInput}
            ></textarea>
            <FontAwesomeIcon icon={faPaperPlane} className="self-end text-primary cursor-pointer flex items-center text-2xl" onClick={sendMessage} /> {/* Adjusted icon size to text-2xl */}
        </div>
    </div>
</div>
    );
};

export default ChatBox;