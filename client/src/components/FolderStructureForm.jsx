import { useState } from "react";
import axios from "axios";
import "../App.css"; // Ensure the CSS file is correctly imported
import formatText from "./formatter.js"; // Ensure this function is defined

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
      setResponse(res.data);
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
          <h3>Folder Structure:</h3>
          <pre className="structure">
            {formatText(JSON.stringify(response.structure, null, 2))}{" "}
            {/* Ensure response structure is correct */}
          </pre>
          <h3>Rating & Comments:</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: response.comments || "No rating or comments available",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FolderStructureForm;
