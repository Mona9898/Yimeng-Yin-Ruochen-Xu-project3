import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateStatusUpdate() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      // retrieve username from localStorage
      const user = localStorage.getItem('username');
      await axios.post('http://localhost:8000/api/statusUpdate', {
        content,
        // add username to the request body
        username: user
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      navigate('/user-status-update'); // Redirect to user page
    } catch (error) {
      setError('Failed to create status update.');
    }
  };

  return (
    <div>
      <h1>Create Status Update</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          What's on your mind?
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreateStatusUpdate;
