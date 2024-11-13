import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/files/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Error searching files:', err.response.data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label>Search</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map((file) => (
          <div key={file._id}>
            <h3>{file.filename}</h3>
            <p>{file.description}</p>
            <p>Uploaded by: {file.uploadedBy.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
