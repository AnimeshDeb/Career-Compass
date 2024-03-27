import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import anime from "animejs"
const ChatBox = ({
  userId,
  group,
  userType,
  selectedMentee,
  onMenteeClick,
  isOpen,
  setIsOpen,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatWindowRef = useRef(null);
  const chatId = userId && selectedMentee ? 
               (userType === "seeker" ? `${selectedMentee.id}_${userId}` : `${userId}_${selectedMentee.id}`) 
               : null;
  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(doc(db, "Chats", chatId), (doc) => {
      setMessages(doc.data()?.messages || []);
    });
    return unsubscribe;
  }, [chatId]);

  
useEffect(() => {
    const animeConfig = {
      targets: chatWindowRef.current,
      translateY: isOpen ? '0%' : 'calc(100% - 40px)', // Adjust so only the top part is visible
      easing: 'easeInOutQuad',
      duration: 700,
    };

    // Execute the anime.js animation with the configuration
    anime(animeConfig);
  }, [isOpen]);  // Add a new message to the chat
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    // Check if the chat document exists; if not, create it
    const chatDocRef = doc(db, "Chats", chatId);
    const chatDocSnap = await getDoc(chatDocRef);

    if (!chatDocSnap.exists()) {
      console.log("Creating new chat document with ID:", chatId);
      await setDoc(chatDocRef, {
        messages: arrayUnion({
          text: newMessage,
          time: new Date(),
          user: userId,
        }),
      });
    } else {
      // Update the existing chat document with the new message
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          text: newMessage,
          time: new Date(),
          user: userId,
        }),
      });
    }

    // Update the mentor's chat list to include this chatId if not already included
    const mentorRef = doc(
      db,
      "Mentors",
      userId
    );
    const mentorSnap = await getDoc(mentorRef);

    if (mentorSnap.exists()) {
      const currentChats = mentorSnap.data().chats || [];
      if (!currentChats.includes(chatId)) {
        await updateDoc(mentorRef, {
          chats: arrayUnion(chatId),
        });
      }
    } else {
      await setDoc(mentorRef, { chats: [chatId] });
    }

    setNewMessage("");
  };


  return (
    <div className="fixed bottom-4 right-4" style={{ width: '320px' }}>
      <div ref={chatWindowRef} className="bg-white rounded-lg shadow-lg p-0 transition-all duration-700 ease-in-out">
        <div className="flex bg-primary justify-between rounded-tr-lg rounded-tl-lg items-center p-2">
          <h2 className="text-xl text-white font-semibold">
            {isOpen ? selectedMentee ? selectedMentee.name : "Chat" : "Chat"}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
        {isOpen && (
          <>
            <div className="overflow-y-auto h-64 p-2">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.user === userId ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.user === userId ? "bg-primary-light text-white" : "bg-gray-200 text-gray-800"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-4 py-2 rounded-r"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  userId: PropTypes.string.isRequired,
  group: PropTypes.shape({
    mentees: PropTypes.object,
  }),
  userType: PropTypes.string.isRequired,
  selectedMentee: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onMenteeClick: PropTypes.func.isRequired,
};

export default ChatBox;
