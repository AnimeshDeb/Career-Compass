import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { storage } from '../../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
//removed useref and useauth...
const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const usersCollection = collection(db, 'Seekers');
  const [users, setUsers] = useState([]);

  // const docRef=doc(usersCollection, name);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleChangeSearch = (e) => {
    setSearchName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const querySnapshot = await getDocs(
      query(usersCollection, where('displayName', '==', searchName))
    );
    let dataHolder = [];
    querySnapshot.forEach((doc) => {
      dataHolder.push({ ...doc.data(), id: doc.id });
    });
    // console.log(dataHolder);
    setUsers(dataHolder);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div
          className={`relative flex items-center border rounded-full px-8 py-6 transition-all duration-300 ${
            isExpanded ? 'w-96' : 'w-80'
          }`}
          onClick={toggleExpand}
          style={{ height: isExpanded ? '150px' : '200px' }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full pl-4 pr-4 h-full focus:outline-none text-lg"
          >
            <input
              value={searchName}
              onChange={handleChangeSearch}
              type="text"
              placeholder="Search..."
            />
            <button
              type="submit"
              className="bg-blue-500 rounded-lg text-white px-4 py-2"
            >
              Search
            </button>
          </form>
        </div>
        <div>
        <h2>Search Results: </h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>{user.displayName}</strong>: {user.email}
            </li>
          ))}
        </ul>
      </div>
      </div>
      
    </>
  );
};

export default SearchBar;
