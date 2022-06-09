import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import {
  TextField,
  InputAdornment,
} from '@material-ui/core';

import { 
  Visibility, 
  VisibilityOff,
} from '@material-ui/icons';

import {
  IconBtnTooltip,
} from 'utils/utility';

import {
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/smartForm/helper';

export class PasswordInput extends Component {

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
    helperMsg: '',

    isPasswordVisible: false,
  };

  componentDidMount() {
    const { inputName, isRequired } = this.props;
    const inputIndex = addInput({ inputName, isRequired });
    this.setState({ inputIndex });
  }

  componentDidUpdate() {
    const { inputName } = this.props;
    const list = cloneDeep(window.smartForm.inputList);

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
      inputFullWidth, autoComplete, className, style,
    } = this.props;

    const { val, inputIndex, isError, helperMsg, isPasswordVisible } = this.state;
    
    return (
      <TextField
        name={inputName}
        type={isPasswordVisible ? 'text' : 'password'}
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
        onChange={e => this.inputChange(e)}
        inputProps={{
          maxLength: 200,
        }}
        InputProps={{ 
          readOnly: isReadOnly,
          endAdornment: (
            <InputAdornment position='end'>
              <IconBtnTooltip
                icon={isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                onClick={() => this.setState({ isPasswordVisible: !this.state.isPasswordVisible })}
                title='Toggle Password'
              />
            </InputAdornment>
          )
        }}
        key={inputName}
      />
    );
  }

  inputChange = e => {
    let val = e.target.value.trimStart() || '';
    // eslint-disable-next-line no-irregular-whitespace
    val = val.replace(/[^a-z0-9 .,\-':#/&$()]/gi,''); // only allow alphanumeric values and . , - ' : # / & $ ( ).

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName, isRequired } = this.props;
    const helperMsg = '';
    const isError = undefined;
    let isValid = !isRequired;
    let inputVal = '';

    if (val.length === 0) {
      isValid = false;
      val = undefined;
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

export default PasswordInput;