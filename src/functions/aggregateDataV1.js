import moment from "moment";
export default function aggregateDataV1(
  parsedData
) {

  if (!Array.prototype.flat) {
    Array.prototype.flat = function() { return [].concat(...this) }
  }

  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(f) { return this.map(f).flat() }
  }

  const simpleParse = csv => csv.split(',').map(str => str.trim())

  const ignoreCategories = ['', 'Timestamp']

  const formatTime = timestamp => moment(timestamp, 'MM/DD/YYYY HH:mm:ss a')
        .format('YYYY-MM-DD HH:mm:ss')

  const categories = data => {
    const cs = new Set(data.flatMap(Object.keys))
    ignoreCategories.forEach(x => cs.delete(x))
    return cs
  }

  console.log('parsedData', parsedData)
  console.log('categories', categories(parsedData))

  const aggregate = data => {
    const template = [...categories(data)]
          .reduce((o, category) => (
            {
              ...o,
              [category]: {}
            }
          ), {})
    return data.reduce(aggregateRow, template)
  }

  const aggregateRow = (agg, row) => {
    const timestamp = formatTime(row.Timestamp)
    
    return Object.entries(row)
      .reduce(aggregateEntry(timestamp), agg)
  }

  const aggregateEntry = timestamp => (agg, [category, csv]) => {
    if (ignoreCategories.includes(category)) return agg

    const values = simpleParse(csv)

    const oldRecord = agg[category]
    const newRecord = values
          .filter(v => v !== '')
          .reduce((rec, value) => (
            {
              ...rec,
              [value]: [...(rec[value] || []), timestamp]
            }
          ), oldRecord)

    return {
      ...agg,
      [category]: newRecord
    }
  }

  return aggregate(parsedData)

}
