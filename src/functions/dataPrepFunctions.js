import dataPrepFunctions from "./dataPrepFunctions";

export default {
  onlyUnique: function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  },

  fetchCsv: function fetchCsv(csv) {
    return fetch(csv).then(function(response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder("utf-8");
      return reader.read().then(function(result) {
        return decoder.decode(result.value);
      });
    });
  },
  extractDays: function extractDays(parsedData) {
    const data = [];
    let records = [];

    //strips time information from dates
    const datesOnly = parsedData.map(item => {
      return item.Timestamp.substr(0, item.Timestamp.indexOf(" "));
    });

    const datesNoDuplicates = datesOnly.filter(dataPrepFunctions.onlyUnique);
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
    return data;
  }
};
