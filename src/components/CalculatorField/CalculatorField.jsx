import PropTypes from "prop-types";
import "./CalculatorField.css";

const CalculatorField = ({
  label = "",
  counterOptions = {
    isCounter: false,
    decrementHandler: () => null,
    incrementHandler: () => null,
    decrementDisabled: false,
    incrementDisabled: false,
  },
  inputValue,
  onChangeHandler,
  isValidValue,
  placeholder,
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="counter">
        {counterOptions.isCounter && (
          <button
            type="button"
            onClick={counterOptions.decrementHandler}
            disabled={counterOptions.decrementDisabled}
          >
            -
          </button>
        )}
        <input
          onChange={onChangeHandler}
          value={inputValue}
          type="text"
          placeholder={placeholder}
          className={isValidValue ? "" : "error"}
        />
        {counterOptions.isCounter && (
          <button
            type="button"
            onClick={counterOptions.incrementHandler}
            disabled={counterOptions.incrementDisabled}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default CalculatorField;

CalculatorField.propTypes = {
  label: PropTypes.string,
  counterOptions: PropTypes.shape({
    isCounter: PropTypes.bool,
    decrementHandler: PropTypes.func,
    incrementHandler: PropTypes.func,
    decrementDisabled: PropTypes.bool,
    incrementDisabled: PropTypes.bool,
  }),
  inputValue: PropTypes.string,
  onChangeHandler: PropTypes.func,
  isValidValue: PropTypes.bool,
  placeholder: PropTypes.string,
};
