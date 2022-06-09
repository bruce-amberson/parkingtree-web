import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import moment from 'moment';

import {
  DatePicker,
} from '@frontend/common';

import {
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

export class DatePickerInput extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    inputFocus: PropTypes.bool,
    labelText: PropTypes.string,
    inputFullWidth: PropTypes.bool,
    autoComplete: PropTypes.string, // expected val is 'on' or 'off'
    className: PropTypes.string,
    style: PropTypes.object,

    // minDate: PropTypes.string,
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    openToYear: PropTypes.bool,
  };

  state = {
    val: null,
    inputIndex: undefined,
    isError: undefined,
    helperMsg: ''
  };

  componentDidMount() {
    const { inputName, isRequired } = this.props;
    const inputIndex = addInput({ inputName, isRequired });
    this.setState({ inputIndex });
  }

  componentDidUpdate() {
    const { inputName } = this.props;
    const list = cloneDeep(window.singleForm.inputList);

    if (list.length > 0) {
      const curInput = list[this.state.inputIndex];
      if (curInput && curInput.update && curInput.inputName === inputName && curInput.val !== undefined) {
        const e = { target: { value: curInput.val }, type: 'update' };
        this.inputChange(e);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        delete curInput.delete;
        const e = { target: { value: '' }, type: 'update' };
        this.inputChange(e);
      }
    }
  }

  render() {
    const { 
      inputName, labelText, isDisabled, isReadOnly,
      inputFullWidth, className, style, inputFocus,
      minDate, maxDate, openToYear,
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;
    
    return (
      <DatePicker
        key={inputName}
        error={isError || helperErrorManage(inputName, inputIndex)}
        helperText={helperMsg || helperTextManage(inputName, inputIndex)}
        readOnly={isReadOnly} // disables calendar date picker
        inputProps={{ readOnly: isReadOnly }} // disables text input for date
        disabled={isDisabled}
        fullWidth={inputFullWidth}
        autoFocus={inputFocus || false}
        label={labelText}
        minDate={minDate ? moment(minDate) : undefined}
        maxDate={maxDate ? moment(maxDate) : undefined}
        onChange={date => this.inputChange({ target: { value: date }, type: 'change' })}
        value={val || null}
        openTo={openToYear} // regardless of what string is put in, it opens to year, otherwise opens on current month.
        className={className}
        style={style}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    );
  }

  inputChange = e => {
    let val = e.target.value || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName, isRequired, minDate, maxDate, } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = !isRequired;
    let inputVal = '';
    const min = moment(minDate).format('MM/DD/YYYY');
    const max = moment(maxDate).format('MM/DD/YYYY');

    if (val.length === 0) {
      isValid = false;
      val = undefined;
    }
    else if (!moment(val).isValid()) {
      isError = true;
      helperMsg = 'Please enter a valid Date';
    }
    else if (minDate && maxDate && (moment(val).isAfter(moment(maxDate), 'day') || moment(val).isBefore(moment(minDate), 'day'))) {
      isError = true;
      helperMsg = `Date must be between ${min} and ${max}.`;
    }
    else if (minDate && !maxDate && moment(val).isBefore(moment(minDate), 'day')) {
      isError = true;
      helperMsg = `Date must be on or after ${min}`;
    }
    else if (maxDate && !minDate && moment(val).isAfter(moment(maxDate), 'day')) {
      isError = true;
      helperMsg = `Date must be on or before ${max}`;
    }
    else {
      isValid = true;
      inputVal = val;
    }
    this.setState(
      { val: inputVal, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );
  }
  
}

export default DatePickerInput;