import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/version1/navbar';
import NavbarWhite from '../../components/navbar/version2/navbar';
// import Navbar from "../../components/navbar/Version3";
const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();

  const usersCollection = collection(db, 'Seekers');
  const mentorCollection = collection(db, 'Mentors');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChangeSearch = async (e) => {
    const { value } = e.target;
    setSearchName(value);

    const seekerQuerySnapshot = await getDocs(
      query(usersCollection, where('displayName', '==', value))
    );

    const mentorQuerySnapshot = await getDocs(
      query(mentorCollection, where('displayName', '==', value))
    );

    const seekerData = seekerQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      type: 'Seeker',
    }));

    const mentorData = mentorQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      type: 'Mentor',
    }));

    const combinedData = [...seekerData, ...mentorData];

    setFilteredUsers(combinedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  const handleNext = (userUid, userType) => {
    navigate('/public', { state: { userId: userUid , userType: userType} });
  };

  return (
    <div>
      <div>
      <Navbar />
      </div>
      <div className="flex flex-col justify-center items-center h-screen">
        
        <div className="flex flex-col items-center">
          <h1
            className="text-3xl font-bold mb-8 text-primary transition-colors duration-500 ease-in-out"
            style={{
              color: isExpanded ? '#34D399' : '#3B82F6',
              marginLeft: '30px',
            }}
          >
            Search for our Users
          </h1>

          <div
            className={`relative flex items-center justify-center border rounded-full px-8 py-6 transition-all duration-300 ${
              isExpanded ? 'w-96 border-green-500' : 'w-80'
            }`}
            onClick={toggleExpand}
            style={{ height: isExpanded ? '150px' : '200px' }}
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
                className="flex-1 p-2 rounded-lg focus:ring-2 focus:ring-green-500"
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
        <div className={`mt-4 ${isSearched ? 'block' : 'hidden'}`}>
          <div className="rounded-lg bg-primary p-4">
            <h2 className="text-white text-xl font-bold mb-2">Search Results:</h2>
            <ul>
              {filteredUsers.map((user, index) => (
                <li
                  key={index}
                  onClick={() => handleNext(user.id, user.type)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg mb-2"
                  style={{
                    backgroundColor:
                      user.type === 'Mentor' ? '#34D399' : '#3B82F6',
                  }}
                >
                  <div className="flex items-center">
                    <img
                      src={user.pictureURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <strong>{user.displayName}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
