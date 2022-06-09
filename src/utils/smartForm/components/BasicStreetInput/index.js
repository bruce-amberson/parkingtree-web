import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

export class BasicStreetInput extends Component {

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
    onError: PropTypes.func, // if parent component wants to track has error boolean
    apiError: PropTypes.string, // if parent component wants to pass down api errors
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
      // if parent wants to know if error
      if (this.props.apiError && prevProps.apiError !== this.props.apiError) {
        this.setState({ hasError: true, helperMsg: this.props.apiError });
        this.props.onError && this.props.onError(true);
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
        value={val || ''}
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
          maxLength: 40,
        }}
        InputProps={{
          readOnly: isReadOnly,
        }}
        key={inputName}
      />
    );
  }

  inputChange = e => {
    let val = e.target.value.trimStart() || '';
    
    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const regex = /^[A-Za-z0-9.\s.,':#/-]+$/; // case insensitive, numbers, space, period, comma, single quote, colon, hashtag, forward slash and hyphen
    
    const { inputName } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;
    
    if (val.length === 0) {
      val = undefined;
      isError = undefined;
      this.setState(
        { inputValue: '', helperMsg, isError },
        () => updateInput(this.state.inputIndex, { inputName, val: undefined, isValid: false, eventType })
      );
    }
    else if (val.length > 0 && !regex.test(val)) {
      helperMsg = "Allowable characters: . , ' : # / -"; // eslint-disable-line
      isError = true;
    }
    else {
      helperMsg = '';
      isValid = true;
    }
    
    this.setState(
      { val, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );

    // if external callback is passed also update the value or error there
    this.props.onChange && this.props.onChange(val);
    this.props.onError && this.props.onError(isError);
  }  

}

export default BasicStreetInput;