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
  console.log(state.categoryValueTime);
  useEffect(() => {
    !state.dataLoaded && prepareData(setState);
    setFocus(state, setState);
  }, [state.focus, state.categoryValueTime]);

  return (
    <>
      {!state.data ? (
        "loading"
      ) : (
        <>
          {/* Below needs to change when new way of making state finished 
          Still needs state.categories updated so dropdown works*/}
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

          <>
            {state.categoryValueTime.Distractions && (
              <div>
                {state.categoryValueTime.Distractions["start reddit"].map((item, index)=>{
                    return (
                      <div key={"start reddit" + index}>
                        <b>{item}</b> {item.timestamp}
                      </div>
                    );
                })}
              </div>
            )}
          </>
          <br />

          {state.focusArray.map((item, index) => {
            if (item.focus.includes(state.focusedValue)) {
              console.log(item.focus + state.focusedValue);
              return (
                <div key={"time" + index}>
                  <b>{state.focusedValue}</b> {item.timestamp}
                </div>
              );
            }
          })}
        </>
      )}
    </>
  );
}
export default App;
