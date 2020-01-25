import dataPrepFunctions from "./dataPrepFunctions";
import time from "../data/records.csv";
import Papa from "papaparse";

export default async function aggregateData(setState, parsedData) {
  const data = [];
  let records = [];
  const categories = [];
  const aggregates = [];
  const categoryValueTime = {};

  /*extract headers/keys from a record then 
    push to categories array*  --ToDo remove empty keys-- */
  Object.keys(parsedData[1]).forEach(x => categories.push(x));

  //strips time information from dates
  const datesOnly = parsedData.map(item => {
    return item.Timestamp.substr(0, item.Timestamp.indexOf(" "));
  });

  //removes duplicate dates
  const datesNoDuplicates = datesOnly.filter(dataPrepFunctions.onlyUnique);

  /* Create an array of objects where each value represents one day. Each value contains an object containing the key of 
      day with an array containing each record from that day. */
  for (const date of datesNoDuplicates) {
    for (const obj of parsedData) {

      //removes empty keys from object
      Object.keys(obj).forEach(x => obj[x] === "" && delete obj[x]);

      /* if the timestamp from the parsed data matches a date found in datesNoDuplicates
          create */
      obj.Timestamp && obj.Timestamp.includes(date) && records.push(obj);
    }

    //add a date key and the prepared records
    data.push({ date: date, records: records });

    //clear records array for the next day
    records = [];
  }

  //AGG
  let values = [];


  for (const cat of categories) {
    if (cat !== "Timestamp") {
      for (const rec of parsedData) {
        if (rec[cat]) {

          //gets values seperated by commas
          const seperatedValues = rec[cat].split(",");

          //adds to values array. --ToDo remove duplicates--.
          for (const item of seperatedValues) {
            const itemWithoutWhitespace = item.trim();
            values.push(itemWithoutWhitespace);
          }
        }
      }
      const valuesNoDuplicates = values.filter(dataPrepFunctions.onlyUnique);
      aggregates.push({ [cat]: valuesNoDuplicates });
      values = [];
    }
  }

  aggregates.forEach(item => {
    const name = Object.keys(item);
    const values = Object.values(item);

    let n = {};
    let times = [];
    let valueTimeArray = {};
    for (const v of values) {
      for (const i of v) {
        for (const rec of parsedData) {
          if (Object.values(rec).indexOf(i) > -1) {
            times.push(rec.Timestamp);
          }
        }
        valueTimeArray = { [i]: times };
        times = [];
        valueTimeArray = {};
        n[i] = times;
      }

      categoryValueTime[name] = n;
    }
  });

  //#### Left off here, changing how state is being made. The goal is to then output on screen with dropdown filters#####
  //console.log(categoryValueTime);

  setState(prev => ({
    ...prev,
    records: { byDay: data, raw: parsedData },
    categoryValueTime,
    dataLoaded: true,
    focus: categories[0]
  }));
}


