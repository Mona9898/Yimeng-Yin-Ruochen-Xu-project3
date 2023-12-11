import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserStatusUpdates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [userCreatedTime, setUserCreatedTime] = useState(''); // Added state for user's created time

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    // Retrieve createdAt from localStorage
    const storedCreatedAt = localStorage.getItem('createdAt');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedCreatedAt) {
      setUserCreatedTime(storedCreatedAt);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const fetchUpdates = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/statusUpdate/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUpdates(response.data);
        } catch (error) {
          setError('Error fetching updates.');
        }
      };
  
      fetchUpdates();
    }
  }, []);
    

  const handleDelete = async (updateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/statusUpdate/${updateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(updates.filter(update => update._id !== updateId)); 
    } catch (error) {
      setError('Error deleting update.');
    }
  };

  const handleUpdate = async (updateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/statusUpdate/${updateId}`, {
        content: 'Updated content'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get('http://localhost:8000/api/statusUpdate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(response.data);
    } catch (error) {
      setError('Error updating update.');
    }
  }

  return (
    <div>
      <h1>{username ? `${username}'s Status Updates` : 'Your Status Updates'}</h1>
      {/* Display the formatted created time */}
      <p>Joined: {userCreatedTime ? new Date(userCreatedTime).toLocaleDateString() : 'Loading...'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {updates.map((update) => (
        <div key={update._id}>
          <p>{update.content}</p>
          <button onClick={() => handleDelete(update._id)}>Delete</button>
          <button onClick={() => handleUpdate(update._id)}>Update</button>
        </div>
      ))}
    </div>
  );
}

export default UserStatusUpdates;
