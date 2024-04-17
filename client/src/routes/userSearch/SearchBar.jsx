import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/version1/navbar";
import anime from "animejs";
// import Navbar from "../../components/navbar/Version3";
const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const usersCollection = collection(db, "Seekers");
  const mentorCollection = collection(db, "Mentors");
  const placeholderPFP = "/placeholderPFP.png";
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    // Initial animation to center the div
    anime({
      targets: containerRef.current,
      translateY: ["50%", "0%"], // Adjust values based on your layout
      opacity: [0, 1],
      duration: 1000,
      easing: "easeOutExpo",
    });
  }, []);
  const handleChangeSearch = async (e) => {
    const { value } = e.target;
    setSearchName(value);

    const seekerQuerySnapshot = await getDocs(
      query(usersCollection, where("displayName", "==", value))
    );

    const mentorQuerySnapshot = await getDocs(
      query(mentorCollection, where("displayName", "==", value))
    );
    const seekerData = seekerQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      type: "Seeker",
    }));

    const mentorData = mentorQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      type: "Mentor",
    }));

    const combinedData = [...seekerData, ...mentorData];

    setFilteredUsers(combinedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };
  const handleNext = (userUid, userType) => {
    navigate("/public", { state: { userId: userUid, userType: userType } });
  };

  return (
    <>
      <Navbar currentPage={"signup"} />
      <div
        ref={containerRef}
        className="flex flex-col justify-center items-center px-5"
      >
        <div className="flex flex-col items-center w-full mt-5">
          <h1
            className={`text-6xl font-bold mb-8 text-primary ${
              isExpanded ? "text-secondary" : "text-primary"
            } transition-colors duration-500 ease-in-out`}
          >
            Search for our Users
          </h1>

          <div
            className={`relative flex items-center justify-center border rounded-full px-8 py-6 transition-all duration-300 ${
              isExpanded ? "w-full border-secondary" : "w-full border-primary"
            }`}
            onClick={toggleExpand}
          >
            <form
              onSubmit={handleSubmit}
              className="flex w-full space-x-4 focus:outline-none text-lg"
            >
              <input
                value={searchName}
                onChange={handleChangeSearch}
                type="text"
                placeholder="Search..."
                className="flex-1 p-5 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none border border-gray-200 transition-colors duration-300 ease-in-out"
              />
              <button
                type="submit"
                className="bg-primary rounded-lg text-white px-4 py-2"
              >
                Search
              </button>
            </form>
            {isExpanded && searchName && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                <ul>
                  {filteredUsers.map((user, index) => (
                    <li
                      key={index}
                      onClick={() => handleNext(user.id, user.type)}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-t-lg"
                    >
                      {user.displayName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div
          className={`mt-4 w-full md:w-3/4 ${isSearched ? "block" : "hidden"}`}
        >
          <div className="rounded-lg  p-4">
            <h2 className="text-secondary text-2xl font-bold mb-2">
              Search Results:
            </h2>
            <ul>
              {filteredUsers.map((user, index) => (
                <li
                  key={index}
                  onClick={() => handleNext(user.id, user.type)}
                  className={`cursor-pointer  p-2 rounded-lg mb-2 ${
                    user.type === "Mentor"
                      ? "bg-secondary hover:bg-secondary-light"
                      : "bg-primary hover:bg-primary-light"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden border-4 border-primary bg-white flex justify-center items-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-24 xl:h-24">
                      <img
                        src={user.pictureURL || placeholderPFP}
                        className="w-full h-full object-cover"
                        alt="User"
                      />
                    </div>
                    <strong className="text-3xl pl-5 text-white font-semibold">
                      {user.displayName}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
