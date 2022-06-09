import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';

import { Dropdown, } from '@frontend/common';

import {
  addInput,
  updateInput,
  helperTextManage,
  helperErrorManage
} from 'utils/singleForm/helper';

export class DropdownInput extends Component {

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
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      display: PropTypes.node,
      props: PropTypes.object,
    })).isRequired,
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
    const { inputName, options } = this.props;
    const list = cloneDeep(window.singleForm.inputList);

    if (list.length > 0) {
      if (!isEqual(prevProps.options, options)) {
        // if only 1 item array preselect
        if (options.length === 1) {
          const e = { target: { value: options[0].value }, type: 'update' };
          this.inputChange(e);
        }
        else {
          // just reset value
          const e = { target: { value: '' }, type: 'update' };
          this.inputChange(e);
        }
      }

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
      inputFullWidth, className, style,
      options,
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;

    return (
      <Dropdown
        label={labelText}
        value={val}
        errorText={(helperMsg) || helperTextManage(inputName, inputIndex)}
        onChange={value => this.inputChange({ target: { value }, type: 'change' })}
        options={options}
        FormControlProps={{
          fullWidth: inputFullWidth,
          error: isError || helperErrorManage(inputName, inputIndex),
          disabled: isDisabled,
          className,
          style,
        }}
        SelectProps={{
          inputProps: { readOnly: isReadOnly },
        }}
      />
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

export default DropdownInput;