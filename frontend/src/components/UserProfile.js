import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');
  const { username } = useParams(); // Get the username from the URL parameter
  const registeredAt = localStorage.getItem('registeredAt');
  const formattedDate = new Date(registeredAt).toLocaleDateString("en-US");
  const user = localStorage.getItem('username');

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/statusUpdate/${username}`);
        setStatusUpdates(response.data);
      } catch (err) {
        console.error('Error fetching status updates:', err);
        setError('Failed to fetch status updates.');
      }
    };
    fetchStatusUpdates();
  }, [username]);

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
    <div className="user-profile-container">
      <h1>Username: {username}</h1>
      <h3>Joined: {formattedDate}</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        <h2>Status Updates</h2>
        {statusUpdates.length > 0 ? (
          statusUpdates.map((update) => (
            <div key={update._id} className="status-update">
              <p>{update.content}</p>
              <p>{new Date(update.timestamp).toLocaleDateString("en-US")}</p>
              {user === update.username && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(update._id);
                }}>Delete</button>
              )}
            </div>
          ))
        ) : (
          <p>No status updates available.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
