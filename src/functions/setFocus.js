import dataPrepFunctions from "./dataPrepFunctions";

export default function setFocus(state, setState) {
  const tempPossible = [];
  if (state.categoryValueTime) {
    for (const rec in state.categoryValueTime[state.focus]) {
      tempPossible.push(rec);
    }
    const possibleValues = tempPossible.filter(dataPrepFunctions.onlyUnique);
    setState(prev => ({
      ...prev,
      possibleValues,
    }));
  }
}
