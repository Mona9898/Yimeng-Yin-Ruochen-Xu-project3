import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [error, setError] = useState(''); // Define a state for error
  const navigate = useNavigate();
  const user = localStorage.getItem('username'); // Logged-in username

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/statusUpdate');
        setStatusUpdates(response.data);
      } catch (error) {
        console.error('Error fetching status updates:', error);
        setError('Error fetching status updates.');
      }
    };

    fetchStatusUpdates();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  const handleDelete = async (updateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/statusUpdate/${updateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusUpdates(currentUpdates => currentUpdates.filter(update => update._id !== updateId));
    } catch (error) {
      console.error('Error deleting update:', error);
      setError('Error deleting update.');
    }
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {statusUpdates.length > 0 ? (
          statusUpdates.map((update) => (
            <div key={update._id} className="status-update" onClick={() => navigate(`/user/${update.username}`)}>
              <h2>Username: {update.username}</h2>
              <p>Contents: {update.content}</p>
              <p>Created Time: {formatDate(update.timestamp)}</p>
              {user === update.username && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(update._id);
                }}>Delete</button>
              )}
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
