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
    <form onSubmit={handleSubmit}>
      <div>
        <label>File</label>
        <input type="file" onChange={handleFileChange} required />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;
