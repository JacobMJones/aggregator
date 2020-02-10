import React, { useState, useEffect } from "react";
import prepareData from "./functions/prepareData";
import Dropdown from "./components/dropdown";
import SentenceFrequency from "./components/dashboard-elements/sentence-frequency";
import setFocus from "./functions/setFocus";
import Bar from "./components/charts/bar";
//state
// data: array
// dataLoaded: bool
// categories: array
// focus: string
// focusArray: array
// possibleValues: array
// focusedValue: string
// categoryValueTime: object
// dayTimeCategoryValue: array
// categoryValueToCategoryIndex : object
// startStops: object

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
          {state.dataLoaded && (
            <>
               <Bar state={state}  /> 
              <SentenceFrequency state={state} />
              <br />
              {state.startStops["cleaning"].map((item, index) => {
                return (
                  <div key={"startStop" + index}>
                    {item[0]} start <br /> {item[2]} minutes cleaning
                  </div>
                );
              })}
              <br />
            </>
          )}
        </>
      )}
    </>
  );
}
export default App;
