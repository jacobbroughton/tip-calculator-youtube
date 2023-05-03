import { useEffect, useState } from "react";
import "./TipCalculator.css";

const TipCalculator = () => {
  const [billDollarsInput, setBillDollarsInput] = useState("0");
  const [tipPercentInput, setTipPercentInput] = useState("0");
  const [numberOfPeopleInput, setNumberOfPeopleInput] = useState("1");
  const [tipDollars, setTipDollars] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [isValidBill, setIsValidBill] = useState(true);
  const [isValidTip, setIsValidTip] = useState(true);
  const [isValidNumberOfPeople, setIsValidNumberOfPeople] = useState(true);

  function isInvalidInput(numStr, unitType) {
    if (unitType === "dollars" && numStr.match(/^\$.+/)) numStr = numStr.replace("$", "");
    if (unitType === "percent" && numStr.match(/.+%$/)) numStr = numStr.replace("%", "");
    if (unitType === "integer") return !/^[1-9]\d*$/.test(numStr);
    return numStr.match(/^0\d/g) || numStr === "" || isNaN(numStr) || numStr < 0;
  }

  function handleBillDollarsChange(e) {
    const input = e.target.value;

    setIsValidBill(!isInvalidInput(input, "dollars"));
    setBillDollarsInput(input);
  }

  function handleNumberOfPeopleChange(e) {
    const input = e.target.value;

    setIsValidNumberOfPeople(!isInvalidInput(input, "integer"));

    setNumberOfPeopleInput(input);
  }

  function handleTipPercentChange(e) {
    const input = e.target.value;

    setIsValidTip(!isInvalidInput(input, "percent"));

    setTipPercentInput(input);
  }

  function handleTipPercentDecrement() {
    if (tipPercentInput === 0) return;
    setTipPercentInput(`${parseFloat(tipPercentInput || "0") - 1}`);
    calculateTip();
  }

  function handleTipPercentIncrement() {
    console.log(tipPercentInput);
    setTipPercentInput(`${parseFloat(tipPercentInput || "0") + 1}`);
    calculateTip();
  }

  function handleNumberOfPeopleDecrement() {
    if (tipPercentInput === 0) return;
    setNumberOfPeopleInput(`${parseInt(numberOfPeopleInput || "0") - 1}
    `);
    calculateTip();
  }

  function handleNumberOfPeopleIncrement() {
    setNumberOfPeopleInput(`${parseInt(numberOfPeopleInput || "0") + 1}`);
    calculateTip();
  }

  function calculateTip(e = null) {
    e?.preventDefault();

    if (!isValidBill || !isValidTip || !isValidNumberOfPeople) return;

    const parsedBill = parseFloat(billDollarsInput.replace("$", ""));
    const parsedTip = parseFloat(tipPercentInput.replace("%", ""));
    const parsedNumberOfPeople = parseInt(numberOfPeopleInput);

    console.log({ parsedBill, parsedTip, parsedNumberOfPeople });

    setTipPercentInput(tipPercentInput.replace("%", "") + "%");
    setBillDollarsInput("$" + billDollarsInput.replace("$", ""));

    setTipDollars((parsedBill * (parsedTip / 100)) / parsedNumberOfPeople);
    setBillTotal((parsedBill + parsedBill * (parsedTip / 100)) / parsedNumberOfPeople);
  }

  useEffect(() => {
    const listener = (event) => {
      if (["Enter", "NumpadEnter"].includes(event.code)) calculateTip(event);
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  return (
    <form className="tip-calculator" onSubmit={calculateTip}>
      <div className="section">
        <div className="form-group">
          <label>Bill</label>
          <input
            onChange={handleBillDollarsChange}
            value={billDollarsInput}
            type="text"
            placeholder="Enter your bill"
            className={isValidBill ? "" : "error"}
          />
        </div>

        <div className="form-group">
          <label>Tip %</label>
          <div className="counter">
            <button
              disabled={!isValidTip}
              type="button"
              onClick={handleTipPercentDecrement}
            >
              -
            </button>
            <input
              onChange={handleTipPercentChange}
              value={tipPercentInput}
              type="text"
              placeholder="Enter a tip %"
              className={isValidTip ? "" : "error"}
            />
            <button
              disabled={!isValidTip}
              type="button"
              onClick={handleTipPercentIncrement}
            >
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Number Of People</label>

          <div className="counter">
            <button
              disabled={!isValidNumberOfPeople}
              type="button"
              onClick={handleNumberOfPeopleDecrement}
            >
              -
            </button>
            <input
              onChange={handleNumberOfPeopleChange}
              value={numberOfPeopleInput}
              type="text"
              className={isValidNumberOfPeople ? "" : "error"}
              placeholder="# of people splitting the bill"
            />
            <button
              disabled={!isValidNumberOfPeople}
              type="button"
              onClick={handleNumberOfPeopleIncrement}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="result-container">
          <div className="header-and-result">
            <p>Tip:</p>
            <p>
              {tipDollars.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>
          {!isInvalidInput(numberOfPeopleInput) && parseInt(numberOfPeopleInput) > 1 && (
            <p className="per-person">/person</p>
          )}
        </div>
        <div className="result-container">
          <div className="header-and-result">
            <p>Total:</p>
            <p>
              {billTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>

          {!isInvalidInput(numberOfPeopleInput) && parseInt(numberOfPeopleInput) > 1 && (
            <p className="per-person">/person</p>
          )}
        </div>
      </div>
    </form>
  );
};
export default TipCalculator;
