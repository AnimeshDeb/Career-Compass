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

const ChatGroup = ({
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
  const chatId =
    userId && selectedMentee ? `${userId}_${selectedMentee.id}` : null;

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(doc(db, "Chats", chatId), (doc) => {
      setMessages(doc.data()?.messages || []);
    });
    return unsubscribe;
  }, [chatId]);

  // Add a new message to the chat
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
      userType === "Mentor" ? "Mentors" : "Mentees",
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

  const handleMenteeClick = (mentee) => {
    onMenteeClick(mentee);
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <div
        ref={chatWindowRef}
        className="bg-white rounded-lg shadow-lg p-0 w-80 transition-all duration-700 ease-in-out"
        style={{ transform: `translateY(${isOpen ? "0%" : "85%"})` }}
      >
        <div className="flex bg-primary justify-between rounded-tr-lg rounded-tl-lg items-center mb-4">
          <h2 className="text-xl p-2.5 text-white rounded-lg font-semibold">
            {selectedMentee ? selectedMentee.name : "Chat"}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none pr-2"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        {selectedMentee ? (
          <>
            <div className="overflow-y-auto h-64 mb-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`mb-2 ${
                    message.user === userId ? "text-right" : "text-left"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div
                    className={`inline-block p-2 mr-2 rounded-lg ${
                      message.user === userId
                        ? "bg-primary-light text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
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
                className="bg-primary text-white px-4 py-2 rounded-r whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

ChatGroup.propTypes = {
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

export default ChatGroup;
