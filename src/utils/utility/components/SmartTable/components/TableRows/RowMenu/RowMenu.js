import React from 'react';
import PropTypes from 'prop-types';

import {
  Menu,
  MenuItem,
} from '@material-ui/core';

import IconBtnTooltip from 'utils/utility/components/IconBtnTooltip'

import * as types from 'utils/utility/components/SmartTable/constants';


export class RowMenu extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        type: PropTypes.oneOf([types.ROW_MENU]).isRequired,
        onSelect: PropTypes.func.isRequired,
        showIf: PropTypes.func,
      })
    ).isRequired,
    rowData: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
  };
 
  menuItemsCompose = () => {
    return this.props.options.map((option) => {
      const menuItem = (
        <MenuItem key={option.displayName} onClick={() => this.onMenuItemClick(option)}>
          {option.displayName}
        </MenuItem>
      );
      if (option.showIf) {
        return option.showIf(this.props.rowData) ? menuItem : null;
      }
      else {
        return menuItem;
      }
    }).filter(Boolean);
  }

  onMenuItemClick = (option) => {
    this.setState({ anchorEl: null });
    option.onSelect(this.props.rowData);
  }

  render() {
    const { anchorEl } = this.state;
    const menuItems = this.menuItemsCompose();
    
    if (menuItems.length === 0) {
      return null;
    }
    
    return (
      <div>
        <IconBtnTooltip
          icon='more_vert'
          title='More'
          onClick={e => this.setState({ anchorEl: e.currentTarget })}
        />
        <Menu
          anchorEl={anchorEl}
          keepMounted
          placement='left-start'
          open={Boolean(anchorEl)}
          onClose={() => this.setState({ anchorEl: null })}
        >
          {this.menuItemsCompose()}
        </Menu>
      </div>
    );
  }
  
}

export default RowMenu;
