import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import TipCalculator from "./components/TipCalculator/TipCalculator";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <TipCalculator />
      </main>
      <Footer/>
    </div>
  );
}

export default App;
