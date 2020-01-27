import dataPrepFunctions from "./dataPrepFunctions";

export default async function aggregateData(setState, parsedData) {
  const categories = [];
  let categoryValues = [];
  const aggregates = [];
  let categoryValueTime = {};
  let allCatValueTime = {};

  // populate categories array from headers in parsedData, exclude Timestamp and blank headers. categories is
  // used in the dropdowns and in this script for aggregation

  Object.keys(parsedData[1]).forEach(x => {
    x && x !== "Timestamp" && categories.push(x);
  });

  //*** categoryValueTimestamp ***
  //First create an array of objects. The key is the category and its value is an array,
  //each slot of which contains one of the possible values within a category

  for (const category of categories) {
    for (const record of parsedData) {
      if (record[category]) {
        const seperatedValues = record[category].split(",");
        for (const item of seperatedValues) {
          const itemWithoutWhitespace = item.trim();
          categoryValues.push(itemWithoutWhitespace);
        }
      }
    }
    aggregates.push({
      [category]: categoryValues.filter(dataPrepFunctions.onlyUnique)
    });
    categoryValues = [];
  }

  //Second match timestamps with categoryValues and build final object
  aggregates.forEach(item => {
    const name = Object.keys(item)[0];
    const categoryValueArrays = Object.values(item);
    let times = [];

    //refactor??
    for (const categoryValueArray of categoryValueArrays) {
      for (const categoryValue of categoryValueArray) {
        for (const record of parsedData) {
          console.log(record, name)
          if (record[name]) {
            const splitRecord = record[name].split(",");
            for (const finalValue of splitRecord) {
              const trimmedFinalValue = finalValue.trim();
              if (trimmedFinalValue === categoryValue) {
                times.push(record.Timestamp);
              }
            }
          }
        }
        categoryValueTime[categoryValue] = times;
        times = [];
      }
    }
    allCatValueTime[name] = categoryValueTime;
    categoryValueTime = {};
  });

  //aggregates on day with all timestamps and their category and category value
  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);
  console.log(allCatValueTime)
  setState(prev => ({
    ...prev,
    dayTimeCategoryValue,
    categoryValueTime: allCatValueTime,
    categories,
    dataLoaded: true,
    focus: categories[1]
  }));
}
