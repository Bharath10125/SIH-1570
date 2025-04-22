const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); 


mongoose.connect('mongodb://localhost:27017/SIH_Hydroxpert', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); 
});

// User model 
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userGsm: { type: String, required: true, unique: true },
  userAddress: { type: String, required: true },
  userLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, //[longitude, latitude]
  },
  sensorData: [
    {
      timestamp: { type: Date, required: true },
      temperature: { type: Number, required: true },
      pressure: { type: Number, required: true },
      head: { type: Number, required: true },
      flow: { type: Number, required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);

// create a new user details
app.post('/api/users', async (req, res) => {
  const { userName, userPhone, userGsm, userAddress, userLocation } = req.body;

  // Validate [longitude, latitude]
  if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
    return res.status(400).json({ message: 'Invalid location format. Expected [longitude, latitude].' });
  }

  const newUser = new User({
    userName,
    userPhone,
    userGsm,
    userAddress,
    userLocation: {
      type: 'Point',
      coordinates: userLocation, // [longitude, latitude]
    },
    sensorData: [], // empty array 
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// get user details without sensor data
app.get('/api/users', async (req, res) => {
  try {
    // all users without sensor data
    const users = await User.find({}, 'userName userPhone userGsm userAddress userLocation');
    res.status(200).json(users);  // details of user without sensor data
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// sensor data from ESP32
app.post('/api/sensor-data', async (req, res) => {
  const { gsmNumber, data, flow } = req.body; 

  if (!gsmNumber || !data || !Array.isArray(data)) {
    return res.status(400).json({ message: 'Invalid request format.' });
  }

  try {
    // Find user gsm and update sensor data
    const user = await User.findOne({ userGsm: gsmNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this GSM number' });
    }

    // Adding sensor data to the user's sensorData array
    const sensorDataToAdd = data.map(d => ({
      timestamp: new Date(d.timestamp),
      temperature: d.temperature,
      pressure: d.pressure,
      head: d.head,
      flow: flow, // Adding flow for each entry
    }));

    user.sensorData.push(...sensorDataToAdd);
    await user.save();
    
    res.status(201).json({ message: 'All data sent successfully' });  // Success msg

  } catch (err) {
    console.error('Error saving sensor data:', err.message);
    res.status(400).json({ message: 'Error saving sensor data', error: err.message });
  }
});

// sensor data for a specific gsm
app.get('/api/sensor-data/:userGsm', async (req, res) => {
  const { userGsm } = req.params; // Changing to specific GSM

  try {
    const user = await User.findOne({ userGsm });

    if (!user) {
      return res.status(404).json({ message: 'No user found for this GSM number' });
    }

    res.status(200).json(user.sensorData); //sensor data of specific user
  } catch (err) {
    console.error('Error fetching sensor data:', err.message);
    res.status(500).json({ message: 'Error fetching sensor data', error: err.message });
  }
});

// Start server
const port = 8080;
app.listen(port, '0.0.0.0', () => {  // Blind IP
  console.log(`Server running on port ${port}`);
});