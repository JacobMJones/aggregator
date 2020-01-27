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
  const [state, setState] = useState({ focus: null });

  useEffect(() => {
    //prepareData will call a function, aggregateData(), after fetch and parse are complete
    !state.dataLoaded && prepareData(setState);

    //populates dropdowns
    setFocus(state, setState);
  }, [state.focus]);

  return (
    <>
      {!state.dataLoaded ? (
        "loading"
      ) : (
        <>
          <div>
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
          </div>

          {/* This needs to be cleaned up. Hack way of dealing with when a focus and focusValue don't match */}
          {state.categoryValueTime[state.focus][state.focusedValue] &&
            state.categoryValueTime[state.focus][state.focusedValue].map(
              (item, index) => {
                return <div key={"value list" + index}>{item}</div>;
              }
            )}
        </>
      )}
    </>
  );
}
export default App;
