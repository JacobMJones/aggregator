import dataPrepFunctions from "./dataPrepFunctions";

export default function setFocus(state, setState) {
  console.log('calling setFocus')
  //array to return, is iterated over in app.js's return
  const focusArray = [];

  //array of unique values from category, temp because duplicates will be stripped
  const tempPossible = [];

  /* find records matching state.focus
    add them to focusArray -- ToDo this needs to change there is a new state structure --*/
  for (const entry in state.categoryValueTime) {
  //  console.log('entry', entry)
    for (const rec in state.categoryValueTime[entry]) {
     // console.log('rec in entry', rec, state.focus)
 
      // rec[state.focus] &&
      //   focusArray.push({ timestamp: rec.Timestamp, focus: rec[state.focus] });
    }
  }
  console.log('focusArray', focusArray)
  //create possibleValues array
  for (const entry of state.data) {
    for (const rec of entry.records) {
      if (rec[state.focus]) {
        //gets values seperated by commas
        const seperatedValues = rec[state.focus].split(",");

        //add values to tempPossible.
        for (const item of seperatedValues) {
          const itemWithoutWhitespace = item.trim();
          tempPossible.push(itemWithoutWhitespace);
        }
      }
    }
  }
  //remove duplicates from tempPossible
  const possibleValues = tempPossible.filter(dataPrepFunctions.onlyUnique);

  //create startStops
  // identify what is a start stop ie. start exercise-stop exercise

  const startStopValues = [];
  let starts = [];
  let stops = [];
  possibleValues.map(item => {
    if (item.indexOf("start") > -1 || item.indexOf("stop") > -1) {

      //to get the value without the start/stop, seperate by whitespace, then take the last value
      let activity = item.split(" ");
      activity = activity[activity.length - 1];

      //make start array

      for (const entry of state.data) {
        for (const rec of entry.records) {
          rec[state.focus] === item && item.indexOf("start") > -1 && starts.push(rec.Timestamp);
          rec[state.focus] === item && item.indexOf("stop") > -1 && stops.push(rec.Timestamp);
        }
      }

      startStopValues.push({ activity, starts, stops });
      starts = []
      stops = []
    }
  });



  setState(prev => ({
    ...prev,
    focusArray,
    possibleValues
  }));
}
