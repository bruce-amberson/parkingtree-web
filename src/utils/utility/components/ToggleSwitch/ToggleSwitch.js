/*
*
* ToggleSwitch
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { Switch } from '@material-ui/core';

import './ToggleSwitch.styles.css';


function ToggleSwitch({ label, toggled, disabled, onToggle }) {
  return (
    <div className='ToggleSwitch_container'>
      {label && <div>{label}</div>}
      <div>
        <Switch
          checked={toggled}
          onChange={(e, checked) => onToggle(checked)}
          disabled={disabled}
          style={{ height: '24px' }}
          disableRipple
        />
      </div>
    </div>
  );
}

ToggleSwitch.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.node,
  toggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ToggleSwitch;