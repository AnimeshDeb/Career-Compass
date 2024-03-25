import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const AddMenteeDialog = ({ isOpen, onClose, onAddMentee, groupId }) => {
  const [searchedSeeker, setSearchedSeeker] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSeekers, setSelectedSeekers] = useState([]);
  // Effect for searching seekers in the database
  useEffect(() => {
    const searchSeekers = async () => {
      if (searchedSeeker.trim() !== "") {
        const seekersRef = collection(db, "Seekers");
        const q = query(
          seekersRef,
          where("displayName", ">=", searchedSeeker.toLowerCase()),
          where("displayName", "<=", searchedSeeker.toLowerCase() + "\uf8ff")
        );

        const snapshot = await getDocs(q);
        const seekers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (seeker) =>
              !selectedSeekers.some((selected) => selected.id === seeker.id)
          );
        setSearchResults(seekers.slice(0, 4));
      } else {
        setSearchResults([]);
      }
    };

    searchSeekers();
  }, [searchedSeeker, selectedSeekers]);

  // Adds the clicked seeker to the selected list
  const handleSeekerClick = (seeker) => {
    setSelectedSeekers([...selectedSeekers, seeker]);
    setSearchedSeeker("");
  };

  // Removes a seeker from the selected list
  const handleRemoveSeeker = (seekerId) => {
    setSelectedSeekers(
      selectedSeekers.filter((seeker) => seeker.id !== seekerId)
    );
  };

  // Handles the 'Add to Group' action
  const handleAddToGroup = () => {
    onAddMentee(selectedSeekers, groupId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`fixed inset-0 flex items-center justify-center ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        <div className="bg-white rounded-lg p-6 z-10 w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Add Mentee</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search seekers"
              value={searchedSeeker}
              onChange={(e) => setSearchedSeeker(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-b-lg">
                {searchResults.map((seeker) => (
                  <div
                    key={seeker.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSeekerClick(seeker)}
                  >
                    {seeker.displayName}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap mb-4">
            {selectedSeekers.map((seeker) => (
              <div
                key={seeker.id}
                className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center"
              >
                <span className="mr-2">{seeker.displayName}</span>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => handleRemoveSeeker(seeker.id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              className="bg-secondary text-white px-4 py-2 rounded mr-4"
              onClick={handleAddToGroup}
            >
              Add to Group
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddMenteeDialog;
