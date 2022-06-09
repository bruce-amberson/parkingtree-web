/*
*
* StateDropdown
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import { getTranslations } from '../../helpers/translations';


export class StateDropdown extends React.Component {

  static propTypes = {
    states: PropTypes.array.isRequired,
    otherProps: PropTypes.object,
  };

  render() {
    return (
      <Dropdown
        label={getTranslations('address_state_lbl')}
        options={this.props.states.map(state => ({ value: state.Code, display: state.Name }))}
        {...this.props}
      />
    );
  }
}

export default StateDropdown;
