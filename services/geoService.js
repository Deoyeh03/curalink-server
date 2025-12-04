const axios = require('axios');

const reverseGeocode = async (lat, long) => {
  try {
    // Using Nominatim (OpenStreetMap) for reverse geocoding
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`);
    const data = response.data;
    const city = data.address.city || data.address.town || data.address.village || "Unknown City";
    const country = data.address.country || "Unknown Country";
    return { city, country };
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return { city: "Error", country: "Error" };
  }
};

module.exports = {
  reverseGeocode,
};
