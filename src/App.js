import React, { useState, useEffect } from "react";
import prepareData from "./functions/prepareData";
import Dropdown from "./components/dropdown";
import setFocus from "./functions/setFocus";

const initialState = {
  data: [],
  dataLoaded: false,
  categories: [],
  focus: "",
  focusArray: [],
  possibleValues: [],
  focusedValue: "",
  categoryValueTime: {}
};

function App() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    !state.dataLoaded && prepareData(setState);
    setFocus(state, setState);
  }, [state.focus]);

  return (
    <>
      {!state.data ? (
        "loading"
      ) : (
        <>
          <Dropdown
            dropdownValues={state.categories}
            stateKey={"focus"}
            setState={setState}
          />
          <Dropdown
            dropdownValues={state.possibleValues}
            stateKey={"focusedValue"}
            setState={setState}
          />
          <br />

          {/* Displays timestamps related to category(focus) and value(focusedValue) */}
          {/* This needs to be cleaned up. Hack way of dealing with when a focus and focusValue don't match */}
          {state.focusedValue &&
            state.categoryValueTime[state.focus][state.focusedValue] &&
            state.categoryValueTime[state.focus][state.focusedValue].map(
              (item, index) => {
                return <div key={"time" + index}>{index}. {item}</div>;
              }
            )}
        </>
      )}
    </>
  );
}
export default App;
