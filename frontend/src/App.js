import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import FileShare from './components/FileShare';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className='App'>
        <header>
          <h1>P2P LAN File Sharing</h1>
        </header>
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><FileShare /></PrivateRoute>} />
            <Route path="*" element={<h2>404 - Page not found</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
