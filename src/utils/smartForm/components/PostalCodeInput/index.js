import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { TextField } from '@material-ui/core';

import {
  addInput,
  updateInput,
  helperTextManage,
  helperErrorManage
} from 'utils/singleForm/helper';

export class PostalCodeInput extends Component {

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

    onChange: PropTypes.func, // if parent component wants to track value changes
    value: PropTypes.string, // if parent component wants to update the val
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

  componentDidUpdate(prevProps) {
    const { inputName } = this.props;
    const list = window.singleForm.inputList;
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
      // if parent wants to change the val
      if (this.props.value !== undefined && prevProps.value !== this.props.value) {
        this.inputChange({ target: { value: this.props.value } });
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
        onChange={e => this.inputChange(e)}
        InputProps={{
          inputComponent: NumberFormatWrapper,
          readOnly: isReadOnly,
        }}
        inputProps={{
          format: val.length > 5 ? '#####-####' : null,
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
    const valClean = val.replace(/[_-]/g, ''); // remove underscore and hyphen masking
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;

    if ((valClean.length > 0 && valClean.length < 5)
      || (valClean.length > 5 && valClean.length < 9)) {
      helperMsg = 'Please enter a valid Postal Code';
      isError = true;
      isValid = false;
    }
    else {
      helperMsg = '';
      isError = undefined;
      isValid = true;
      val = valClean;
    }
    this.setState(
      { val, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );

    // if external callback is passed also update the value there
    this.props.onChange && this.props.onChange(val);
  }

}

export default PostalCodeInput;


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