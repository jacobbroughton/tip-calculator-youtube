import { useEffect, useState } from "react";
import "./TipCalculator.css"

const TipCalculator = () => {
  const [billDollarsInput, setBillDollarsInput] = useState("0");
  const [tipPercentInput, setTipPercentInput] = useState("0");
  const [tipDollars, setTipDollars] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [isValidBill, setIsValidBill] = useState(true);
  const [isValidTip, setIsValidTip] = useState(true);

  function isInvalidInput(numStr) {
    return numStr.match(/^0\d/g) || numStr === "" || isNaN(numStr) || numStr < 0;
  }

  function handleBillDollarsChange(e) {
    const input = e.target.value;

    setIsValidBill(!isInvalidInput(input));
    setBillDollarsInput(input);
  }

  function handleTipPercentDecrement() {
    if (tipPercentInput === 0) return;
    setTipPercentInput(`${parseFloat(tipPercentInput) - 1}`);
  }

  function handleTipPercentChange(e) {
    const input = e.target.value;

    setIsValidTip(!isInvalidInput(input));
    setTipPercentInput(input);
  }

  function handleTipPercentIncrement() {
    setTipPercentInput(`${parseFloat(tipPercentInput) + 1}`);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValidBill || !isValidTip) return;

    const parsedBill = parseFloat(billDollarsInput);
    const parsedTip = parseFloat(tipPercentInput);

    setTipDollars(parsedBill * (parsedTip / 100));
    setBillTotal(parsedBill + parsedBill * (parsedTip / 100));
  }

  useEffect(() => {
    const listener = (event) => {
      if (["Enter", "NumpadEnter"].includes(event.code)) handleSubmit(event);
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  return (
    <div className="tip-calculator">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bill</label>
          <input
            onChange={handleBillDollarsChange}
            value={billDollarsInput}
            type="text"
          />
          {isValidBill ? <p>${billDollarsInput}</p> : <p>Invalid bill</p>}
        </div>
        <br />
        <div className="form-group">
          <label>Tip %</label>
          <div className="counter">
            <button type="button" onClick={handleTipPercentDecrement}>
              -
            </button>
            <input
              onChange={handleTipPercentChange}
              value={tipPercentInput}
              type="text"
            />
            <button type="button" onClick={handleTipPercentIncrement}>
              +
            </button>
          </div>
          {isValidTip ? <p>{tipPercentInput}%</p> : <p>Invalid tip</p>}
        </div>
        <br />
        <p>Tip: ${tipDollars.toFixed(2)}</p>
        <p>Total: ${billTotal.toFixed(2)}</p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default TipCalculator;
