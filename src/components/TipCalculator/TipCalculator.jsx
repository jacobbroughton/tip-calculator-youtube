import { useCallback, useEffect, useMemo, useState } from "react";
import "./TipCalculator.css";
import CalculatorField from "../CalculatorField/CalculatorField";

const TipCalculator = () => {
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

      // TODO - Need to do something here in case user is trying to delete the %
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
      !numStr.match(/^0\d/g) && numStr !== "" && !isNaN(numStr) && parseInt(numStr) > 0
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
        <CalculatorField
          label="Bill"
          counterOptions={{
            isCounter: false,
          }}
          inputValue={billDollarsInput}
          onChangeHandler={handleBillDollarsChange}
          isValidValue={isValidBill}
          placeholder="Enter your bill"
        />

        <CalculatorField
          label="Tip %"
          counterOptions={{
            isCounter: true,
            decrementHandler: handleTipPercentDecrement,
            incrementHandler: handleTipPercentIncrement,
            decrementDisabled: tipPercentInput <= 0 || !/^\d/.test(tipPercentInput),
          }}
          inputValue={tipPercentInput}
          onChangeHandler={handleTipPercentChange}
          isValidValue={isValidTip}
          placeholder="% on top of bill"
        />

        <CalculatorField
          label="Number Of People"
          counterOptions={{
            isCounter: true,
            decrementHandler: handleNumberOfPeopleDecrement,
            incrementHandler: handleNumberOfPeopleIncrement,
            decrementDisabled:
              numberOfPeopleInput <= 0 || !/^\d/.test(numberOfPeopleInput),
          }}
          inputValue={numberOfPeopleInput}
          onChangeHandler={handleNumberOfPeopleChange}
          isValidValue={isValidNumberOfPeople}
          placeholder="# of people splitting the bill"
        />
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
export default TipCalculator;
