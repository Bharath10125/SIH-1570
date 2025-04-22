import React from 'react';
import logo from '../assets/logo.png'; // Adjust the path if the logo is in a different folder

const About = () => {
  const pageStyle = {
    background: 'linear-gradient(to bottom, #94ecf8, white)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    margin: 0,
    padding: 0,
  };

  const textStyle = {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '20px',
    maxWidth: '600px',
  };

  return (
    <div style={pageStyle}>
      <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
      <h1>Welcome to the About Page</h1>
      <div style={textStyle}>
        <p>We developed a system to measure water levels in artesian wells, providing real-time data for monitoring aquifer health. This project helps in assessing the sustainability and efficiency of water resources in aquifer systems.</p>
      </div>
    </div>
  );
};

export default About;
