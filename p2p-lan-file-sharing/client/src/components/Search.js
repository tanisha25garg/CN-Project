// Search.js
import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const res = await axios.get(`/api/files/search?query=${query}`);
      setResults(res.data);
      setMessage(res.data.length ? '' : 'No files found.');
    } catch (err) {
      setMessage('Error searching files.');
      console.error(err);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await axios.get(`/api/files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading file:', err);
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
      {message && <p className="mt-3">{message}</p>}
      {results.length > 0 && (
        <ul className="list-group mt-4">
          {results.map((file) => (
            <li key={file._id} className="list-group-item">
              <p><strong>Filename:</strong> {file.originalFilename}</p>
              <p><strong>Description:</strong> {file.description}</p>
              <button
                className="btn btn-secondary mt-2"
                onClick={() => handleDownload(file._id, file.originalFilename)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
