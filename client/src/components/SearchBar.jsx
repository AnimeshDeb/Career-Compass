import React from 'react';

const SearchBar = ({ query, onQueryChange }) => {
    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <input
                type="text"
                className="w-full placeholder-gray-400 text-gray-900 border border-gray-300 rounded-md py-2 px-4"
                placeholder="Search for a job"
                onChange={onQueryChange}
                value={query}
            />
        </div>
    );
};

export default SearchBar;
