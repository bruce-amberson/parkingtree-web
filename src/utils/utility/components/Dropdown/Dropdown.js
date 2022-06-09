/*
*
* Dropdown
*
*/
import React from 'react';
import PropTypes from 'prop-types';

import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from '@material-ui/core';


export function Dropdown({
  label,
  errorText,
  options,
  value,
  onChange,
  multiple,
  FormControlProps,
  InputLabelProps,
  SelectProps,
  FormHelperTextProps,
  MenuItemProps,
}) {

  return (
    <FormControl
      error={Boolean(errorText)}
      style={{ width: '100%' }}
      {...FormControlProps}
    >
      {label && <InputLabel {...InputLabelProps}>{label}</InputLabel>}
      <Select
        value={value}
        onChange={e => onChange(e.target.value)}
        multiple={multiple}
        {...SelectProps}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            {...MenuItemProps}
            {...option.props}
          >
            {option.display || option.value}
          </MenuItem>
        ))}
      </Select>
      {errorText && <FormHelperText {...FormHelperTextProps}>{errorText}</FormHelperText>}
    </FormControl>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string,
  errorText: PropTypes.string,
  value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string, PropTypes.array ]),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    display: PropTypes.node,
    props: PropTypes.object,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  FormControlProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  SelectProps: PropTypes.object,
  FormHelperTextProps: PropTypes.object,
  MenuItemProps: PropTypes.object,
};

Dropdown.defaultProps = {
  multiple: false,
};

export default Dropdown;
