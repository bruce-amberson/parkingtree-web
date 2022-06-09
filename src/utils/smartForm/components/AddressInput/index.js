import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { 
  addInput,
  updateInput,
  updateAddress,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

import { GETaddress } from 'utils/helpers/api_handler';
import { MAILING_TYPE } from 'utils/singleForm/constants';

export class AddressInput extends Component {

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

    updateGroup: PropTypes.func.isRequired,
  };

  state = {
    inputValue: '',
    inputIndex: undefined,
    isError: undefined,
    helperMsg: '',

    smartySuggestions: [],
    fullAddresses: []
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
        this.handleEntry({ type: 'update' }, curInput.val);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        this.handleEntry({ type: 'update' }, '');
      }
    }
  }

  render() {
    const { inputName, labelText, isDisabled, isReadOnly, style } = this.props;
    const { inputValue, inputIndex, isError, helperMsg, fullAddresses } = this.state;
    
    return (
      <Autocomplete
        disableClearable // The built-in clear button works inconsistently, so disabling this for now. User can still use keyboard to remove text.
        freeSolo
        includeInputInList
        options={fullAddresses}
        filterOptions={options => options} // Prevents Autocomplete from filtering out any options
        getOptionLabel={option => option.title}
        onInputChange={(e, val) => this.handleEntry(e, val)}
        inputValue={inputValue}
        disabled={isDisabled || isReadOnly}
        renderInput={params => 
          (
            <TextField 
              {...params} 
              name={inputName}
              disabled={isDisabled} // need this here to overwrite disable from Autocomplete params that are passed
              label={labelText}
              helperText={helperMsg || helperTextManage(inputName, inputIndex)}
              error={isError || helperErrorManage(inputName, inputIndex)}
              style={style}
              inputProps={{ ...params.inputProps, maxLength: 51 }}
              InputProps={{ ...params.InputProps, readOnly: isReadOnly }}
            />
          )}
        key={inputName}
      />
    );
    
  }

  handleEntry(e, inputValue) {
    let val = inputValue.trimStart();
    
    if (val === this.state.val && this.props.isReadOnly) return;

    const event = e ? e : {}; // no event provided on autocomplete dropdown selection
    const eventType = !event.type || event.type === 'update' ? null : event.type; // detect if event is user or programmatic driven

    const { inputName } = this.props;
    const intitialVal = val;
    if (val.includes('|')) {
      val = val.substring(0, val.indexOf('|') - 1);
    }
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;

    const regex = /^[A-Za-z0-9.\s.,':#/-]+$/; // case insensitive, numbers, space, period, comma, single quote, colon, hashtag, forward slash and hyphen
    
    if (val.length === 0) {
      this.setState(
        { inputValue: '', helperMsg, isError, fullAddresses: [] },
        () => updateInput(this.state.inputIndex, { inputName, val: undefined, isValid, eventType })
      );      
    }
    else if (val.length > 0 && !regex.test(val)) {
      helperMsg = "Allowable characters: . , ' : # / -"; // eslint-disable-line
      isError = true;
      isValid = false;
    }
    else if (val.length > 0 && regex.test(val)) {
      helperMsg = '';
      isError = undefined;
      isValid = true;
      
      if (!this.props.isReadOnly) {
        GETaddress(val)
          .then(res => {
            if (res.data.suggestions !== null) {
              const fullAddresses = [];
              res.data.suggestions.forEach(address => {
                const addr = { title: `${address.street_line} | ${address.city}, ${address.state} ${address.zipcode}`, street_line: address.street_line };
                fullAddresses.push(addr);
              });

              this.setState({ 
                fullAddresses,
                smartySuggestions: res.data.suggestions 
              });
            }
          })
          .catch(() => {
            helperMsg = 'Smarty Street error';
          });
        
        
        let addressMatch = this.state.smartySuggestions.find(suggestion => suggestion.street_line === val);
        if (addressMatch !== undefined) {
          
          const fullAddressMatch = this.state.smartySuggestions.find(suggestion => {
            const fullAddr = `${suggestion.street_line} | ${suggestion.city}, ${suggestion.state} ${suggestion.zipcode}`;
            return fullAddr === intitialVal ? suggestion : undefined;
          });
          addressMatch = fullAddressMatch === undefined ? addressMatch : fullAddressMatch;  
          
          if (inputName.includes('Mailing')) {
            addressMatch.addressType = MAILING_TYPE.MAILING;
          }
          else if (inputName.includes('Physical')) {
            addressMatch.addressType = MAILING_TYPE.PHYSICAL;
          }
          else {
            addressMatch.addressType = MAILING_TYPE.OTHER;
          }
          updateAddress(addressMatch);
          this.props.updateGroup();
        }
      }
    }

    this.setState(
      { inputValue: val, helperMsg, isError },
      () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
    );
  }

}

export default AddressInput;