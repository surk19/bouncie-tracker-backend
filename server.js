const express = require('express');
const axios = require('axios');
require('dotenv').config();

const express = require('express');
const axios = require('axios');
require('dotenv').config();

console.log('✅ Using Bouncie API: https://api.bouncie.dev');
console.log('USE_MOCK:', process.env.USE_MOCK);
console.log('VEHICLE_ID:', process.env.VEHICLE_ID);

const app = express();


// Log env var for debugging
console.log('USE_MOCK:', process.env.USE_MOCK);
console.log('VEHICLE_ID:', process.env.VEHICLE_ID);

app.get('/api/truck-location', async (req, res) => {
  if ((process.env.USE_MOCK || '').toLowerCase() === 'true') {
    return res.json({ latitude: 41.8781, longitude: -87.6298 }); // Chicago
  }

  try {
    const response = await axios.get(
      `https://api.bouncie.dev/api/v1/vehicles/${process.env.VEHICLE_ID}/locations`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BOUNCIE_API_KEY}`
        }
      }
    );

    const latest = response.data[0];
    res.json({ latitude: latest.latitude, longitude: latest.longitude });
  } catch (error) {
    console.error('Error fetching truck location:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch truck location',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/vehicle-list', async (req, res) => {
  if ((process.env.USE_MOCK || '').toLowerCase() === 'true') {
    return res.json([
      {
        id: 'mock123',
        make: 'Mercedes',
        model: 'Sprinter 3500',
        year: 2019
      }
    ]);
  }

  try {
    const response = await axios.get('https://api.bouncie.dev/api/v1/vehicles', {
      headers: {
        Authorization: `Bearer ${process.env.BOUNCIE_API_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching vehicle list:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch vehicle list',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
