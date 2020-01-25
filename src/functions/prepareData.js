import dataPrepFunctions from "./dataPrepFunctions";
import time from "../data/records.csv";
import aggregateDate from "./aggregateData.js"
import Papa from "papaparse";

export default async function prepareData(setState) {

  //pull csv data into the app
  const csvData = await dataPrepFunctions.fetchCsv(time);

  //use papaparse library to convert csvData into an array of objects. Each header becomes a key.
  let parsedData = await Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });
console.log('parsed data', parsedData)
  //removes unneeded keys returned by papa parse --bad comment
  parsedData = await parsedData.data;

  //Set data to be aggregated
  aggregateDate(setState, parsedData)
}
