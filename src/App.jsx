import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import TipCalculator from "./components/TipCalculator/TipCalculator";
import Footer from "./components/Footer/Footer";
import TipCalculatorNoComponent from "./components/TipCalculator/TipCalculatorNoComponents";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <TipCalculatorNoComponent/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
