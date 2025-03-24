const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
let accessToken = null;

async function getAccessToken() {
  const response = await axios.post('https://auth.bouncie.dev/oauth/token', {
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  });
  accessToken = response.data.access_token;
}

app.get('/api/truck-location', async (req, res) => {
  try {
    if (!accessToken) await getAccessToken();

    const response = await axios.get(
      `https://api.bouncie.dev/api/v1/vehicles/${process.env.VEHICLE_ID}/locations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const latest = response.data[0];
    res.json({ latitude: latest.latitude, longitude: latest.longitude });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

const PORT = process.env.PORT || 3000;
app.get('/api/vehicle-list', async (req, res) => {
  try {
    if (!accessToken) await getAccessToken();

    const response = await axios.get('https://api.bouncie.dev/api/v1/vehicles', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching vehicle list:', error.message);
    res.status(500).json({ error: 'Failed to fetch vehicle list' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
