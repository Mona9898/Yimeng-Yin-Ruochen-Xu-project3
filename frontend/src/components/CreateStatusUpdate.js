import React, { useState, useEffect } from 'react';
import './CreateStatusUpdate.css'; 
import axios from 'axios';

function CreateStatusUpdate() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    setIsLoggedIn(!!username); // Set to true if the user logged in, otherwise false
  }, [username]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:8000/api/statusUpdate', { content, username });
      setContent('');
      // redirect to status updates page
      window.location.href = "/user-status-update";
    } catch (error) {
      console.error('Error creating status update:', error);
      setError('Failed to create status update. Please try again.');
    }
  };

  return (
    <div className="create-status-update-container">
      <h1>Create Status Update</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          What's on your mind?
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="submit" disabled={!isLoggedIn}>Post</button>
      </form>
      {!isLoggedIn && <p className="login-message">Please log in to post a status update.</p>}
    </div>
  );
}

export default CreateStatusUpdate;


