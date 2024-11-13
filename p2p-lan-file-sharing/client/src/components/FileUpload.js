import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      console.log('File uploaded successfully:', res.data);
    } catch (err) {
      console.error('Error uploading file:', err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h2 className="card-title">Upload File</h2>
      <div className="form-group">
        <label>File</label>
        <input type="file" className="form-control" onChange={handleFileChange} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Upload</button>
    </form>
  );
};

export default FileUpload;
