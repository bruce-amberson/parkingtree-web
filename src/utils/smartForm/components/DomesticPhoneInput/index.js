import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { TextField } from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/smartForm/helper';

export class DomesticPhoneInput extends Component {

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
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style
    } = this.props;

    const { val, isError, inputIndex, helperMsg } = this.state;

    return (
      <TextField
        name={inputName}
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
        onChange={e => this.inputChange(e)}
        InputProps={{
          readOnly: isReadOnly,
          inputComponent: NumberFormatWrapper,
          value: val
        }}
        inputProps={{
          format: '(###) ###-####',
          mask: '_',
        }}
        key={inputName}
      />
    );
  }

  inputChange = e => {
    let val = e.target.value || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName } = this.props;
    const valClean = val.replace(/[a-zA-Z() _-]/g, '');

    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;
    let inputVal = '';
    if (valClean.length === 0) {
      val = undefined;
    }
    else if (valClean.length > 0 && valClean.length !== 10) {
      helperMsg = 'Please enter a valid Phone Number';
      isError = true;
      isValid = false;
      inputVal = val;
    }
    else {
      helperMsg = '';
      isError = undefined;
      isValid = true;
      inputVal = valClean;
    }
    this.setState(
      { val: inputVal, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val: valClean, isValid, eventType })
    );
  }

}

export default DomesticPhoneInput;


function NumberFormatWrapper({ inputRef, ...etc }) {
  return (
    <NumberFormat
      {...etc}
      getInputRef={inputRef}
    />
  );

}

NumberFormatWrapper.propTypes = {
  inputRef: PropTypes.func, // supplied by <TextInput /> to maintain it's state
};