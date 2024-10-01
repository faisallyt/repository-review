import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import { useEffect } from "react";
import axios from "axios";

const backend_url =
  import.meta.env.VITE_APP_BACKEND_URI || "http://localhost:8000";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    console.log(code);

    if (code && localStorage.getItem("accessToken") === null) {
      getAccessToken(code);
    }
  }, [location.search]); // Listen for changes in location.search

  const getAccessToken = async (code) => {
    console.log("Fetching access token...");

    try {
      const response = await axios.post(
        `${backend_url}/api/v1/auth/getAccessToken?code=${code}`
      );

      console.log("Response from backend:", response.data); // Log the full response

      if (response.status === 200 && response.data.data.access_token) {
        localStorage.setItem("accessToken", response.data.data.access_token);
        console.log("Access token stored:", response.data.data.access_token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
      // handle error
    }
  };

  return (
    <div className="w-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
