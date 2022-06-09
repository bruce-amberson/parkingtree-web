/*
*
* New(er) filter method
* can search using out of order words and will return relevant results
*
*/
import { dateTimeStringFormat } from './dates';


export function dataValueFormat(value) {
  let formattedValue = null;

  if (value instanceof Date) {
    formattedValue = dateTimeStringFormat(value);
  }
  else {
    formattedValue = value;
  }

  if (typeof formattedValue === 'string') {
    formattedValue = formattedValue.toLowerCase();
  }
  else if (formattedValue === null) {
    formattedValue = '';
  }
  else {
    formattedValue = formattedValue.toString();
  }

  return formattedValue;
}

export function searchTermFormat(term) {
  let formattedTerm = null;

  if (typeof term === 'number') {
    formattedTerm = term.toString();
  }
  else {
    formattedTerm = term;
  }

  return formattedTerm.toLowerCase();
}

export function searchTermMatchesValue(searchTerms, mashedCompareString) {
  let matched = false;

  searchTerms.some(searchTerm => {
    if (mashedCompareString.includes(searchTerm)) {
      matched = true;
      return false;
    }
    else {
      matched = false;
      return true;
    }
  });

  return matched;
}


// Filters all the data submitted in the dataArray
export function filter(term, dataArray) {

  if (term.length < 1) {
    return dataArray;
  }
  else {
    const filteredData = [];
    const searchTermWords = searchTermFormat(term).split(' ');

    dataArray.forEach(dataObject => {

      const mashedValueStrings = [];

      for (const key in dataObject) {
        const formattedValue = dataValueFormat(dataObject[key]);
        mashedValueStrings.push(formattedValue.split(' ').join(''));
      }

      if (searchTermMatchesValue(searchTermWords, mashedValueStrings.join(''))) {
        filteredData.push(dataObject);
      }
    });

    return filteredData;
  }
}


// Filters only by the values passed in as a tableHeaders object (i.e. tableDataHeaders on tables)
export function filterBy(term, dataArray, tableHeaders) {

  if (term.length < 1) {
    return dataArray;
  }
  else {
    const filteredData = [];
    const formattedSearchTerms = searchTermFormat(term);
    let searchTermWords = [];
    let filterByValues = Object.keys(tableHeaders).map(key => tableHeaders[key]);

    if (formattedSearchTerms[0] === '"' && formattedSearchTerms[formattedSearchTerms.length - 1] === '"') {
      searchTermWords = [formattedSearchTerms.replace(/\s/g, '').replace(/"/g, '')];
    }
    else if (formattedSearchTerms.includes(':')) {
      const splitSearchTerm = formattedSearchTerms.split(':');
      const columnName = splitSearchTerm[0].trim().toLowerCase();
      const lowerCaseTableHeaders = {};

      Object.keys(tableHeaders).forEach(key => {
        lowerCaseTableHeaders[key.toLowerCase()] = tableHeaders[key];
      });

      const columnSearchTerms = splitSearchTerm[1].trim();
      if (columnSearchTerms[0] === '"' && columnSearchTerms[columnSearchTerms.length - 1] === '"') {
        searchTermWords = [columnSearchTerms.replace(/\s/g, '').replace(/"/g, '')];
      }
      else {
        searchTermWords = columnSearchTerms.split(' ');
      }

      filterByValues = [lowerCaseTableHeaders[columnName]];
    }
    else {
      searchTermWords = formattedSearchTerms.split(' ');
    }

    dataArray.forEach(dataObject => {

      const mashedValueStrings = [];

      filterByValues.forEach(filterValue => {
        if (dataObject[filterValue] !== undefined) {
          const formattedFilterValue = dataValueFormat(dataObject[filterValue]).replace(/[\W_]/g, '');
          mashedValueStrings.push(formattedFilterValue.split(' ').join(''));
        }
      });

      if (searchTermMatchesValue(searchTermWords, mashedValueStrings.join(''))) {
        filteredData.push(dataObject);
      }
    });

    return filteredData;
  }
}
