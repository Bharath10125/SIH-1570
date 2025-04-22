import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Link } from 'react-router-dom'; // Import Link for routing
import mapIcon from '../assets/marker.png';
  const ViewUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
        setLoading(false);
        console.log('Fetched users:', response.data);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: mapIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Filter valid users based on coordinates
  const validUsers = users.filter(user => {
    if (user.userLocation?.coordinates?.length === 2) {
      const [lat, lng] = user.userLocation.coordinates;  // Reverse the order to lat, lng
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }
    return false;
  });

  // Use New Delhi (India) as default location if no valid users are found
  const mapCenter = validUsers.length > 0
    ? [
        validUsers.reduce((sum, user) => sum + user.userLocation.coordinates[1], 0) / validUsers.length,  // latitude
        validUsers.reduce((sum, user) => sum + user.userLocation.coordinates[0], 0) / validUsers.length,  // longitude
      ]
    : [77.2090, 28.6139]; // Default to New Delhi (India) if no valid users

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100vh' }}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div style={{ padding: '20px' }}>
            <h3>User Details</h3>
            {validUsers.map((user, index) => {
              const lat = user.userLocation?.coordinates[0];  // latitude
              const lng = user.userLocation?.coordinates[1];  // longitude

              return (
                <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <strong>{user.userName}</strong><br />
                  Phone: {user.userPhone}<br />
                  GSM: {user.userGsm}<br />
                  Address: {user.userAddress}<br />
                  Latitude: {lat}<br />
                  Longitude: {lng}<br />
                  <Link to={`/user/${user.userGsm}`}>View Details</Link>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ width: '100%', height: '300px' }}>
              <MapContainer center={mapCenter} zoom={5} style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {validUsers.map((user, index) => {
                  const lat = user.userLocation?.coordinates[0];  // latitude
                  const lng = user.userLocation?.coordinates[1];  // longitude
                  return (
                    <Marker key={index} position={[lat, lng]} icon={customIcon}>
                      <Popup>
                        <strong>{user.userName}</strong><br />
                        Phone: {user.userPhone}<br />
                        GSM: {user.userGsm}<br />
                        Address: {user.userAddress}<br />
                        <Link to={`/user/${user.userGsm}`}>View Details</Link>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewUsersPage;
