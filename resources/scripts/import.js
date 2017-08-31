/**
 * Import script for restaurants dataset
 *
 * - Reads CSV and JSON data files provided
 * - Merges matching restaurant data found in each file using objectID
 * - Divides data into chunks for batched uploading
 * - Adds data to Algolia 'restaurants' index
 */

require('dotenv').config();

const util = require('util');
const fs = require('fs');
const path = require('path');
const csv = require('csv');
const algoliasearch = require('algoliasearch');

const readFile = util.promisify(fs.readFile);
const csvParse = util.promisify(csv.parse);

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_ADMIN_KEY;
const client = algoliasearch(appId, apiKey);
const index = client.initIndex('restaurants');

const restaurantsInfo = path.join(__dirname, '../dataset/restaurants_info.csv');
const restaurantsList = path.join(__dirname, '../dataset/restaurants_list.json');

/**
 * Read CSV file and return parsed data
 *
 * @param  {string} file      Path to file
 * @param  {object} options   Options for the CSV parser
 * @return {array}            Parsed data
 */
const getCSVData = async (file, options) => {
  console.log(`Reading CSV file - ${path.basename(file)}`);

  const raw = await readFile(file, 'utf8');

  console.log(`Parsing CSV file - ${path.basename(file)}`);

  const parsed = await csvParse(raw, Object.assign({
    columns: true, // adds field names as object keys
    auto_parse: true, // convert input string to native types
  }, options));

  return parsed;
};

/**
 * Read JSON file and return parsed data
 *
 * @param  {string} file Path to file
 * @return {array}       Parsed data
 */
const getJSONData = async (file) => {
  console.log(`Reading JSON file - ${path.basename(file)}`);

  const raw = await readFile(file, 'utf8');

  return JSON.parse(raw);
};

/**
 * Accepts two arrays of objects and returns array containing objects
 * which have been merged where a matching objectID value was found
 *
 * @param  {array} array1
 * @param  {array} array2
 * @return {array}
 */
const mergeArrays = (array1, array2) => {
  const merged = array1.map(a => {
    const idx = array2.findIndex(b => a.objectID === b.objectID);
    return Object.assign(a, array2[idx]);
  });

  return merged;
};

/**
 * Split an array into chunks with each chunk length <= size value
 *
 * @param  {array}  array Original array
 * @param  {number} size  Chunk length
 * @return {array}        Chunked array
 */
const chunkArray = (array, size) => {
  const chunked = [];

  while(array.length) {
    chunked.push(array.splice(0, size));
  }

  return chunked;
}

/**
 * Init
 */
const init = async () => {
  try {
    // Get data from CSV and JSON files
    const [listArray, infoArray] = await Promise.all([
      getJSONData(restaurantsList),
      getCSVData(restaurantsInfo, { delimiter: ';' }),
    ]);

    // Get one array of objects which have been merged where object IDs match
    const merged = mergeArrays(listArray, infoArray);

    console.log(`Found ${merged.length} restaurants`);

    // Divide into chunks because Algolia addObjects requires smaller batches
    const chunkSize = 200;
    const chunked = chunkArray(merged, chunkSize);

    // Loop through chunks and add objects to Algolia index
    for (let i = 0; i < chunked.length; i++) {
      console.log(`Adding restaurants ${i * chunkSize}-${i * chunkSize + chunkSize}`);

      const result = await index.addObjects(chunked[i]);

      console.log(`Added ${result.objectIDs.length} restaurants (TaskID ${result.taskID})`);
    }

    console.log(`Finished!`);
  } catch (e) {
    console.log(e);
  }
};

init();
