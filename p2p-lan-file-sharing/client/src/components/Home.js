import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="card p-3">
      <h2 className="card-title">Welcome to P2P LAN File Sharing System</h2>
      <div className="list-group">
        <Link to="/upload" className="list-group-item list-group-item-action">
          Upload File
        </Link>
        <Link to="/search" className="list-group-item list-group-item-action">
          Search Files
        </Link>
      </div>
    </div>
  );
};

export default Home;
