/*
*
* Chip
*
*/
import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Tooltip } from '@material-ui/core';

import './Chip.styles.css';


export class Chip extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string.isRequired,
        tooltip: PropTypes.string.isRequired,
        action: PropTypes.func.isRequired,
      })
    ),
  };

  static defaultProps = {
    actions: [],
  };

  actionsCompose() {
    return this.props.actions.map(action => {
      return (
        <div
          className='Chip_actionContainer'
          key={action.icon}
        >
          <Tooltip
            title={action.tooltip}
            placement='top-start'
          >
            <Icon onClick={action.action} >
              <div className='Chip_actionIcon'>
                {action.icon}
              </div>
            </Icon>
          </Tooltip>
        </div>
      );
    });
  }

  render() {
    return (
      <div className='Chip_container'>
        <span>{this.props.name}</span>
        { this.props.actions.length > 0 && (
          <div className='Chip_actions'>
            {this.actionsCompose()}
          </div>
        )}
      </div>
    );
  }
}

export default Chip;
