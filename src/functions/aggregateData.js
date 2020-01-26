import dataPrepFunctions from "./dataPrepFunctions";
import time from "../data/records.csv";
import Papa from "papaparse";

export default async function aggregateData(setState, parsedData) {
  const categories = [];
  const aggregates = [];
  let categoryValueTime = {};
  let allCatValueTime = {};

  // populate categories array from headers in parsedData, exclude Timestamp and blank headers. categories is
  // used in the dropdowns and in this script for aggregation

  Object.keys(parsedData[1]).forEach(x => {
    x && x !== "Timestamp" && categories.push(x);
  });

  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);

  //*** categoryValueTimestamp ***
  //First create aggregates array, which is an array of objects. The key is the category and its value is an array,
  //each slot contains one of the possible values within a category

  let categoryValues = [];
  for (const cat of categories) {
    if (cat !== "Timestamp") {
      for (const rec of parsedData) {
        if (rec[cat]) {
          const seperatedValues = rec[cat].split(",");
          for (const item of seperatedValues) {
            const itemWithoutWhitespace = item.trim();
            categoryValues.push(itemWithoutWhitespace);
          }
        }
      }
      const valuesNoDuplicates = categoryValues.filter(
        dataPrepFunctions.onlyUnique
      );
      aggregates.push({ [cat]: valuesNoDuplicates });
      categoryValues = [];
    }
  }

  aggregates.forEach(item => {
    const name = Object.keys(item)[0];
    const categoryValueArrays = Object.values(item);
    let times = [];

    //refactor??
    for (const categoryValueArray of categoryValueArrays) {
      for (const categoryValue of categoryValueArray) {
        for (const record of parsedData) {
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

  setState(prev => ({
    ...prev,
    dayTimeCategoryValue,
    categoryValueTime: allCatValueTime,
    categories,
    dataLoaded: true,
    focus: categories[1]
  }));
}
