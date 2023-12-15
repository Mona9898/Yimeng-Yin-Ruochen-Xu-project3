import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserStatusUpdates.css';

function UserStatusUpdates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:8000/api/statusUpdate/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpdates(response.data);
      } catch (error) {
        setError('Error fetching updates.');
      }
    };

    fetchUpdates();
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

  const registeredAt = localStorage.getItem('registeredAt');
  const formattedDate = new Date(registeredAt).toLocaleDateString("en-US");

  return (
    <div className="user-updates-container">
      <h1>Username: {localStorage.getItem('username')}</h1>
      <h3>Joined: {formattedDate}</h3>
      <h3>Your Status Updates</h3>
      {error && <p className="error-message">{error}</p>}
      {updates.map((update) => (
        <div key={update._id} className="user-update">
          <p>{update.content}</p>
          <button onClick={() => handleDelete(update._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default UserStatusUpdates;
