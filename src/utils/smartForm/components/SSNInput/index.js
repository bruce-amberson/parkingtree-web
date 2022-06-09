import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SsnInput } from '@frontend/common';

import { 
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

export class SSNInput extends Component {

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
    variant: PropTypes.string,

    handleAccountOwnerSSNSearch: PropTypes.func, // can be passed to provide a valid SSN in order to do a search
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
    }
  }
  
  render() {
    const {
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style, variant,
    } = this.props;
    const { val, inputIndex, isError, helperMsg } = this.state;

    return (
      <SsnInput
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
        variant={variant}
        onChange={e => this.inputChange({ target: e, type: 'change' })}
        inputProps={{
          format: '###-##-####',
          mask: '_',
        }}
        InputProps={{
          readOnly: isReadOnly,
        }}
        key={inputName}
      />
    );
  }

  inputChange = e => {
    const val = e.target.value.trimStart().replace(/-/g, '') || ''; // if comes in with hyphens, they should be removed

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven
    
    const { inputName } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;

    if (val.length === 0) {
      isValid = undefined;
      this.setState(
        { val, helperMsg, isError },
        () => updateInput(this.state.inputIndex, { inputName, val: undefined, isValid, eventType })
      );
    }
    else if (val.match('^\\d+$', '')) { // allow only numbers
      if (val.length > 0 && val.length !== 9) {
        helperMsg = 'Please enter a valid SSN';
        isError = true;
        isValid = false;
      }
      else {
        isValid = true;
      }
      this.setState(
        { val, helperMsg, isError },
        () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
      );
    }

    if (this.props.handleAccountOwnerSSNSearch && e.type !== 'update') {
      this.props.handleAccountOwnerSSNSearch(isValid ? val : null); // only pass in SSN, if valid
    }
        
  }

}

export default SSNInput;