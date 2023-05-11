import { useCallback, useEffect, useState } from "react";
import "./TipCalculatorNoComponent.css";

const TipCalculatorNoComponent = () => {
  const [billDollarsInput, setBillDollarsInput] = useState("$0");
  const [tipPercentInput, setTipPercentInput] = useState("15%");
  const [numberOfPeopleInput, setNumberOfPeopleInput] = useState("1");
  const [tipDollars, setTipDollars] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [isValidBill, setIsValidBill] = useState(true);
  const [isValidTip, setIsValidTip] = useState(true);
  const [isValidNumberOfPeople, setIsValidNumberOfPeople] = useState(true);

  const calculateTip = useCallback(
    (e) => {
      e?.preventDefault();

      if (!isValidBill || !isValidTip || !isValidNumberOfPeople) return;

      const parsedBill = parseFloat(billDollarsInput.replace("$", ""));
      const parsedTip = parseFloat(tipPercentInput.replace("%", ""));
      const parsedNumberOfPeople = parseInt(numberOfPeopleInput);

      if (e) {
        setTipPercentInput(tipPercentInput.replace("%", "") + "%");
        setBillDollarsInput("$" + billDollarsInput.replace("$", ""));
      }

      setTipDollars((parsedBill * (parsedTip / 100)) / parsedNumberOfPeople);
      setBillTotal((parsedBill + parsedBill * (parsedTip / 100)) / parsedNumberOfPeople);
    },
    [
      numberOfPeopleInput,
      tipPercentInput,
      billDollarsInput,
      isValidBill,
      isValidNumberOfPeople,
      isValidTip,
    ]
  );

  function isValidInput(numStr, unitType) {
    if (unitType === "dollars" && numStr.match(/^\$.+/)) numStr = numStr.replace("$", "");
    if (unitType === "percent" && numStr.match(/.+%$/)) numStr = numStr.replace("%", "");
    if (unitType === "integer")
      return !numStr.match(/^0\d/g) && /^[1-9]\d*$/.test(numStr) && parseInt(numStr) >= 1;
    return (
      !numStr.match(/^0\d/g) && numStr !== "" && !isNaN(numStr) && parseInt(numStr) >= 0
    );
  }

  function handleBillDollarsChange(e) {
    const input = e.target.value.replaceAll("$", "");

    setIsValidBill(isValidInput(input, "dollars"));
    setBillDollarsInput(`$${input}`);
  }

  function handleNumberOfPeopleChange(e) {
    const input = e.target.value;

    setIsValidNumberOfPeople(isValidInput(input, "integer"));
    setNumberOfPeopleInput(input);
  }

  function handleTipPercentChange(e) {
    const input = e.target.value;

    setIsValidTip(isValidInput(input, "percent"));
    setTipPercentInput(input);
  }

  function handleTipPercentDecrement() {
    if (/^0|^0%/.test(tipPercentInput)) return;
    const newInput = `${parseFloat(tipPercentInput || "0") - 1}%`;
    setIsValidTip(isValidInput(newInput, "percent"));
    setTipPercentInput(newInput);
  }

  function handleTipPercentIncrement() {
    const newInput = `${parseFloat(tipPercentInput || "0") + 1}%`;
    setIsValidTip(isValidInput(newInput, "percent"));
    setTipPercentInput(newInput);
  }

  function handleNumberOfPeopleDecrement() {
    if (numberOfPeopleInput === "1") return;
    const newInput = `${parseInt(numberOfPeopleInput || "0") - 1}`;
    setIsValidNumberOfPeople(isValidInput(newInput, "integer"));
    setNumberOfPeopleInput(newInput);
  }

  function handleNumberOfPeopleIncrement() {
    const newInput = `${parseInt(numberOfPeopleInput || "0") + 1}`;
    setIsValidNumberOfPeople(isValidInput(newInput, "integer"));
    setNumberOfPeopleInput(newInput);
  }

  useEffect(() => {
    calculateTip();
  }, [calculateTip]);

  useEffect(() => {
    const listener = (event) => {
      if (["Enter", "NumpadEnter"].includes(event.code)) calculateTip(event);
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  const everythingIsValid = isValidBill && isValidNumberOfPeople && isValidTip;

  return (
    <form className="tip-calculator" onSubmit={calculateTip}>
      <div className="section">
        <div className="form-group">
          <label>Bill</label>
          <div className="counter">
            <input
              onChange={handleBillDollarsChange}
              value={billDollarsInput}
              type="text"
              placeholder="Enter your bill"
              className={isValidBill ? "" : "error"}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tip %</label>
          <div className="counter">
            <button
              type="button"
              onClick={handleTipPercentDecrement}
              disabled={parseInt(tipPercentInput) <= 0 || !/^\d/.test(tipPercentInput)}
            >
              -
            </button>
            <input
              onChange={handleTipPercentChange}
              value={tipPercentInput}
              type="text"
              placeholder="% on top of bill"
              className={isValidTip ? "" : "error"}
            />
            <button type="button" onClick={handleTipPercentIncrement}>
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Number Of People</label>
          <div className="counter">
            <button
              type="button"
              onClick={handleNumberOfPeopleDecrement}
              disabled={
                parseInt(numberOfPeopleInput) <= 1 || !/^\d/.test(numberOfPeopleInput)
              }
            >
              -
            </button>
            <input
              onChange={handleNumberOfPeopleChange}
              value={numberOfPeopleInput}
              type="text"
              placeholder="# of people splitting the bill"
              className={isValidNumberOfPeople ? "" : "error"}
            />
            <button type="button" onClick={handleNumberOfPeopleIncrement}>
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
              {everythingIsValid
                ? tipDollars.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : "-"}
            </p>
          </div>
          {isValidInput(numberOfPeopleInput) && parseInt(numberOfPeopleInput) > 1 && (
            <p className="per-person">/person</p>
          )}
        </div>
        <div className="result-container">
          <div className="header-and-result">
            <p>Total:</p>
            <p>
              {everythingIsValid
                ? billTotal.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : "-"}
            </p>
          </div>

          {isValidInput(numberOfPeopleInput) && parseInt(numberOfPeopleInput) > 1 && (
            <p className="per-person">/person</p>
          )}
        </div>
      </div>
    </form>
  );
};
export default TipCalculatorNoComponent;
