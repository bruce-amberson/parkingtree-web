import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import { 
  FormControl,
  InputLabel,
  Select, 
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

import { 
  addInput,
  updateInput,
  helperTextManage,
  helperErrorManage,
} from 'utils/singleForm/helper';

export class InvestmentOptionInput extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    inputFocus: PropTypes.bool,
    labelText: PropTypes.string,
    variant: PropTypes.string,
    style: PropTypes.string,

    options: PropTypes.arrayOf(
      PropTypes.shape({
        IsCustom: PropTypes.bool.isRequired,
        Name: PropTypes.string.isRequired,
        OptionId: PropTypes.number.isRequired,
      })
    ).isRequired,
    existingOptionId: PropTypes.number,
    onOptionSelection: PropTypes.func,
  };

  state = {
    val: '',
    inputIndex: undefined,
    isError: undefined,
    helperMsg: '',
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
    const { inputName, labelText, isDisabled, isReadOnly, options, variant, style, existingOptionId, } = this.props;
    const { val, inputIndex, isError, helperMsg, } = this.state;

    return (
      <FormControl
        error={isError || helperErrorManage(inputName, inputIndex)}
        fullWidth
        variant={variant}
        style={{ textAlign: 'left', overflow: 'visible', ...style }}
      >
        <InputLabel>{labelText}</InputLabel>
        <Select
          id='demo-simple-select-error'
          value={val}
          inputProps={{
            name: inputName,
            readOnly: isReadOnly,
            disabled: isDisabled,
          }}
          label={labelText} // label is also needed here to work with 'outlined' variant
          onChange={event => this.inputChange(event)}
          aria-disabled={isDisabled || isReadOnly}
        >
          <MenuItem key={null} value={null}>Select</MenuItem>
          {options.map(option => (
            <MenuItem 
              key={option.OptionId}
              value={option.OptionId}
              disabled={existingOptionId === option.OptionId && !option.IsCustom}
            >{option.Name}</MenuItem>
          ))}
        </Select>
        <FormHelperText>{(helperMsg) || helperTextManage(inputName, inputIndex)}</FormHelperText>
      </FormControl>
    );
  }

  inputChange = e => {
    let val = e.target.value || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName, isRequired, options, onOptionSelection, } = this.props;
    const helperMsg = '';
    const isError = undefined;
    let isValid = !isRequired;
    
    if (!val) {
      val = '';
    }
    else {
      isValid = true;
    }
    this.setState(
      { val, helperMsg, isError },
      () => {
        updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
        if (onOptionSelection) { // if toggle method is provided, use to show a custom option has been selected
          const selectedOption = options.find(option => option.OptionId === val) || {};
          onOptionSelection(selectedOption);
        }
      }
    );
  }
  
}

export default InvestmentOptionInput;