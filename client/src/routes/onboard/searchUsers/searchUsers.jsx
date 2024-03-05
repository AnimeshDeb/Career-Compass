import React, { useState } from "react";
import { performSearch } from "../../../functions/searchFunctions";
import "./searchUser.css";

export default function SearchUser({isSearchActive,setIsSearchActive}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const results = await performSearch(searchTerm);
    setSearchResults(results);
  };
  const placeholderPFP = "/placeholderPFP.png";

  return (
    <>
      <div className="w-full">
        <form className="flex items-center border-b border-gray-200 py-2" onSubmit={handleSearch}>
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            value={searchTerm}
            onFocus={() => {if(!isSearchActive){setIsSearchActive(true)}}}
            onBlur={() =>  {if(isSearchActive){setIsSearchActive(false)}}}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
          />
          <button className="flex-shrink-0 border-2 border-transparent rounded-full p-2 text-gray-500 hover:text-gray-700 hover:border-gray-300" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <ul className="w-full list-none mt-3">
          {searchResults.map((user) => (
            <li key={user.id} className="py-2 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src={user.pictureURL || placeholderPFP} alt="User" className="h-10 w-10 rounded-full object-cover" />
                <span className="block ml-2 text-sm font-medium text-gray-700">
                  {user.displayName} | {user.userType}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}