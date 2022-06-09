/*
*
* Checkbox
*
*/
import React from 'react';
import {
  Checkbox as MaterialCheckbox,
  FormControlLabel,
} from '@material-ui/core';


export class Checkbox extends React.Component {
  render() {
    return (
      <FormControlLabel
        control={
          <MaterialCheckbox
            {...this.props}
          />
        }
        {...this.props}
      />
    );
  }
}

export default Checkbox;
