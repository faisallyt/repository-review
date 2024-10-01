import { GridBackgroundDemo } from "../components/Background.jsx";
import Navbar from "../components/Navbar.jsx";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="absolute top-[0rem] flex justify-center items-center  w-full">
        <GridBackgroundDemo />
      </div>
    </div>
  );
};

export default LandingPage;
