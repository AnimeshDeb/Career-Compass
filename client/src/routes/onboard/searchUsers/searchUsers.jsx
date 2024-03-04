import React, { useState } from "react";
import { performSearch } from "../../../functions/searchFunctions";
import "./searchUser.css";

export default function SearchUser({
  onSearchFocus,
  onRevertView,
  showBackButton,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const results = await performSearch(searchTerm);
    setSearchResults(results);
  };
  const resetSearch = () => {
    setSearchResults([]);
  };
  const placeholderPFP = "/placeholderPFP.png";

  return (
    <>
      <div className="search-main">
        <form className="searchContainer" onSubmit={handleSearch}>
          <input
            className="searchInput"
            type="text"
            value={searchTerm}
            onFocus={onSearchFocus}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
          />
          <button className="searchButton" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <ul className="userList">
          {searchResults.map((user) => (
            <li key={user.id} className="userItem">
              {user.pictureURL ? (
                <img src={user.pictureURL} alt="User" />
              ) : (
                <img src={placeholderPFP} alt="User" />
              )}
              {user.displayName} | {user.userType}
            </li>
          ))}
        </ul>
      </div>
      {showBackButton && (
        <button
          className="revertButton"
          onClick={() => {
            onRevertView();
            resetSearch();
          }}
        >
          Back
        </button>
      )}
    </>
  );
}
