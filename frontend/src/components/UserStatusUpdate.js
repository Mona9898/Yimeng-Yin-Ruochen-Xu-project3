import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserStatusUpdates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');
  


  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        //get username from local storage
        const username = localStorage.getItem('username');
        //call api to get updates for the specific user
        const response = await axios.get(`http://localhost:8000/api/statusUpdate/${username}`, {
        // const response = await axios.get('http://localhost:8000/api/statusUpdate', {
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
  const formattedDate = new Date(registeredAt).toLocaleDateString("en-US"); // Format date as needed

  return (
    <div>
      <h1>Username: {localStorage.getItem('username')}</h1>
      <h3>Joined: {formattedDate}</h3>
      <h3>Your Status Updates</h3>
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
