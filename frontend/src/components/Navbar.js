import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const history = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    history.push('/login'); 
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link> 
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link> 
        </li>
        <li>
          <Link to="/create-status-update">Create Status Update</Link>
        </li>
        {localStorage.getItem('token') && (
          <li>
            <button onClick={handleLogout}>Logout</button> 
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
