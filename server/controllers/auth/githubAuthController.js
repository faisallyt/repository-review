const axios = require("axios");

const getAccessTokenController = async (req, res) => {
  const code = req.query.code; // You can change this to req.body.code if it's a POST request
  console.log("Authorization code:", code);

  // Construct the body for the POST request
  const params = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code,
  };

  try {
    // Make the POST request to GitHub's OAuth endpoint
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      params,
      { headers: { accept: "application/json" } } // Ensure the response is in JSON format
    );

    // Log the response for debugging
    console.log("Response data:", response.data);

    // Send the response back to the client
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching access token:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAccessTokenController };
