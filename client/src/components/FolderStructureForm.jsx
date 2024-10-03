import { useState } from "react";
import axios from "axios";
import "../App.css"; // Ensure the CSS file is correctly imported

const FolderStructureForm = () => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/getInfo",
        { url }, // Send the URL in the body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add Authorization in headers
          },
        }
      );
      setResponse(res.data.data); // The response will contain good and bad arrays
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Failed to fetch the folder structure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="folder-form">
        <label htmlFor="url">GitHub Repository URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://github.com/username/repository"
        />
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response">
          <h3>Rating & Review</h3>
          <div className="rating-review">
            <p>
              <strong>Rating:</strong> {response.rating}/10
            </p>
            <h4>Good Points:</h4>
            <ul>
              {response.good && response.good.length > 0 ? (
                response.good.map((point, index) => (
                  <li key={index}>{point}</li>
                ))
              ) : (
                <li>No good points available.</li>
              )}
            </ul>
            <h4>Areas for Improvement:</h4>
            <ul>
              {response.bad && response.bad.length > 0 ? (
                response.bad.map((point, index) => <li key={index}>{point}</li>)
              ) : (
                <li>No areas for improvement available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderStructureForm;
