import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import {
  TextField,
} from '@material-ui/core';

export function NumberFormatWrapper({ onChange, inputRef, ...etc }) {
  return (
    <NumberFormat
      {...etc}
      getInputRef={inputRef}
      onValueChange={onChange}
    />
  );
}
NumberFormatWrapper.propTypes = {
  onChange: PropTypes.func,
  inputRef: PropTypes.func, // supplied by <TextInput /> to maintain it's state
};

export default class BaseNumberInput extends React.Component {
  static propTypes = {
    ...NumberFormat.propTypes,
    errorText: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    errorText: '',
    className: '',
    isintl: 'false',
  };

  static extendProps(componentClass) {
    componentClass.propTypes = {
      ...BaseNumberInput.propTypes,
      ...componentClass.propTypes,
    };
    componentClass.defaultProps = {
      ...BaseNumberInput.defaultProps,
      ...componentClass.defaultProps,
    };
  }

  render() {
    const { errorText, className, style, InputProps, inputProps, ...etc } = this.props;
    return (
      <TextField
        className={className}
        error={Boolean(errorText)}
        helperText={errorText}
        style={style}
        InputProps={{
          ...InputProps,
          inputComponent: NumberFormatWrapper
        }}
        inputProps={inputProps}
        {...etc}
      />
    );
  }
}
