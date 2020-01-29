import dataPrepFunctions from "./dataPrepFunctions";
import records from "../data/rec.csv";
import aggregateDate from "./aggregateData.js";
import Papa from "papaparse";

export default async function prepareData(setState) {
  //pull csv data into the app
  let asSingleEntries = [];
  const csvData = await dataPrepFunctions.fetchCsv(records);

  //use papaparse library to convert csvData into an array of objects. Each header becomes a key.
  let parsedData = await Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });

  //why can't I just map??
  parsedData = parsedData.data
  parsedData.map(item => {
    Object.keys(item).forEach(key => {
      if (item[key]) {
        if (key !== "Timestamp") {
          const singleValue = item[key].split(",");
          for (const val of singleValue) {
            asSingleEntries.push({
              category: key,
              categoryValue: val.trim(),
              timestamp: item.Timestamp
            });
          }
        }
      }
    });
  });



  aggregateDate(setState, asSingleEntries, parsedData);
}
