import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/smartForm/helper';

export class TitleInput extends Component {

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
        inputProps={{
          maxLength: 40
        }}
        InputProps={{
          readOnly: isReadOnly,
        }}
        key={inputName}
      />
    );
  }

  inputChange = e => {
    const val = e.target.value.trimStart() || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven
    
    const { inputName } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;

    const regex = /^[A-Za-z.\s.,&'-]+$/; // case insensitive, space, period, comma, single quote, ampersand and hyphen allowed.
    
    if (val.length === 0) {
      isValid = undefined;
    }
    else if (val.length > 0 && !regex.test(val)) {
      helperMsg = "Allowable special characters are: . , - ' &"; // eslint-disable-line
      isError = true;
      isValid = false;
    }
    else {
      helperMsg = '';
      isError = undefined;
      isValid = true;
    }
    this.setState(
      { val, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );
  }
  

}

export default TitleInput;