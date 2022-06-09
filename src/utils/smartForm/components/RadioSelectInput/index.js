import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import {
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

export class RadioSelectInput extends Component {

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

    onSelection: PropTypes.func, // method to pass on selection, if valid
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
        label: PropTypes.string,
        disabled: PropTypes.bool,
      })
    ).isRequired,
    row: PropTypes.bool // boolean to set Radios horizontal vs vertical
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
      inputFullWidth, className, style, options, row,
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;
    const errorMsg = (helperMsg) || helperTextManage(inputName, inputIndex);

    return (
      <FormControl
        component='fieldset'
        error={isError || helperErrorManage(inputName, inputIndex)}
        disabled={isDisabled}
        fullWidth={inputFullWidth}
        className={className}
        style={style}
      >
        {labelText &&
        <FormLabel component='legend'>{labelText}</FormLabel>}
        <RadioGroup
          value={val || ''}
          onChange={this.inputChange}
          row={row}
          aria-label={labelText}
          name='radio-buttons-group'
        >
          {options.map(({ value, label, disabled }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio disableRipple={isReadOnly} />}
              label={label || value}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
        {errorMsg && 
        <FormHelperText style={{ textAlign: 'center' }}>{errorMsg}</FormHelperText>}
      </FormControl>
    );
  }

  inputChange = e => {
    let val = e.target.value || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName, isRequired, onSelection } = this.props;
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
      onSelection && onSelection(val);
    }
    this.setState(
      { val: inputVal, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );
  }
  
}

RadioSelectInput.defaultProps = {
  row: true,
};

export default RadioSelectInput;