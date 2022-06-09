import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import {
  addInput,
  updateInput,
  helperTextManage, 
  helperErrorManage
} from 'utils/singleForm/helper';

export class DownloadFormatInput extends React.Component {

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
    downloadFormats: PropTypes.arrayOf(
      PropTypes.shape({ // needed for Autocomplete options
        Code: PropTypes.string,
        Name: PropTypes.string,
      }),
    ).isRequired
  };

  state = {
    val: null,
    inputValue: '',
    inputIndex: undefined,
    isError: undefined,
    helperMsg: '',
  }

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
        let formatOption = this.props.downloadFormats.find(format => format.Code === curInput.val);
        formatOption = formatOption === undefined
          ? { Code: '', Name: '' }
          : formatOption;
        this.handleEntry(null, formatOption);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        this.handleEntry(null, null);
      }
    }
  }
  
  render() {
    const { inputName, labelText, style, isDisabled, isReadOnly, downloadFormats } = this.props;
    const { inputIndex, isError, helperMsg, val } = this.state;

    return (
      <Autocomplete
        disabled={isDisabled || isReadOnly}
        getOptionLabel={format => format.Name}
        getOptionSelected={(option, value) => value.Code !== null && option.Code === value.Code}
        options={downloadFormats}
        value={val}
        onChange={(e, val) => this.handleEntry(e, val)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={labelText}
            disabled={isDisabled} // need this here to overwrite disable from Autocomplete params that are passed
            helperText={helperMsg || helperTextManage(inputName, inputIndex)}
            error={isError || helperErrorManage(inputName, inputIndex)}
            style={style}
            InputProps={{ ...params.InputProps, readOnly: isReadOnly }}
          />
        )}
      />
    );
  }

  handleSelect(e, val) {
    const { inputName } = this.props;
    let newVal = val;
    let isValid = undefined;
    if (!newVal) {
      isValid = undefined;
      newVal = undefined;
    }
    updateInput(this.state.inputIndex, { inputName, val: newVal, isValid });
  }

  handleEntry(e, val) {
    
    const eventType = e && e.type ? e.type : null; // detect if event is user or programmatic driven
    
    if (!isEqual(val, this.state.val)) {
      const value = val ? val.Code : undefined;
      this.setState(
        { val },
        () => updateInput(this.state.inputIndex, { inputName: this.props.inputName, val: value, isValid: undefined, eventType })
      );
    }
  }

}

export default DownloadFormatInput;
