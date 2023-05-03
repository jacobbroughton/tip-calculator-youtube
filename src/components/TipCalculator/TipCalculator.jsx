import { useCallback, useEffect, useMemo, useState } from "react";
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

  const calculateTip = useCallback(
    (e) => {
      e?.preventDefault();

      if (!isValidBill || !isValidTip || !isValidNumberOfPeople) return;

      const parsedBill = parseFloat(billDollarsInput.replace("$", ""));
      const parsedTip = parseFloat(tipPercentInput.replace("%", ""));
      const parsedNumberOfPeople = parseInt(numberOfPeopleInput);

      // console.log({ parsedBill, parsedTip, parsedNumberOfPeople });

      // TODO - Need to do something here in case user is trying to delete the %
      console.log(tipPercentInput)
      if (!tipPercentInput.includes("%")) {
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

  function isInvalidInput(numStr, unitType) {
    if (unitType === "dollars" && numStr.match(/^\$.+/)) numStr = numStr.replace("$", "");
    if (unitType === "percent" && numStr.match(/.+%$/)) numStr = numStr.replace("%", "");
    if (unitType === "integer") return !/^[1-9]\d*$/.test(numStr) || parseInt(numStr) < 1;
    return (
      numStr.match(/^0\d/g) || numStr === "" || isNaN(numStr) || parseInt(numStr) < 0
    );
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
    if (/0|0%/.test(tipPercentInput)) return;
    const newInput = `${parseFloat(tipPercentInput || "0") - 1}`;
    setIsValidTip(!isInvalidInput(newInput, "percent"));
    setTipPercentInput(newInput);
  }

  function handleTipPercentIncrement() {
    const newInput = `${parseFloat(tipPercentInput || "0") + 1}`;
    setIsValidTip(!isInvalidInput(newInput, "percent"));
    setTipPercentInput(newInput);
  }

  function handleNumberOfPeopleDecrement() {
    if (numberOfPeopleInput === "1") return;
    const newInput = `${parseInt(numberOfPeopleInput || "0") - 1}`;
    setIsValidNumberOfPeople(!isInvalidInput(newInput, "integer"));
    setNumberOfPeopleInput(newInput);
  }

  function handleNumberOfPeopleIncrement() {
    const newInput = `${parseInt(numberOfPeopleInput || "0") + 1}`;
    setIsValidNumberOfPeople(!isInvalidInput(newInput, "integer"));
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
              // disabled={!isValidTip}
              type="button"
              onClick={handleTipPercentDecrement}
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
            <button
              // disabled={!isValidTip}
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
              // disabled={!isValidNumberOfPeople}
              type="button"
              onClick={handleNumberOfPeopleDecrement}
            >
              -
            </button>
            <input
              onChange={handleNumberOfPeopleChange}
              value={numberOfPeopleInput}
              type="number"
              min={0}
              className={isValidNumberOfPeople ? "" : "error"}
              placeholder="# of people splitting the bill"
            />
            <button
              // disabled={!isValidNumberOfPeople}
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
              {everythingIsValid
                ? tipDollars.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : "-"}
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
              {everythingIsValid
                ? billTotal.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : "-"}
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
