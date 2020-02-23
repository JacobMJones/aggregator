import dataPrepFunctions from "./dataPrepFunctions";
import moment from "moment";
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

  //** Start Stop categoryValues */
  let startCategoryValues = [];

  //** final object full of startStops */
  let startStops = {};
  //*** AGGREGATIONS

  //*** 1. categoryValueTime - aggregate categoryValues and timestamps around categories
  let categoryValueTime = {};
  asSingleEntries.map(item => {
    //*** check if category have been made
    if (categories.includes(item.category)) {
      //*** check if values added have been made
      //The second condition is for when categoryValues are mistakenly entered in the wrong category
      if (
        categoryValues.includes(item.categoryValue) &&
        categoryValueTime[item.category][item.categoryValue]
      ) {
        categoryValueTime[item.category][item.categoryValue].push(
          item.timestamp
        );
      } else {
        let t = [];
        t.push(item.timestamp);
        categoryValueToCategoryIndex[item.categoryValue] = item.category;
        categoryValues.push(item.categoryValue);
        if (item.categoryValue.includes("start")) {
          startCategoryValues.push(item.categoryValue);
        }
        categoryValueTime[item.category][item.categoryValue] = t;
      }
    } else {
      //this condition is for if blank columns have been included

      categories.push(item.category);
      categoryValues.push(item.categoryValue);

      if (item.categoryValue.includes("start")) {
        startCategoryValues.push(item.categoryValue);
      }

      categoryValueToCategoryIndex[item.categoryValue] = item.category;
      let t = [];
      t.push(item.timestamp);
      categoryValueTime[item.category] = { [item.categoryValue]: t };
    }
  });

  console.log('categoryValueTime', categoryValueTime);

  //*** 2. dayTimeCategoryValue - aggregates on day with all timestamps and their category and category value
  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);

  //** 3.  Start Stops
  let tempStartStop = [];
  let start;
  let stop;
  startCategoryValues.map((item, index) => {
    let value = item.split(" ")[1];
    let startStopCategory = categoryValueToCategoryIndex[`start ${value}`];

    if (startStopCategory) {
      for (
        let x = 0;
        x < categoryValueTime[startStopCategory][`start ${value}`].length;
        x++
      ) {

        //conditional stops situations where there are not proper start stop pairs
      
        if (categoryValueTime[startStopCategory][`stop ${value}`]) {
          start = categoryValueTime[startStopCategory][`start ${value}`][x];
          stop = categoryValueTime[startStopCategory][`stop ${value}`][x];
        }

        let w = Date.parse(stop) - Date.parse(start);
        tempStartStop.push([start, stop, Math.round(w / 60000)]);
      }
      startStops[value] = tempStartStop;
      tempStartStop = [];
    }
  });

  console.log('startStops', startStops);
  
  setState(prev => ({
    ...prev,
    dayTimeCategoryValue,
    categoryValueToCategoryIndex,
    categoryValueTime,
    categories,
    startStops: startStops,
    dataLoaded: true,
    focus: categories[1]
  }));
}
