import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/smartForm/helper';

export class EmailInput extends Component {

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

    disableErrors: PropTypes.bool,
  };

  state = {
    val: '',
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
    const list = window.smartForm.inputList;
    if (list.length > 0) {
      const curInput = list[this.state.inputIndex];
      if (curInput && curInput.update && curInput.inputName === inputName && curInput.val !== undefined) {
        const e = { target: { value: curInput.val || '' }, type: 'update' };
        this.emailValidator(e);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        delete curInput.delete;
        const e = { target: { value: '' }, type: 'update' };
        this.emailValidator(e);
      }
    }
  }

  render() {
    const { 
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;
    
    return (
      <TextField
        name={inputName}
        value={val}
        label={labelText}
        disabled={isDisabled}
        helperText={helperMsg || helperTextManage(inputName, inputIndex)}
        error={isError || helperErrorManage(inputName, inputIndex)}
        autoFocus={inputFocus || false}
        fullWidth={inputFullWidth || false}
        autoComplete={autoComplete || 'on'}
        style={style}
        className={className}
        variant='filled'
        onChange={e => this.emailValidator(e)}
        inputProps={{
          maxLength: 128
        }}
        InputProps={{
          readOnly: isReadOnly,
        }}
        key={inputName}
      />
    );
  }

  emailValidator = e => {
    let val = e.target.value.trimStart() || '';
    const { inputName } = this.props;

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven
    
    /*
    Email validation rules - must match backend validation
    
    All alphanumeric characters allowed

    character: _
      1) can only appear on the left side of the @ sign
      
    character: +
      1)  can only appear on left side of @ sign
      2)  can have multiple
      3)  cannot be consecutive
      4)  cannot appear immediately before @
      
    character: -
      1)  can appear on right or left side of @
      2)  can have multiple
      3)  cannot be consecutive
      4)  cannot appear immediately before or after @

    character: .
      1)  can appear on right or left side of @
      2)  can have multiple
      3)  cannot be consecutive
      4)  cannot appear immediately before or after @
      5)  at least one must appear on right side of @
      
    character: '
      1)  can only appear on left side of @ sign
      2)  can have multiple
      3)  cannot be consecutive
      4)  cannot appear immediately before @

    character: @
      1) only one is allowed.
      2) there must be valid text to the right and left of @
    */

    const emailRegex = /^\w+([-+_.']\w+)*@[A-Za-z0-9]+([-.][A-Za-z0-9]+)*\.[A-Za-z0-9]+([-.][A-Za-z0-9]+)*$/;
    
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;
    let inputVal = '';
    
    if (val.length === 0 && !emailRegex.test(val)) {
      val = undefined;
      inputVal = '';
    }
    else if (val.length > 0 && !emailRegex.test(val) && !this.props.disableErrors) {
      helperMsg = 'Please provide a valid Email Address';
      isError = true;
      isValid = false;
      inputVal = val;
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

export default EmailInput;