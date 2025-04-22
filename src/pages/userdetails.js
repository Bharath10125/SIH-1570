import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as XLSX from 'xlsx';
import customMarkerIcon from '../assets/marker.png';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const AutoZoomMap = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation.length === 2) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
};

const UserDetailsPage = () => {
  const { userGsm } = useParams();
  const [user, setUser] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState('all');

  useEffect(() => {
    const fetchUserAndSensorData = async () => {
      try {
        const allUsersResponse = await axios.get('http://localhost:8080/api/users');
        const matchedUser = allUsersResponse.data.find(user => user.userGsm === userGsm);
        if (!matchedUser) {
          throw new Error(`User with GSM ${userGsm} not found`);
        }
        setUser(matchedUser);

        const sensorResponse = await axios.get(`http://localhost:8080/api/sensor-data/${userGsm}`);
        setSensorData(sensorResponse.data);
        setFilteredData(sensorResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching user details or sensor data');
        setLoading(false);
      }
    };

    fetchUserAndSensorData();
  }, [userGsm]);

  const applyDateFilter = () => {
    const filtered = sensorData.filter(data => {
      const dataDate = new Date(data.timestamp);
      return dataDate >= startDate && dataDate <= endDate;
    });
    setFilteredData(filtered);
  };

  const aggregateData = (data) => {
    return data.map(item => ({
      timestamp: item.timestamp,
      temperature: item.temperature,
      pressure: item.pressure,
      flow: item.flow,
    }));
  };

  const aggregatedData = aggregateData(filteredData);

  const chartData = {
    labels: aggregatedData.map(data => new Date(data.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Temperature',
        data: aggregatedData.map(data => data.temperature),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Pressure',
        data: aggregatedData.map(data => data.pressure),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Flow',
        data: aggregatedData.map(data => data.flow),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Values' }, beginAtZero: true },
    },
    plugins: {
      zoom: { pan: { enabled: true, mode: 'xy' }, zoom: { enabled: true, mode: 'xy' } },
    },
  };

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const userLocation = user?.userLocation?.coordinates || [0, 0];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData, {
      header: ['timestamp', 'temperature', 'pressure', 'flow'],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');
    XLSX.writeFile(wb, `sensor_data_${userGsm}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {user && (
          <>
            <h1>User Details</h1>
            <p><strong>GSM:</strong> {user.userGsm}</p>
            <p><strong>Name:</strong> {user.userName}</p>
            <p><strong>Phone:</strong> {user.userPhone}</p>
          </>
        )}
        <h2>Filter Data</h2>
        <div>
          <label>Start Date: </label>
          <DatePicker selected={startDate} onChange={setStartDate} />
        </div>
        <div>
          <label>End Date: </label>
          <DatePicker selected={endDate} onChange={setEndDate} />
        </div>
        <button onClick={applyDateFilter}>Apply Changes</button>
        <Line data={chartData} options={chartOptions} />
        <button onClick={exportToExcel}>Export</button>
      </div>
      <div style={{ flex: 1 }}>
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation} icon={customIcon}>
            <Popup>{user?.userName}</Popup>
          </Marker>
          <AutoZoomMap userLocation={userLocation} />
        </MapContainer>
      </div>
    </div>
  );
};

export default UserDetailsPage;
