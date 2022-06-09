/*
*
* DatePicker
*
*/
import React from 'react';

import MomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import Tooltip from '@material-ui/core/Tooltip';
import { 
  Icon, 
} from '@material-ui/core';

export function DatePicker(props) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        format='MM/DD/YYYY'
        autoOk={true}
        clearable={true}
        keyboardIcon={
          <Tooltip 
            placement='bottom' 
            aria-label='Change date' 
            title='Change date'
            PopperProps={{
              popperOptions: {
                modifiers: {
                  offset: { // offsetting to make the tip distance to look like IconBtnTooltip
                    enabled: true,
                    offset: '0, 10px',
                  },
                },
              },
            }}
          >
            <Icon>insert_invitation</Icon>
          </Tooltip>
        }
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePicker;
