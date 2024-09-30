import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import { useEffect } from "react";
import axios from "axios";
const backend_url =
  import.meta.env.VITE_APP_BACKEND_URI || "http://localhost:8000";

function App() {
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    console.log(code);

    if (code && localStorage.getItem("accessToken") === null) {
      getAccessToken(code);
    }
  }, []);

  const getAccessToken = async (code) => {
    console.log("hello");

    try {
      const response = await axios.post(
        `${backend_url}/api/v1/auth/getAccessToken?code=${code}`
      );
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.data.access_token);
        // Redirect to home page
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
