import React from 'react';
import BaseNumberInput from '../BaseNumberInput';

function SsnInput(props) {
  return (
    <BaseNumberInput
      inputProps={{
        format: '###-##-####',
        mask: '_',
      }}
      {...props}
    />
  );
}
BaseNumberInput.extendProps(SsnInput);

export default SsnInput;
