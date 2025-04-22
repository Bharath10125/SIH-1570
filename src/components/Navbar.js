import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/CGWB.png'; // Adjust the path to match your project structure

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      color: 'black',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Left Side: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src={logo} 
          alt="CGWB Logo" 
          style={{ width: '50px', height: '50px', marginRight: '1rem' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#94ecf8' }}>
          Central Ground Water Board
        </div>
      </div>

      {/* Right Side: Buttons */}
      <div>
        <Link to="/" style={{
          margin: '0 0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007BFF',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}>
          About
        </Link>
        <Link to="/create-user" style={{
          margin: '0 0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007BFF',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}>
          Create User
        </Link>
        <Link to="/view-user" style={{
          margin: '0 0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007BFF',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}>
          View User
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
