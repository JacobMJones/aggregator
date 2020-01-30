import React, { useState, useEffect } from "react";
import prepareData from "./functions/prepareData";
import Dropdown from "./components/dropdown";
import SentenceFrequency from "./components/dashboard-elements/sentence-frequency";
import setFocus from "./functions/setFocus";
import { XYPlot, LineSeries } from "react-vis";
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
              <SentenceFrequency state={state} />
            </>
          )}
        </>
      )}
    </>
  );
}
export default App;

{
  /*           
list timestamps for selection */
}
{
  /* {state.categoryValueTime[state.focus][state.focusedValue] &&
            state.categoryValueTime[state.focus][state.focusedValue].map(
              (item, index) => {
                return <div key={"value list" + index}>{Date.parse(item)}</div>;
              }
            )} */
}

{
  /* <XYPlot height={300} width={300}>
          <LineSeries data={data} />
        </XYPlot> */
}
// const data = [
//   { x: 0, y: 8 },
//   { x: 1, y: 5 },
//   { x: 2, y: 4 },
//   { x: 3, y: 9 },
//   { x: 4, y: 1 },
//   { x: 5, y: 7 },
//   { x: 6, y: 6 },
//   { x: 7, y: 3 },
//   { x: 8, y: 2 },
//   { x: 9, y: 0 }
// ];
