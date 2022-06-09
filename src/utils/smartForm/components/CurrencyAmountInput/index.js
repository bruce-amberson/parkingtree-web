import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import { InputAdornment } from '@material-ui/core';

import { CurrencyInput, currencyFormatter, } from '@frontend/common';

import {
  addInput,
  updateInput,
  helperTextManage,
} from 'utils/singleForm/helper';

export class CurrencyAmountInput extends Component {

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

    minAmount: PropTypes.number,
    maxAmount: PropTypes.number,
    onlyIntegerAllowed: PropTypes.bool, // can restrict value to only be an integer. Decimals will show as .00 but not allow changing
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
        const e = { target: { floatValue: curInput.val }, type: 'update' };
        this.inputChange(e);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        delete curInput.delete;
        const e = { target: { floatValue: 0 }, type: 'update' };
        this.inputChange(e);
      }
    }
  }

  render() {
    const { 
      inputName, labelText, isDisabled, isReadOnly,
      inputFullWidth, className, style,
      onlyIntegerAllowed,
    } = this.props;

    const { val, inputIndex, helperMsg } = this.state;
    
    return (
      <CurrencyInput
        className={className}
        errorText={(helperMsg) || helperTextManage(inputName, inputIndex)}
        label={labelText}
        onChange={vals => this.inputChange({ target: { ...vals }, type: 'change' })}
        value={val}
        style={style}
        fullWidth={inputFullWidth}
        disabled={isDisabled}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          readOnly: isReadOnly,
        }}
        inputProps={{
          decimalScale: 2,
          fixedDecimalScale: true,
          thousandSeparator: true,
          allowNegative: false,
          value: val === 0 ? '' : val, // empties the input so user doesn't have to remove 0
          isAllowed: ({ floatValue }) => {
            if (onlyIntegerAllowed) return Number.isInteger(floatValue);
            else return true;
          }
        }}
      />
    );
  }

  inputChange = e => {
    let val = e.target.floatValue || 0;
    
    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName, isRequired, minAmount, maxAmount, } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = !isRequired;
    const min = minAmount ? currencyFormatter(minAmount) : null;
    const max = maxAmount ? currencyFormatter(maxAmount) : null;

    if (isRequired) {
      if (val === 0) {
        val = undefined;
        isValid = false;
      }
      else if (minAmount && maxAmount && (val < minAmount || val > maxAmount)) {
        helperMsg = `Enter an amount between ${min} and ${max}`;
        isError = true;
        isValid = false;
      }
      else if (minAmount && val < minAmount) {
        helperMsg = `Amount must be at least ${min}`;
        isError = true;
        isValid = false;
      }
      else if (maxAmount && val > maxAmount) {
        helperMsg = `Amount cannot be greater than ${max}`;
        isError = true;
        isValid = false;
      }
      else {
        isValid = true;
      }
    }

    this.setState(
      { val, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );
  }
  
}

export default CurrencyAmountInput;