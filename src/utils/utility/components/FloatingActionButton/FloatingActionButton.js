/* eslint-disable indent */
/*
*
* FloatingActionButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';

import {
  Tooltip,
  Icon,
  withStyles,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

import './FloatingActionButton.styles.css';

const styles = theme => ({
  button: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.grey['200'],
    },
  },
  icon: {
    color: theme.palette.secondary.main,
  },
});


export class FloatingActionButton extends React.Component {

  static propTypes = {
    hasMenu: PropTypes.bool.isRequired,
    mainButtonAction: requiredIf(PropTypes.func, props => !props.hasMenu),
    mainButtonTitle: requiredIf(PropTypes.string, props => !props.hasMenu),
    mainIcon: requiredIf(PropTypes.node, props => !props.hasMenu),
    menuOptions: requiredIf(PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        action: PropTypes.func.isRequired,
      })), props => props.hasMenu),
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    menuOptions: [],
  };

  state = {
    showMenuOptions: false,
  };

  menuOptionsCompile() {
    const { menuOptions, classes } = this.props;
    if (menuOptions.length > 0) {
      return menuOptions.map((option, index) => {
        return (
          <div
            key={index}
            className='FloatingActionButton_menuOptionButton'
          >
            <Tooltip
              title={option.title}
              placement='left'
            >
              <Fab
                className={classes.button}
                onClick={() => {
                  option.action();
                  this.setState({
                    showMenuOptions: false,
                  });
                }}
              >
                {typeof option.icon === 'string'
                  ? <Icon className={classes.icon}>{option.icon}</Icon>
                  : option.icon
                }
              </Fab>
            </Tooltip>
          </div>
        );
      });
    }
  }

  onButtonClick = () => {
    if (this.props.hasMenu) {
      this.setState({
        showMenuOptions: !this.state.showMenuOptions,
      });
    }
    else {
      this.props.mainButtonAction();
    }
  }

  render() {
    /* eslint-disable no-nested-ternary */
    const { mainButtonTitle, mainIcon, menuOptions } = this.props;
    const { showMenuOptions } = this.state;

    return (
      <div>
        <div
          className={`FloatingActionButton_overlay${showMenuOptions ? 'Show' : 'Hide'}`}
          onClick={() => this.setState({ showMenuOptions: false })}
        />
        <div className='FloatingActionButton_container'>
          <div className='FloatingActionButton_mainButton'>
            <Tooltip
              title={mainButtonTitle || ''}
              placement='left'
            >
              <Fab onClick={this.onButtonClick}>
                {menuOptions.length > 0 && !mainIcon
                  ? <Icon
                      className={`FloatingActionButton_showMenu ${showMenuOptions ? 'rotate' : ''}`}
                      style={{ fontSize: '34px' }}
                    >
                      keyboard_arrow_up
                    </Icon>
                  : typeof mainIcon === 'string'
                      ? <Icon>{mainIcon}</Icon>
                      : mainIcon
                }
              </Fab>
            </Tooltip>
          </div>
          <div className={`FloatingActionButton_menuContainer${showMenuOptions ? 'Show' : 'Hide'}`}>
            {showMenuOptions && this.menuOptionsCompile()}
          </div>
        </div>
      </div>
    );
    /* eslint-enable no-nested-ternary */
  }
}

export default withStyles(styles)(FloatingActionButton);