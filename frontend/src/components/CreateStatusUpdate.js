import React, { useState } from 'react';
import axios from 'axios';

function CreateStatusUpdate() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token'); 
      await axios.post('http://localhost:8000/api/statusUpdate', {
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
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
