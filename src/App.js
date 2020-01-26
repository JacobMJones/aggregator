import React, { useState, useEffect } from "react";
import prepareData from "./functions/prepareData";
import Dropdown from "./components/dropdown";
import setFocus from "./functions/setFocus";

//state 
  // data: array
  // dataLoaded: bool
  // categories: array
  // focus: string
  // focusArray: array
  // possibleValues: array
  // focusedValue: string
  // categoryValueTime: object
//

function App() {
  const [state, setState] = useState({focus:null});
  useEffect(() => {
    !state.dataLoaded && prepareData(setState);
    setFocus(state, setState);
  }, [state.focus]);

  return (
    <>
      {!state ? (
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
          {/* This needs to be cleaned up. Hack way of dealing with when a focus and focusValue don't match */}
          {state.focusedValue &&
            state.categoryValueTime[state.focus][state.focusedValue] &&
            state.categoryValueTime[state.focus][state.focusedValue].map(
              (item, index) => {
                return <div key={"time" + index}>{item}</div>;
              }
            )}
        </>
      )}
    </>
  );
}
export default App;
