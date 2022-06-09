import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import {
  addInput,
  updateInput,
  helperTextManage,
  helperErrorManage
} from 'utils/singleForm/helper';

export class StateInput extends React.Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    inputFocus: PropTypes.bool,
    labelText: PropTypes.string,
    inputFullWidth: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,

    onChange: PropTypes.func, // if parent component wants to track value changes
    value: PropTypes.string, // if parent component wants to update the val
  };

  state = {
    usStates: [
      { Code: 'AL', Name: 'Alabama' },
      { Code: 'AK', Name: 'Alaska' },
      { Code: 'AZ', Name: 'Arizona' },
      { Code: 'AR', Name: 'Arkansas' },
      { Code: 'CA', Name: 'California' },
      { Code: 'CO', Name: 'Colorado' },
      { Code: 'CT', Name: 'Connecticut' },
      { Code: 'DE', Name: 'Delaware' },
      { Code: 'FL', Name: 'Florida' },
      { Code: 'GA', Name: 'Georgia' },
      { Code: 'HI', Name: 'Hawaii' },
      { Code: 'ID', Name: 'Idaho' },
      { Code: 'IL', Name: 'Illinois' },
      { Code: 'IN', Name: 'Indiana' },
      { Code: 'IA', Name: 'Iowa' },
      { Code: 'KS', Name: 'Kansas' },
      { Code: 'KY', Name: 'Kentucky' },
      { Code: 'LA', Name: 'Louisiana' },
      { Code: 'ME', Name: 'Maine' },
      { Code: 'MD', Name: 'Maryland' },
      { Code: 'MA', Name: 'Massachusetts' },
      { Code: 'MI', Name: 'Michigan' },
      { Code: 'MN', Name: 'Minnesota' },
      { Code: 'MS', Name: 'Mississippi' },
      { Code: 'MO', Name: 'Missouri' },
      { Code: 'MT', Name: 'Montana' },
      { Code: 'NE', Name: 'Nebraska' },
      { Code: 'NV', Name: 'Nevada' },
      { Code: 'NH', Name: 'New Hampshire' },
      { Code: 'NJ', Name: 'New Jersey' },
      { Code: 'NM', Name: 'New Mexico' },
      { Code: 'NY', Name: 'New York' },
      { Code: 'NC', Name: 'North Carolina' },
      { Code: 'ND', Name: 'North Dakota' },
      { Code: 'OK', Name: 'Oklahoma' },
      { Code: 'OH', Name: 'Ohio' },
      { Code: 'OR', Name: 'Oregon' },
      { Code: 'PA', Name: 'Pennsylvania' },
      { Code: 'RI', Name: 'Rhode Island' },
      { Code: 'SC', Name: 'South Carolina' },
      { Code: 'SD', Name: 'South Dakota' },
      { Code: 'TN', Name: 'Tennessee' },
      { Code: 'TX', Name: 'Texas' },
      { Code: 'UT', Name: 'Utah' },
      { Code: 'VT', Name: 'Vermont' },
      { Code: 'VA', Name: 'Virginia' },
      { Code: 'WA', Name: 'Washington' },
      { Code: 'WV', Name: 'West Virginia' },
      { Code: 'WI', Name: 'Wisconsin' },
      { Code: 'WY', Name: 'Wyoming' },
      { Code: 'AS', Name: 'American Samoa' },
      { Code: 'DC', Name: 'District of Columbia' },
      { Code: 'FM', Name: 'Federated States of Micronesia' },
      { Code: 'GU', Name: 'Guam' },
      { Code: 'MH', Name: 'Marshall Islands' },
      { Code: 'MP', Name: 'Northern Mariana Islands' },
      { Code: 'PW', Name: 'Palau' },
      { Code: 'PR', Name: 'Puerto Rico' },
      { Code: 'VI', Name: 'Virgin Islands' },
    ],

    val: '',
    inputIndex: undefined,
    inputValue: '',
    isError: undefined,
    helperMsg: ''
  }

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
        this.handleEntry(null, this.getStateByCode(curInput.val), 'update');
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        this.handleEntry(null, null, 'update');
      }
      // if parent wants to change the val
      if (this.props.value !== undefined && prevProps.value !== this.props.value) {
        this.handleEntry(null, this.getStateByCode(this.props.value), 'update');
      }
    }
  }

  render() {
    const { inputName, labelText, isDisabled, isReadOnly, style } = this.props;
    const { inputValue, usStates, isError, inputIndex, helperMsg } = this.state;

    return (
      <Autocomplete
        options={usStates}
        getOptionLabel={usState => usState.Name}
        onChange={(e, obj) => this.handleSelect(e, obj)}
        onInputChange={(e, val, reason) => this.handleEntry(e, val, reason)}
        onBlur={() => this.handleNoMatch()}
        inputValue={inputValue || ''}
        disabled={isDisabled || isReadOnly}
        renderInput={params => (
          <TextField
            {...params}
            name={inputName}
            disabled={isDisabled} // need this here to overwrite disable from Autocomplete params that are passed
            label={labelText}
            helperText={helperMsg || helperTextManage(inputName, inputIndex)}
            error={isError || helperErrorManage(inputName, inputIndex)}
            style={style}
            InputProps={{ ...params.InputProps, readOnly: isReadOnly }}
          />
        )}
        key={inputName}
      />
    );
  }

  getStateByCode = (code) => {
    const specificState = this.state.usStates.find(usState => usState.Code === code);
    return specificState === undefined ? { Code: '', Name: '' } : specificState;
  };

  handleSelect(e, obj) {
    const { inputName } = this.props;
    const eventType = e && e.type ? e.type : null; // detect if event is user or programmatic driven
    let val = undefined;
    let isValid = undefined;
    if (obj) {
      val = obj.Code;
      isValid = true;
      updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
    }
    else {
      updateInput(this.state.inputIndex, { inputName, val: undefined, isValid });
    }
  }

  handleEntry(e, inputValue, reason) {
    const { inputName } = this.props;
    let stateCode = '';
    const eventType = e && e.type ? e.type : null; // detect if event is user or programmatic driven
    if (reason === 'update' && (this.state.inputValue === '' || inputValue === null || this.state.inputValue !== inputValue.Name)) {
      stateCode = inputValue.Code;
      this.setState(
        { val: inputValue.Code, inputValue: inputValue.Name },
        () => updateInput(this.state.inputIndex, { inputName, val: inputValue.Code, isValid: undefined, eventType })
      );
    }
    else if (reason === 'reset' && inputValue !== this.state.inputValue && inputValue !== '') {
      stateCode = this.getStateByCode(inputValue).Code;
      this.setState({ inputValue });
    }
    else if (reason === 'clear' && inputValue === '') {
      stateCode = '';
      this.setState(
        { inputValue: '', val: '' },
        () => updateInput(this.state.inputIndex, { inputName, val: undefined, isEmpty: true, eventType })
      );
    }
    else if (reason === 'input') {
      if (inputValue === '') {
        stateCode = '';
        this.setState(
          { inputValue: '', val: '' },
          () => updateInput(this.state.inputIndex, { inputName, val: undefined, isEmpty: true, eventType })
        );
      }
      else {
        stateCode = inputValue;
        this.setState({ inputValue });
      }
    }

    // if external callback is passed also update the value there
    this.props.onChange && this.props.onChange(stateCode);
  }

  handleNoMatch() {
    let isMatch = false;
    let val = undefined;
    let isValid = undefined;
    this.state.usStates.forEach(usState => {
      if (usState.Name === this.state.inputValue) {
        isMatch = true;
        val = usState.Code;
        isValid = true;
      }
    });

    if (isMatch) {
      this.setState(
        { inputValue: this.state.inputValue },
        () => updateInput(this.state.inputIndex, { inputName: this.props.inputName, val, isValid })
      );
    }
    else {
      this.setState({ inputValue: '' });
    }
  }

}

export default StateInput;
