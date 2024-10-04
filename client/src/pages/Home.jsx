import FolderStructureForm from "../components/FolderStructureForm";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="App-header">
        <h1>Folder Structure Review</h1>
      </div>
      <main>
        <FolderStructureForm />
      </main>
    </div>
  );
};

export default Home;
