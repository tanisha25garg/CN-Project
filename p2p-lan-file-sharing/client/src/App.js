import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import FileUpload from './components/FileUpload';
import Search from './components/Search';

const App = () => {
  return (
    <div>
      <h1>P2P LAN File Sharing System</h1>
      <Register />
      <Login />
      <FileUpload />
      <Search />
    </div>
  );
};

export default App;
