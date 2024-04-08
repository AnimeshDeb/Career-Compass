import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCommentDots, faPaperPlane, faMicrophone, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './ChatBox.css';
import axios from 'axios';

const ChatBox = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    // const [threadId, setThreadId] = useState(null);



    const model_config = `
    You are an AI assistant that should be able to provide users with information on how to navigate through the website and offer general career advice. Here are some key points about the website's structure and the assistant's responsibilities:
    
    The website has a landing page where users can either log in or sign up. After logging in, users are directed to their user page.
    The website has a navigation bar at the top with four icons on the right side:
    A magnifying glass icon for searching and finding other users on the platform.
    A suitcase icon that leads users to the job page where they can view and apply for jobs.
    An icon with two users that takes users to the groups page, allowing them to view their groups and chat with mentors/mentees within their groups.
    An exit icon with an arrow on the rightmost side for users to log out of their account.
    The AI assistant should be able to provide general career advice, including tips on job search, resume writing, cover letter preparation, and other related topics.
    For more specific or personalized questions, the assistant should guide users to reach out to mentors who can offer tailored advice and support.
    The assistant should have a friendly and professional tone, encouraging users to explore the website's features and resources.
    Please create a persona for this AI assistant, defining its character traits, knowledge base, and communication style. The assistant should be able to engage in conversational interactions with users, understanding their queries and providing helpful responses based on the website's structure and career guidance topics.
    
    Try to avoid sending messages that are too long. If a question may warrant a long response ask the user if they would like you to clarify some more before doing so.
    
    
    Just to clairfy you are an AI assistant, created to help users navigate a career advice website and offer general guidance. 
    
    Traits:
    - Friendly, approachable, and professional 
    - Knowledgeable about job search, resumes, cover letters, and interviews
    - Encourages users to utilize site features and resources
    - Refers users to mentors for personalized advice
    - Responds concisely, asking for clarification if needed to avoid overly long messages
    
    Website Details: 
    - Landing page to log in or sign up
    - User page after login 
    - Nav bar with search, jobs, groups/chat, and logout
    - Job page to view and apply to postings
    - Groups page to interact with mentors/mentees
    
    Provide helpful information to guide users through the site and offer general career tips. Keep responses focused while maintaining a warm, supportive tone.
    `

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const handleInput = (e) => setInputMessage(e.target.value);
/*
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
*/

const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', content: inputMessage }]);
    setInputMessage('');

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                { role: 'system', content: model_config },
                ...messages.map(msg => ({ role: msg.role, content: msg.content })),
                { role: 'user', content: inputMessage },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
            },
        });

        const assistantReply = response.data.choices[0].message.content;
        setMessages(msgs => [...msgs, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

return (
    <div>
        <button
            className="z-1000 fixed bottom-8 right-9 outline-none border-none h-12 w-12 flex cursor-pointer items-center justify-center rounded-full bg-primary-light text-white transition-transform duration-200"
            onClick={toggleChat}
        >
            <FontAwesomeIcon icon={isChatOpen ? faClose : faCommentDots} />
        </button>
        <div className={`fixed right-9 bottom-[5.625rem] w-[26.25rem] bg-white rounded-2xl overflow-hidden transform transition-all duration-100 ${isChatOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'} shadow-xl`}>
            <header className="p-4 relative text-center text-white bg-primary shadow">
                <h2 className="text-lg">Chat</h2>
                <FontAwesomeIcon icon={faClose} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleChat} />
            </header>
            <ul className="overflow-y-auto h-[31.875rem] p-8 pb-20">
                {messages.map((msg, index) => (
                    <li key={index} className={`flex list-none ${msg.role === 'user' ? 'justify-end' : ''} my-5`}>
                        <p className={`whitespace-pre-wrap px-4 py-3 rounded-lg max-w-[75%] text-sm ${msg.role === 'assistant' ? 'text-black bg-gray-200 rounded-l-none' : 'text-white bg-blue-500 rounded-r-none'}`}>
                            {msg.content}
                        </p>
                    </li>
                ))}
            </ul>
            <div className="flex gap-1 absolute bottom-0 w-full bg-white p-1 px-5 border-t border-gray-200">
                <textarea
                    className="h-14 w-full border-none outline-none resize-none max-h-[11.25rem] p-4 text-sm rounded-full bg-gray-100"
                    placeholder="Enter a message..."
                    spellCheck="false"
                    required
                    value={inputMessage}
                    onChange={handleInput}
                ></textarea>
                <FontAwesomeIcon icon={faPaperPlane} className="self-end text-primary cursor-pointer flex items-center text-2xl" onClick={sendMessage} />
            </div>
        </div>
    </div>
);
};

export default ChatBox;


    // add logic for microphone button here
    // const handleMicrophoneClick = () => {
    //     setTimeout(() => {
    //         setInputMessage("How do I navigate to the jobs page?");
    //     }, 1000);
    // };
