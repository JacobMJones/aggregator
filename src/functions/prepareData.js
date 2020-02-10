import dataPrepFunctions from "./dataPrepFunctions";
import records from "../../src/data/rec.csv";
import aggregateDate from "./aggregateData.js";
import Papa from "papaparse";
import moment from 'moment';
export default async function prepareData(setState) {
  //pull csv data into the app
  let asSingleEntries = [];
  const csvData = await dataPrepFunctions.fetchCsv(records);

  //use papaparse library to convert csvData into an array of objects. Each header becomes a key.
  //Papa returns an object , data key contains what we want

  let papaObject = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });

  const parsedData = papaObject.data;

  /* Creates asSingleEnteries
  [{
    category:categoryValue
    'Timestamp': time as a string
  }] */
  parsedData.map((item, index) => {
   const time =  moment(item.Timestamp, 'MM/DD/YYYY HH:mm:ss a').format('YYYY-MM-DD HH:mm:ss')
   console.log(index)
    Object.keys(item).forEach(key => {
      if (item[key]) {
        if (key !== "Timestamp") {
          const singleValue = item[key].split(",");
          for (const val of singleValue) {
            asSingleEntries.push({
              category: key,
              categoryValue: val.trim(),
              timestamp: time
            });
          }
        }
      }
    });
  });

  aggregateDate(setState, asSingleEntries, parsedData);
}
