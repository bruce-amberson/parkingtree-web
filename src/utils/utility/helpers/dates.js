// Turns a Date/Time string from server to Javscript Date object.
export function dateTimeStringSplit(dateTimeString) {
  if (dateTimeString) {
    if (dateTimeString.split('T').length > 1) {
      const dateArray = dateTimeString.split('T')[0].split('-');
      const timeArray = dateTimeString.split('T')[1].split(':');
      timeArray[2] = timeArray[2].slice(0, 2); // cuts off occasional 'Z' at the end of the time stamp
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2]);
    }
    else {
      let dateArray = dateTimeString.split('T')[0].split('-');
      if (dateArray.length === 1) {
        dateArray = dateArray[0].split('/');
        return new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
      }
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    }
  }
}

// Formats a Date object for posting to servers
export function dateTimeStringFormat(date) {
  return (
    `${singleDigitNumberFormat(date.getMonth() + 1)}`
    + `/${singleDigitNumberFormat(date.getDate())}`
    + `/${date.getFullYear()}`
  );
}

// Formats a Date object to a nice date string (MM/DD/YY)
export function dateFormat(date) {
  if (date) {
    const year = date.getFullYear().toString();
    return `${date.getMonth() + 1}/${date.getDate()}/${year.slice(2)}`;
  }
  else {
    return null;
  }
}

// Formats a Date object to a nice time string (HH:MM AM)
export function timeFormat(date) {
  if (date) {
    let hour = date.getHours();
    const minutes = date.getMinutes();
    let period;

    if (hour <= 11) {
      if (hour < 1) {
        hour = 12;
      }
      period = 'AM';
    }
    else if (hour === 12) {
      period = 'PM';
    }
    else if (hour > 12) {
      hour -= 12;
      period = 'PM';
    }

    return `${singleDigitNumberFormat(hour)}:${singleDigitNumberFormat(minutes)} ${period}`;
  }
}

// Adds a '0' to a number that is a single digit
function singleDigitNumberFormat(num) {
  if (num < 10) {
    return `0${num}`;
  }

  return num;
}
