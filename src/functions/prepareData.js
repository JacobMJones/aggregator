import dataPrepFunctions from "./dataPrepFunctions";
import records from "../data/records.csv";
import aggregateDate from "./aggregateData.js"
import Papa from "papaparse";

export default async function prepareData(setState) {

  //pull csv data into the app
  const csvData = await dataPrepFunctions.fetchCsv(records);

  //use papaparse library to convert csvData into an array of objects. Each header becomes a key.
  let parsedData = await Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });

  //Send data to be aggregated
  console.log(parsedData.data)
  aggregateDate(setState, parsedData.data)
}
