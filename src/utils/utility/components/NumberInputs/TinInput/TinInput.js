import React from 'react';
import BaseNumberInput from '../BaseNumberInput';

function TinInput(props) {
  return (
    <BaseNumberInput
      inputProps={{
        format: '##-#######',
        mask: '_',
      }}
      {...props}
    />
  );
}
BaseNumberInput.extendProps(TinInput);

export default TinInput;