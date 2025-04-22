import L from 'leaflet';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // Import axios for API requests

// The path to the custom marker icon
import customMarkerIcon from '../assets/marker.png'; // Ensure the correct path to your image

const UserCreatePage = () => {
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default location to Delhi
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userGsm, setUserGsm] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [marker, setMarker] = useState(null); // Store marker state
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userInfo = {
      userName,
      userPhone,
      userGsm,
      userAddress,
      userLocation,
    };

    try {
      // Send data to the backend
      await axios.post('http://localhost:8080/api/users', userInfo);
      console.log('User created successfully');
      setSuccessMessage('User created successfully!');

      // Send automatic message (e.g., via SMS or email)
      await axios.post('http://localhost:8080/api/send-message', { userPhone, message: 'User created successfully!' });

      // Reset the form fields
      setUserName('');
      setUserPhone('');
      setUserGsm('');
      setUserAddress('');
      setUserLocation([28.6139, 77.2090]);
      setMarker(null);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]);
        setMarker([lat, lng]);
      },
    });
    return marker === null ? null : (
      <Marker position={marker} icon={customIcon}>
        <Popup>Your Location</Popup>
      </Marker>
    );
  }

  const pageContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    height: '100vh',
    backgroundColor: '#fff',
  };

  const leftSideStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  };

  const rightSideStyle = {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formStyle = {
    display: 'block',
    width: '100%',
    maxWidth: '500px',
  };

  const inputContainerStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '16px',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#1abc9c',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#16a085',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={leftSideStyle}>
        <form onSubmit={handleFormSubmit} style={formStyle}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>User Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Phone Number:</label>
            <input
              type="text"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>GSM Number:</label>
            <input
              type="text"
              value={userGsm}
              onChange={(e) => setUserGsm(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Address:</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Latitude:</label>
            <input
              type="text"
              value={userLocation[0]}
              disabled
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Longitude:</label>
            <input
              type="text"
              value={userLocation[1]}
              disabled
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = buttonStyle.backgroundColor)
            }
          >
            Create User
          </button>
          {successMessage && <p>{successMessage}</p>} {/* Display success message */}
        </form>
      </div>

      <div style={rightSideStyle}>
        <div style={{ width: '100%', height: '100%' }}>
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default UserCreatePage;
