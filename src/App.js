import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar'; // Assuming Navbar is in the components folder
import AboutPage from './pages/About';
import CreateUserPage from './pages/CreateUser';
import ViewUsersPage from './pages/ViewUser';
import UserDetailsPage from './pages/userdetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AboutPage />} /> {/* About Page */}
        <Route path="/create-user" element={<CreateUserPage />} /> {/* Create User Page */}
        <Route path="/view-user" element={<ViewUsersPage />} /> {/* View Users Page */}
        <Route path="/user/:userGsm" element={<UserDetailsPage />} /> {/* User Details Page */}
      </Routes>
    </Router>
  );
}

export default App;

