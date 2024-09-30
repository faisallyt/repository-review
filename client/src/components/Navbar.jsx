const CLIENT_ID = "Ov23li5WPdaMDTa2OgA1";

const Navbar = () => {
  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  };
  return (
    <div className="flex p-4 justify-between shadow-xl items-center">
      <div>Repo Reviewer</div>
      <button
        className="rounded border-2  p-2  border-black px-6"
        onClick={handleLogin}>
        Login with Github
      </button>
    </div>
  );
};

export default Navbar;
