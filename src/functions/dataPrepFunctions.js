import dataPrepFunctions from "./dataPrepFunctions";

export default {
  onlyUnique: function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  },

  fetchCsv: async function fetchCsv(csv)  {
    return  fetch(csv).then(async function(response) {

      let reader = await response.body.getReader();
      let decoder = new TextDecoder("utf-8");

      let charsReceived = 0;
      let result = '';

      // read() returns a promise that resolves
      // when a value has been received
      return reader.read().then(function processText({ done, value }) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
          const x = result
                .split(',')
                .map(Number)
                .reduce((acc, b) => acc + String.fromCharCode(parseInt(b, 10)), '')
          console.log(x)
          return x;
        }

        // value for fetch streams is a Uint8Array
        charsReceived += value.length;
        const chunk = value;
        result += chunk;

        // Read some more, and call this function again
        return reader.read().then(processText);
      });
      
      // return reader.read().then(async function(result) {
      //   return await decoder.decode(result.value);
      // });
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
      
      date && data.push({ date: date, records: records });

      //clear records array for the next day
      records = [];
    }
    return data;
  }
};
