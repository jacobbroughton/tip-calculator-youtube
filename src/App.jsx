import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import TipCalculator from "./components/TipCalculator/TipCalculator";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <TipCalculator />
      </main>
    </div>
  );
}

export default App;
