import React from "react";
const Dropdown = ({stateKey, setState, dropdownValues}) => {

  return (
    <select
      name="select"
      onChange={event => {
        const focus = event.target.value;
        setState(prev => ({
          ...prev,
          [stateKey]:focus
        }));
      }}
    >
      {dropdownValues && dropdownValues.map((item, index) => {
        return (
          <option key={`option ${item}`} defaultValue={index === 0 && item} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
}

export default Dropdown;
