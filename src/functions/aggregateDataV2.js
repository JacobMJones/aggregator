import moment from "moment";
export default function aggregateDataV2(
  parsedData
) {

  const sampleData = [
    {
      "Timestamp": "1/1/2020 14:53:40",
      "Daily Routine": "",
      "Mind Healthy": "",
      "Distractions": "",
      "Eat": "sugar, junk carb, vegetable, cheese",
      "": "",
      "Healthy": ""
    },
    {
      "Timestamp": "12/31/2019 12:07:15",
      "Daily Routine": "enter home",
      "Mind Healthy": "",
      "Distractions": "",
      "Eat": "meat, vegetable, cheese, dairy",
      "": "",
      "Healthy": "stop walk"
    },
    {
      "Timestamp": "12/31/2019 18:01:00",
      "Daily Routine": "",
      "Mind Healthy": "",
      "Distractions": "start video",
      "Eat": "",
      "": "",
      "Healthy": ""
    }
  ]

  const sampleIntermediate = [
    {category: 'Eat', subCategory: 'sugar', timestamp: '1/1/2020 14:53:40'},
    {category: 'Eat', subCategory: 'junk carb', timestamp: '1/1/2020 14:53:40'},
    {category: 'Eat', subCategory: 'vegetable', timestamp: '1/1/2020 14:53:40'},
    {category: 'Eat', subCategory: 'cheese', timestamp: '1/1/2020 14:53:40'},
    {category: 'Daily Routine', subCategory: 'start work', timestamp: '2019-12-31 08:24:57'},
    {category: 'Daily Routine', subCategory: 'start work', timestamp: '2020-01-02 06:29:57'},
    {category: 'Mind Healthy', subCategory: 'start journal', timestamp: '2020-01-03 07:05:03'},
    {category: 'Mind Healthy', subCategory: 'start journal', timestamp: '2020-01-06 06:00:31'},
  ]

  const sampleOutput = {
    "Daily Routine": {
      "start work": [
        "2019-12-31 08:24:57",
        "2020-01-02 06:29:57",
      ],
    },
    "Mind Healthy": {
      "start journal": [
        "2020-01-03 07:05:03",
        "2020-01-06 06:00:31",
        "2020-01-09 07:16:44"
      ],
      "stop journal": [
        "2020-01-03 07:25:26",
        "2020-01-06 07:04:04",
        "2020-01-09 07:38:16",
        "2020-01-20 06:39:57"
      ],
    },
    "Eat": {
      "meat": [
        "2019-12-31 12:07:15",
        "2020-01-02 11:22:26",
      ],
      "vegetable": [
        "2019-12-31 12:07:15",
      ],
    }
  }

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

  const buildIntermediate = data => {
    return data.reduce(expandRow, [])
  }

  const expandRow = (intermediateRows, dataRow) => {
    const timestamp = formatTime(dataRow.Timestamp)
    const rows = Object.entries(dataRow)
          .flatMap(expandEntry(timestamp))
    return [...intermediateRows, ...rows]
  }

  const expandEntry = timestamp => ([category, subCategoriesCSV]) => {
    if (ignoreCategories.includes(category)) return []
    
    return simpleParse(subCategoriesCSV)
      .filter(subCategory => subCategory !== '')
      .map(subCategory => ({category, subCategory, timestamp}))
  }

  console.log('intermediate', buildIntermediate(sampleData))

  const aggregateByCategory = intermediateData => {
    return intermediateData.reduce(aggregateIntermediateRow, {})
  }

  const aggregateIntermediateRow = (aggregate, {category, subCategory, timestamp}) => {
    const subCategories = aggregate[category] || {}
    const timestamps = subCategories[subCategory] || []

    return {
      ...aggregate,
      [category]: {
        ...subCategories,
        [subCategory]: [
          ...timestamps,
          timestamp
        ] 
      }
    }
  }

  console.log('aggregateByCategory', aggregateByCategory(buildIntermediate(sampleData)))

  return aggregateByCategory(buildIntermediate(parsedData))
}
