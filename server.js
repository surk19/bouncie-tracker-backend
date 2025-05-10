const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.get('/api/truck-location', async (req, res) => {
  if (process.env.USE_MOCK === 'true') {
    // Mocked GPS location: Chicago downtown
    return res.json({ latitude: 41.8781, longitude: -87.6298 });
  }

  try {
    const response = await axios.get(
      `https://api.bouncie.com/api/v1/vehicles/${process.env.VEHICLE_ID}/locations`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BOUNCIE_API_KEY}`
        }
      }
    );

    const latest = response.data[0];
    res.json({ latitude: latest.latitude, longitude: latest.longitude });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch location',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/vehicle-list', async (req, res) => {
  if (process.env.USE_MOCK === 'true') {
    // Mocked vehicle list
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
    const response = await axios.get('https://api.bouncie.com/api/v1/vehicles', {
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
app.listen(PORT, () => console.log(`🚚 Server running on port ${PORT}`));
