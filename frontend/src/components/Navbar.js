import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const isLoggedIn = !!username; // Set to true if the user logged in, otherwise false

  const handleLogout = () => {
    // remove username from local storage
    localStorage.removeItem('username');
    navigate('/login'); 
  };

  return (
    <nav>
      <ul>
        {/* show username if logged in */}
        {isLoggedIn && <li>Welcome! {username}</li>}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-status-update">Create Status Update</Link></li>
        
        {!isLoggedIn && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {isLoggedIn && (
          <li><button onClick={handleLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
