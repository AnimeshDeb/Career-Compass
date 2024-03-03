import React, { useState } from "react";
import { performSearch } from "../../../functions/searchFunctions";
import "./searchUser.css"; // Ensure this path is correct

export default function SearchUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const results = await performSearch(searchTerm);
    setSearchResults(results);
  };

  const placeholderPFP = "/placeholderPFP.png";

  return (
    <div className="searchContainer">
      <input
        className="searchInput"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name..."
      />
      <button className="searchButton" onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </button>
      <ul className="userList">
        {searchResults.map((user) => (
          <li key={user.id} className="userItem">
            {user.pictureURL ? (
              <img src={user.pictureURL} alt="User" />
            ) : (
              <img src={placeholderPFP} alt="User" />
            )}
            {user.displayName} ({user.userType})
          </li>
        ))}
      </ul>
    </div>
  );
}
