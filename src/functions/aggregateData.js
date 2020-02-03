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

  //** Start Stop categoryValues */
  let startCategoryValues = [];

  //** final object full of startStops */
let startStops = {}
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

  //*** 2. dayTimeCategoryValue - aggregates on day with all timestamps and their category and category value
  const dayTimeCategoryValue = dataPrepFunctions.extractDays(parsedData);

  //** 3.  Start Stops
  let tempStartStop = [];
  startCategoryValues.map((item, index) => {
    let value = item.split(" ")[1]
    let  startStopCategory = categoryValueToCategoryIndex[`start ${value}`];

    if(startStopCategory){
      for (
        let x = 0;
        x < categoryValueTime[startStopCategory][`start ${value}`].length;
        x++
      ) {

        let start = categoryValueTime[startStopCategory][`start ${value}`][x];
        console.log(item, start)
        let stop = categoryValueTime[startStopCategory][`stop ${value}`][x];
       
        tempStartStop.push([start, stop]);
      }
  
      startStops[value] = tempStartStop
      tempStartStop = [];
    }
   
  });

  // const testVal = "cleaning";
  // const startStopCategory = categoryValueToCategoryIndex[`start ${testVal}`];
  // for (
  //   let x = 0;
  //   x < categoryValueTime[startStopCategory][`start ${testVal}`].length;
  //   x++
  // ) {
  //   let start = categoryValueTime[startStopCategory][`start ${testVal}`][x];
  //   let stop = categoryValueTime[startStopCategory][`stop ${testVal}`][x];

  //   cleaningStartStop.push([start, stop]);
  // }

  console.log(startStops);
  //   categoryValueTime["Daily Routine"]['start cleaning'].map((item, index) => {

  // console.log(item)
  //   })

  console.log(dayTimeCategoryValue);
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
