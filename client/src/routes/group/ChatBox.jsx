import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCommentDots, faPaperPlane, faMicrophone, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBox = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === 'outgoing') {
                fetchResponse(lastMessage.text);
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

    const fetchResponse = async (message) => {
        try {
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: message,
                max_tokens: 100,
                n: 1,
                stop: null,
                temperature: 0.7,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
            });

            const generatedText = response.data.choices[0].text.trim();
            setMessages(msgs => [...msgs, { type: 'incoming', text: generatedText }]);
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
        }
    };

    const handleMicrophoneClick = () => {
        setTimeout(() => {
            setInputMessage("How do I navigate to the jobs page");
        }, 4000);
    };

    const chatbotVariants = {
        open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
        closed: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <div>
            <motion.button
                className="chatbot-toggler"
                onClick={toggleChat}
                initial={{ scale: 0 }}
                animate={{ rotate: isChatOpen ? 180 : 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <FontAwesomeIcon icon={isChatOpen ? faClose : faCommentDots} />
            </motion.button>
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        className={`chatbot ${isChatOpen ? '' : 'chatbot-hidden'}`}
                        variants={chatbotVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <header className="chat-header">
                            <h2>Chat</h2>
                            <FontAwesomeIcon icon={faClose} className="close-btn" onClick={toggleChat} />
                        </header>
                        <ul className="chatbox">
                            {messages.map((msg, index) => (
                                <motion.li
                                    key={index}
                                    className={`chat ${msg.type}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <p>{msg.text} {msg.type === 'incoming' && <FontAwesomeIcon icon={faVolumeUp} className="volume-icon" />}</p>
                                </motion.li>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBox;