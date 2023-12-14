import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [statusUpdates, setStatusUpdates] = useState([]);

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/statusUpdate');
        console.log(response.data);
        console.log("herw");
        setStatusUpdates(response.data);
      } catch (error) {
        console.error('Error fetching status updates:', error);
      }
    };

    fetchStatusUpdates();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div>
        {statusUpdates.length > 0 ? (
          statusUpdates.map((update) => (
            <div key={update._id}>
              <h2>{update.user.username}</h2>
              <p>{update.content}</p>
              <p>{update.timestamp}</p>
            </div>
          ))
        ) : (
          <p>No status updates available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
