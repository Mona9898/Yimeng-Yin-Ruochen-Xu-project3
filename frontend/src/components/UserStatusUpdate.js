import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserStatusUpdates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.get('http://localhost:8000/api/statusUpdate', {
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

  return (
    <div>
      <h1>Your Status Updates</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {updates.map((update) => (
        <div key={update._id}>
          <p>{update.content}</p>
          <button onClick={() => handleDelete(update._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default UserStatusUpdates;
