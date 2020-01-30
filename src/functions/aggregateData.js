import dataPrepFunctions from "./dataPrepFunctions";
import _ from "lodash";

export default async function aggregateData(
  setState,
  asSingleEntries,
  parsedData
) {

  //*** These two arrays are used to organize aggregations and are stored in state for dropdowns
  let categories = [];
  let categoryValues = [];

  //*** object with categoryValues as keys and categories as values
  let categoryValueToCategoryIndex = {};

  //*** AGGREGATIONS

  //*** 1. categoryValueTime - aggregate categoryValues and timestamps around categories

  let categoryValueTime = {};
  asSingleEntries.map(item => {
    //*** check if category have been made
    if (categories.includes(item.category)) {
      //*** check if values added have been made
      if (categoryValues.includes(item.categoryValue)) {
        categoryValueTime[item.category][item.categoryValue].push(
          item.timestamp
        );
      } else {
        let t = [];
        t.push(item.timestamp);
        categoryValueToCategoryIndex[item.categoryValue] = item.category;
        categoryValues.push(item.categoryValue);
        categoryValueTime[item.category][item.categoryValue] = t;
      }
    } else {
      categories.push(item.category);
      categoryValues.push(item.categoryValue);
      categoryValueToCategoryIndex[item.categoryValue] = item.category;
      let t = [];
      t.push(item.timestamp);
      categoryValueTime[item.category] = { [item.categoryValue]: t };
    }
  });

  //*** 2. dayTimeCategoryValue - aggregates on day with all timestamps and their category and category value
  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);

  setState(prev => ({
    ...prev,
    dayTimeCategoryValue,
    categoryValueToCategoryIndex,
    categoryValueTime,
    categories,
    dataLoaded: true,
    focus: categories[1]
  }));
}
