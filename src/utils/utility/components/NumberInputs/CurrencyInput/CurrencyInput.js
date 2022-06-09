/* eslint-disable react/prop-types */
import React from 'react';
import { InputAdornment } from '@material-ui/core';
import BaseNumberInput from '../BaseNumberInput';

function CurrencyInput(props) {
  return (
    <BaseNumberInput
      inputProps={{
        decimalScale: 2,
        fixedDecimalScale: true,
        thousandSeparator: true,
        allowNegative: false,
        value: props.value === 0 ? '' : props.value, // empties the input so user doesn't have to remove 0
      }}
      InputProps={{
        startAdornment: <InputAdornment position='start'>$</InputAdornment>
      }}
      {...props}
    />
  );
}
BaseNumberInput.extendProps(CurrencyInput);

export default CurrencyInput;
