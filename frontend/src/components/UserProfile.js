import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [error, setError] = useState('');
  const { username } = useParams(); // Get the username from the URL parameter

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

  return (
    <div className="user-profile-container">
      <h1>User Profile: {username}</h1>
      {error && <p className="error-message">{error}</p>}
      <div>
        <h2>Status Updates</h2>
        {statusUpdates.length > 0 ? (
          statusUpdates.map((update) => (
            <div key={update._id} className="status-update">
              <p>{update.content}</p>
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
