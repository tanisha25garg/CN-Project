import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import FileUpload from './components/FileUpload';

const App = () => {
  return (
    <div>
      <h1>P2P LAN File Sharing System</h1>
      <Register />
      <Login />
      <FileUpload />
    </div>
  );
};

export default App;
