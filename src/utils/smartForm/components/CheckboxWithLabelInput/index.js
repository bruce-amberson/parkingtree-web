import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox as MaterialCheckbox,
  FormControlLabel,
} from '@material-ui/core';

import {
  addInput,
  updateInput,
} from 'utils/smartForm/helper';


export class CheckboxWithLabelInput extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    labelText: PropTypes.string,
    inputFullWidth: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,

    labelFontSize: PropTypes.string,
    checkBoxSize: PropTypes.string,
    checkBoxPadding: PropTypes.string,

    onChange: PropTypes.func, // if parent component wants to track value changes
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]), // if parent component wants to update the val

    updateError: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
  };

  state = {
    val: false,
    inputIndex: undefined,
    hasError: undefined,
  };

  componentDidMount() {
    const { inputName, isRequired } = this.props;
    const inputIndex = addInput({ inputName, isRequired });
    this.setState({ inputIndex });
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputName } = this.props;
    const list = window.smartForm.inputList;
    if (list.length > 0) {
      const curInput = list[this.state.inputIndex];
      if (curInput && curInput.update && curInput.inputName === inputName && curInput.val !== undefined) {
        const e = { target: { checked: curInput.val }, type: 'update' };
        this.inputChange(e);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        delete curInput.delete;
        const e = { target: { checked: false }, type: 'update' };
        this.inputChange(e);
      }
      // if parent wants to change the val
      if (this.props.value !== undefined && prevProps.value !== this.props.value) {
        this.inputChange({ target: { checked: this.props.value } });
      }
    }
  }

  render() {
    const {
      inputName, labelText, isDisabled, isReadOnly,
      labelFontSize, checkBoxSize, checkBoxPadding,
      className, style, hasError
    } = this.props;

    const { val } = this.state;
    
    let color = undefined;
    let entireLabel = <span style={{ fontSize: labelFontSize }}>{labelText}</span>;
    if (hasError) {
      color = 'red';
      entireLabel = <span style={{ fontSize: labelFontSize, color }}>{labelText} (is required)</span>;
    }

    return (
      <FormControlLabel
        key={inputName}
        label={entireLabel}
        className={className}
        style={style}
        control={
          <MaterialCheckbox
            name={inputName}
            checked={val || false} // if undefined or '', should be false
            disabled={isDisabled}
            disableRipple={isReadOnly}
            onChange={e => !isReadOnly
              ? this.inputChange(e)
              : null
            }
            color='primary'
            inputProps={{ 'aria-label': 'primary checkbox' }}
            size={checkBoxSize}
            style={{ padding: checkBoxPadding, color }}
          />
        }
      />
    );
  }

  inputChange = e => {
    const val = e.target.checked;
    const { inputName, } = this.props;
    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven
    
    const isValid = val;

    this.setState(
      { val },
      () =>  {
        updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
        this.props.updateError();
      }
    );

    // if external callback is passed also update the value there
    this.props.onChange && this.props.onChange(val);
  }

}

export default CheckboxWithLabelInput;