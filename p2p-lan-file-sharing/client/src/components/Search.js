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

  const handleDownload = async (fileId, originalFilename) => {
    try {
      const res = await axios.get(`/api/files/download/${fileId}`, {
        responseType: 'blob', // Important
      });

      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFilename); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading file:', err.response.data);
    }
  };

  return (
    <div className="card p-3">
      <h2 className="card-title">Search Files</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label>Search</label>
          <input
            type="text"
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <div className="mt-4">
        <h2>Search Results</h2>
        <ul className="list-group">
          {results.map((file) => (
            <li key={file._id} className="list-group-item">
              <p>Filename: {file.originalFilename}</p>
              <p>Description: {file.description}</p>
              <p>Uploaded by: {file.uploadedBy.username}</p>
              <button
                className="btn btn-secondary"
                onClick={() => handleDownload(file._id, file.originalFilename)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
