import { cloneDeep } from 'lodash';

export function sortAscending(dataArray, property) {
  const clonedData = cloneDeep(dataArray);

  return clonedData.sort((data1, data2) => {
    let value1 = data1[property];
    let value2 = data2[property];

    if (value1 == null || value2 === null) {
      if (value1 < value2) {
        return -1;
      }
      else if (value1 > value2) {
        return 1;
      }
      return 0;
    }

    else if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 - value2;
    }

    else if (value1 instanceof Date && value2 instanceof Date) {
      return value1 - value2;
    }

    else if (value1.substring(0, 2).includes('$') && value2.substring(0, 2).includes('$')) {
      /* eslint-disable no-useless-escape */
      let value1Num = Number(value1.split('$')[1].replace(/[^0-9\.\--]+/g,''));
      let value2Num = Number(value2.split('$')[1].replace(/[^0-9\.\--]+/g,''));
      /* eslint-enable no-useless-escape */

      if (value1.substring(0, 2).includes('-')) {
        value1Num = value1Num * -1;
      }

      if (value2.substring(0, 2).includes('-')) {
        value2Num = value2Num * -1;
      }

      return value1Num - value2Num;
    }

    else if (property.toLowerCase() === 'accountnumber') {
      const value1AccountYear = parseInt(value1.slice(0, 4));
      const value2AccountYear = parseInt(value2.slice(0, 4));
      const value1AccountId = parseInt(value1.slice(4, value1.length));
      const value2AccountId = parseInt(value2.slice(4, value2.length));

      if (value1AccountYear - value2AccountYear === 0) {
        return value1AccountId - value2AccountId;
      }
      else {
        return value1AccountYear - value2AccountYear;
      }
    }

    else {
      value1 = value1.toLowerCase();
      value2 = value2.toLowerCase();

      if (value1 < value2) {
        return -1;
      }
      else if (value1 > value2) {
        return 1;
      }
      return 0;
    }
  });
}

export function sortDescending(dataArray, property) {
  const clonedData = cloneDeep(dataArray);

  return clonedData.sort((data1, data2) => {
    let value1 = data1[property];
    let value2 = data2[property];

    if (value1 == null || value2 === null) {
      if (value1 < value2) {
        return 1;
      }
      else if (value1 > value2) {
        return -1;
      }
      return 0;
    }

    else if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value2 - value1;
    }

    else if (value1 instanceof Date && value2 instanceof Date) {
      return value2 - value1;
    }

    else if (value1.substring(0, 2).includes('$') && value2.substring(0, 2).includes('$')) {
      /* eslint-disable no-useless-escape */
      let value1Num = Number(value1.split('$')[1].replace(/[^0-9\.\--]+/g,''));
      let value2Num = Number(value2.split('$')[1].replace(/[^0-9\.\--]+/g,''));
      /* eslint-enable no-useless-escape */

      if (value1.substring(0, 2).includes('-')) {
        value1Num = value1Num * -1;
      }

      if (value2.substring(0, 2).includes('-')) {
        value2Num = value2Num * -1;
      }

      return value2Num - value1Num;
    }

    else if (property.toLowerCase().includes('accountnumber')) {
      const value1AccountYear = parseInt(value1.slice(0, 4));
      const value2AccountYear = parseInt(value2.slice(0, 4));
      const value1AccountId = parseInt(value1.slice(4, value1.length));
      const value2AccountId = parseInt(value2.slice(4, value2.length));

      if (value1AccountYear - value2AccountYear === 0) {
        return value2AccountId - value1AccountId;
      }
      else {
        return value2AccountYear - value1AccountYear;
      }
    }

    else {
      value1 = value1.toLowerCase();
      value2 = value2.toLowerCase();

      if (value1 < value2) {
        return 1;
      }
      else if (value1 > value2) {
        return -1;
      }
      return 0;
    }
  });
}
