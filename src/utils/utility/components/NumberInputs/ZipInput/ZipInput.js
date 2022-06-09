import React from 'react';
import BaseNumberInput from '../BaseNumberInput';

function ZipInput(props) {
  return (
    <BaseNumberInput
      inputProps={{
        format: '##### ####'
      }}
      {...props}
    />
  );
}
BaseNumberInput.extendProps(ZipInput);

export default ZipInput;
