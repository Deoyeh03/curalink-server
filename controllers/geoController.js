// Geo Controller - Handles geo-spatial related requests
const { reverseGeocode } = require('../services/geoService');

const detectLocation = async (req, res) => {
  const { lat, long } = req.body;
  console.log(`Detecting location for lat: ${lat}, long: ${long}`);
  const locationData = await reverseGeocode(lat, long);
  res.status(200).json({ message: "Location detected", location: locationData });
};

module.exports = {
  detectLocation,
};
