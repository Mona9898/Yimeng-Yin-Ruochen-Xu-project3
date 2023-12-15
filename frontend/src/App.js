import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserStatusUpdate from './components/UserStatusUpdate';
import CreateStatusUpdate from './components/CreateStatusUpdate';
import UserProfile from './components/UserProfile'; // Import the UserProfile component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-status-update" element={<UserStatusUpdate />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-status-update" element={<CreateStatusUpdate />} />
        <Route path="/user/:username" element={<UserProfile />} /> {/* New route for user profiles */}
      </Routes>
    </Router>
  );
}

export default App;
