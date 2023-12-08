import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserStatusUpdate from './components/UserStatusUpdate';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-status-update" element={<UserStatusUpdate />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
