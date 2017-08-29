import algoliasearch from 'algoliasearch';

const APP_ID = 'IB8J29SC3C';
const API_KEY = 'd81d5bb3965f15e54ef988f3ac864f58';

const searchClient = algoliasearch(APP_ID, API_KEY);

const searchIndex = 'restaurants';

const searchFacets = ['food_type', 'payment_options'];

const searchPaymentOptions = ['amex', 'visa', 'discover', 'mastercard'];

const searchHelperOptions = {
  facets: searchFacets,
  maxValuesPerFacet: 10,
  hitsPerPage: 10,
};

export {
  searchClient,
  searchIndex,
  searchFacets,
  searchPaymentOptions,
  searchHelperOptions
};
