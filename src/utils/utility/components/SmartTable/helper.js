import moment from 'moment';
import { cloneDeep, find, isEmpty, } from 'lodash';
import Fuse from 'fuse.js';
import { currencyFormatter } from '../../helpers/numbers';
import * as types from './constants';


export function dataFormat(value, type, removeCommas = false) {
  let formattedValue;
  switch (type) {
    case types.DATE:
    case types.DATE_STRING:
      formattedValue = new Date(value);
      formattedValue = value ? formattedValue.toISOString() : null;
      formattedValue = formattedValue ? moment(formattedValue).format('MM/DD/YYYY') : null;
      break;
    case types.DATE_TIME:
      formattedValue = new Date(value);
      formattedValue = value ? formattedValue.toISOString() : null;
      formattedValue = formattedValue ? moment(formattedValue).format('MM/DD/YYYY hh:mm:ss A') : null;
      break;
    case types.CURRENCY:
      formattedValue = value === null || value === undefined ? null : currencyFormatter(value);
      formattedValue = removeCommas ? formattedValue.replace(/,/g,'') : formattedValue;
      break;
    default:
      formattedValue = value;
  }
  
  return formattedValue;
}

export function dataSort(direction, column, data, isSearchResults = false) {
  const sortedData = cloneDeep(data);
  
  if (direction) {
    const isAscending = direction === types.ASCENDING;

    sortedData.sort((data1, data2) => {
      let value1 = data1[column.key];
      let value2 = data2[column.key];

      const endArray = [null, undefined, ''];
      if (endArray.includes(value1) && endArray.includes(value2)) {
        if (value1 === null && value2 !== null) {
          return 1;
        }
        else {
          return -1;
        }
      }
      if (endArray.includes(value1)) return 1;
      if (endArray.includes(value2)) return -1;

      switch (column.type) {

        case types.DATE_STRING:
        case types.STRING: {
          value1 = value1.toLowerCase();
          value2 = value2.toLowerCase();
          if (value1 < value2) {
            return isAscending ? -1 : 1;
          }
          else if (value1 > value2) {
            return isAscending ? 1 : -1;
          }
          return 0;
        }
        case types.DATE_TIME:
        case types.DATE:

          value1 = Date.parse(value1);  
          value2 = Date.parse(value2); 
          if (value2 > value1) {
            return isAscending ? -1 : 1;
          }
          else if (value2 < value1) {
            return isAscending ? 1 : -1;
          }
          return 0;
        case types.CURRENCY:
        case types.NUMBER: {
          if (isAscending) {
            return value1 - value2;
          }

          return value2 - value1;
        }

        case types.BOOLEAN: {
          if (value1 && !value2) {
            return isAscending ? -1 : 1;
          }
          else if (value2 && !value1) {
            return isAscending ? 1 : -1;
          }
          
          return 0;
        }

        default:
          return 0;
      }
    });
  }
  else if (isSearchResults) {
    // sort data by ascending search results scores
    sortedData.sort((data1, data2) => data1.searchScore - data2.searchScore);
  }
  
  return sortedData;
}

export function dataFilter(data, columns, idKey, term) {
  const formattedData = cloneDeep(data);
  const splitTerm = term.split(':').map(val => val.trim()); 
  let searchColumn = null;
  if (splitTerm.length > 1) {
    const column = find(columns, column => column.title.toLowerCase() === splitTerm[0].toLowerCase());
    if (column) searchColumn = column.key;
  }
  // remove commas then replaces white space between words with +
  const searchTerm = splitTerm[splitTerm.length - 1].replace(/,/g,'').replace(/ /g,'+');
  
  const fuseConfig = {
    tokenize: true,
    findAllMatches: true,
    shouldSort: true,
    maxPatternLength: 100,
    minMatchCharLength: 1,
    threshold: 0.2, // level of matching score needed to be included as a result
    location: 0, // tries to look at start of text string first
    distance: 75,
    keys: searchColumn ? [searchColumn] : columns.map(column => ({
      name: column.key,
      weight: column.weight || 1,
    })),
    includeScore: true,
    includeMatches: true, // provides array with index places of text that is matched
  };

  if (searchTerm.length > 0) {
    const fuse = new Fuse(formattedData, fuseConfig);
    const results = fuse.search(searchTerm);
    
    formattedData.forEach(row => {
      const matchedRow = results.find(matchedRow => matchedRow.item[idKey] === row[idKey]) || {};
      row.filtered = !isEmpty(matchedRow);
      row.searchScore = !isEmpty(matchedRow) ? matchedRow.score : null;
    });

    const sortedSearchData = dataSort(null, null, formattedData, true);
    
    return sortedSearchData;
  }
  else {
    formattedData.forEach(row => row.filtered = true);
    return formattedData;
  }
}