import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const navigate = useNavigate();

  const navigateToUserPage = (username) => {
    navigate(`/user/${username}`);
  }

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/statusUpdate');
        setStatusUpdates(response.data);
      } catch (error) {
        console.error('Error fetching status updates:', error);
      }
    };

    fetchStatusUpdates();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <div className="home-container">
      <h1>Home</h1>
      <div>
        {statusUpdates.length > 0 ? (
          statusUpdates.map((update) => (
            <div key={update._id} className="status-update" onClick={() => navigateToUserPage(update.username)}>
              <h2>Username: {update.username}</h2>
              <p>Contents: {update.content}</p>
              <p>Created Time: {formatDate(update.timestamp)}</p>
            </div>
          ))
        ) : (
          <p className="no-updates">No status updates available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
