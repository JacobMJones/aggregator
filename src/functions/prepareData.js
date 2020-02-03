import dataPrepFunctions from "./dataPrepFunctions";
import records from "../../src/data/rec.csv"
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
  console.log(parsedData)
  aggregateDate(setState, asSingleEntries, parsedData);
}
// let gArray = [];
// let jArray = [];


//   const arthurData = await dataPrepFunctions.fetchCsv(gj)
//   console.log(arthurData)
//   let parsedArthur = await Papa.parse(arthurData, {
//     header: true,
//     skipEmptyLines: true
//   });

//   parsedArthur = parsedArthur.data
//   console.log(parsedArthur)
//   parsedArthur.map(item=>{
//    gArray.push(item.Garry)
//    jArray.push(item.Jacob)
//   })

//   let difference = gArray.filter(x => !jArray.includes(x));
// let jIntersection = difference.filter(x => jArray.includes(x) )
// let gIntersection = difference.filter(x => gArray.includes(x) )
//   console.log(difference)
//   console.log(jIntersection)
//   console.log(gIntersection)