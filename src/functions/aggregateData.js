import dataPrepFunctions from "./dataPrepFunctions";
import _ from "lodash";

export default async function aggregateData(setState, asSingleEntries, parsedData) {
  let categoryValueTime = {};
  let categories = [];
  let categoryValues = [];


  //makes each entry a single record
  //1. categoryValueTime - aggregate categoryValues and timestamps around categories
  asSingleEntries.map(item => {
    //check if category have been made
    if (categories.includes(item.category)) {
      //check if values added have been made
      if (categoryValues.includes(item.categoryValue)) {
        categoryValueTime[item.category][item.categoryValue].push(
          item.timestamp
        );
      } else {
        let t = [];
        t.push(item.timestamp);
        categoryValues.push(item.categoryValue);
        categoryValueTime[item.category][item.categoryValue] = t;
      }
    } else {
      categories.push(item.category);
      categoryValues.push(item.categoryValue);
      let t = [];
      t.push(item.timestamp);
      categoryValueTime[item.category] = { [item.categoryValue]: t };
    }
  });

  //2. dayTimeCategoryValue - aggregates on day with all timestamps and their category and category value
  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);

  setState(prev => ({
    ...prev,
    dayTimeCategoryValue,
    categoryValueTime,
    categories,
    dataLoaded: true,
    focus: categories[1]
  }));
}
