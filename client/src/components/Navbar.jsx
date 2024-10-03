const CLIENT_ID = "Ov23li5WPdaMDTa2OgA1";
import logo from "../assets/repo_review-logo.png";
import github_logo from "../assets/github-logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(false);
  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  };

  useEffect(() => {
    const isThereAToken = localStorage.getItem("accessToken");
    if (isThereAToken) {
      setHasToken(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setHasToken(false);
    // window.location.reload();
    navigate("/");
  };

  return (
    <div className="flex p-4 justify-between shadow-xl items-center  top-0  z-50 border-b-1 px-20 relative bg-transparent">
      <img src={logo} alt="" className="w-[2rem]" />
      {hasToken ? (
        <button
          className="rounded border-2 p-2 border-white text-white px-6 mt-2 flex items-center gap-3 "
          onClick={handleLogout}>
          <img
            src={github_logo}
            alt=""
            className="w-[1rem] bg-white rounded-full"
          />
          <p>Logout</p>
        </button>
      ) : (
        <button
          className="rounded border-2 p-2 border-white text-white px-6 mt-2 flex items-center gap-3 "
          onClick={handleLogin}>
          <img
            src={github_logo}
            alt=""
            className="w-[1rem] bg-white rounded-full"
          />
          <p>Login with Github</p>
        </button>
      )}
    </div>
  );
};

export default Navbar;
