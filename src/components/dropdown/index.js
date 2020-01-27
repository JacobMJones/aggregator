import React from "react";
const Dropdown = ({ stateKey, setState, dropdownValues }) => {
  return (
    <select
      name="select"
      onChange={event => {
        const selection = event.target.value;
        setState(prev => ({
          ...prev,
          [stateKey]: selection
        }));
      }}
    >
      {dropdownValues &&
        dropdownValues.map((item, index) => {
          return (
            <option key={`option ${item}`} value={item}>
              {item}
            </option>
          );
        })}
    </select>
  );
};

export default Dropdown;
