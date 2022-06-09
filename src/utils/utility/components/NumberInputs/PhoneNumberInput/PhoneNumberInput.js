import React from 'react';
import BaseNumberInput from '../BaseNumberInput';
import PropTypes from 'prop-types';

function PhoneNumberInput(props) {
  const isintl = props.isintl.toString() === 'true';

  if (isintl) { // returns international format as it came back from API
    const num = props.value.replace(/[0-9]/g, '#');
    return (
      <BaseNumberInput
        inputProps={{
          format: num,
        }}
        {...props}
      />
    );
  }
  else { // returns US format
    return (
      <BaseNumberInput
        inputProps={{
          format: '(###) ###-####',
          mask: '_',
        }}
        {...props}
      />
    );
  }
}
BaseNumberInput.extendProps(PhoneNumberInput);

export default PhoneNumberInput;

PhoneNumberInput.propTypes = {
  isintl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  value: PropTypes.string
};