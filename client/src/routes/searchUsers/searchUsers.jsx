import { useState } from "react";
import { performSearch } from "../../functions/searchFunctions";

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
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((user) => (
          <li key={user.id}>
            {user.pictureURL ? (
              <img
                src={user.pictureURL}
                alt="User"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            ) : (
              <img
                src={placeholderPFP}
                alt="User"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            )}
            {user.displayName} ({user.userType}) - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
