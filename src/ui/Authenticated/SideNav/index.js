import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  notificationShow
} from 'utils/utility';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  withStyles,
} from '@material-ui/core';

import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import {
  toggleSidenav,
  userLogout,
} from 'ui/actions';

import 'ui/Authenticated/SideNav/styles.css';

const select = (state) => ({
  isAuthenticated: state.session.isAuthenticated,
  sideNavOpen: state.session.sideNavOpen,
  disableLeftNavigationMenu: state.session.disableLeftNavigationMenu,
});

const muiStyles = {
  sidenavOpen: {
    height: '100%',
    overflowX: 'visible',
    transition: 'all .5s ease',
    width: '200px',
  },
  sidenavMini: {
    height: '100%',
    overflowX: 'hidden',
    transition: 'width .5s ease',
  },
};

export class Sidenav extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    notificationShow: PropTypes.func.isRequired,
    toggleSidenav: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
  };

  state = {
    menuSelection: {
      dashboard: false,
      users: false,
      towing: false,
      properties: false,
      settings: false
    },
  };

  render() {
    const { isAuthenticated, sideNavOpen } = this.props;
    return (
      isAuthenticated &&
      <Drawer
        open={sideNavOpen}
        PaperProps={{ style: sideNavOpen ? muiStyles.sidenavOpen : muiStyles.sidenavMini }}
        id='drawer'
        variant={isAuthenticated ? 'permanent' : 'persistent'} // ensures drawer closes when logged out
      >
        {this.renderSidenavContents()}
      </Drawer>
    );
  }

  logOut = () => {
    const token = sessionStorage.getItem('token');
    this.props.userLogout({ token })
      .finally(() => this.props.notificationShow('You have logged out!', 'success'));
  };

  selectListItem(item) {
    const { menuSelection } = this.state;
    Object.keys(menuSelection).forEach(item => menuSelection[item] = false);
    menuSelection[item] = true;
    this.setState({ menuSelection });
  }

  renderSidenavContents = () => {
    const { menuSelection } = this.state;
    return (
      <React.Fragment>
        <div className='sideNavContainer'>
            <List style={{ padding: '0' }}>
              
              <ListItem
                onClick={() => this.selectListItem('dashboard')}
                button
                selected={menuSelection['dashboard']}
              >
                <ListItemIcon style={{ minWidth: '35px' }}>
                  <Tooltip
                    title='Dashboard'
                    placement='right'
                  >
                    <BarChartIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItem>

              <ListItem
                onClick={() => { 
                  this.selectListItem('users');
                  this.goToRoute('/user-management/roleslist');
                }}
                button
                selected={menuSelection['users']}
              >
                <ListItemIcon style={{ minWidth: '35px' }}>
                  <Tooltip
                    title='Users'
                    placement='right'
                  >
                    <PeopleIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary='Users' style={{ color: '#060606' }} />
              </ListItem>

              <ListItem
                onClick={() => this.selectListItem('towing')}
                button
                selected={menuSelection['towing']}
              >
                <ListItemIcon style={{ minWidth: '35px' }}>
                  <Tooltip
                    title='Towing'
                    placement='right'
                  >
                    <LocalShippingIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary='Towing' style={{ color: '#060606' }} />
              </ListItem>

              <ListItem
                onClick={() => this.selectListItem('properties')}
                button
                selected={menuSelection['properties']}
              >
                <ListItemIcon style={{ minWidth: '35px' }}>
                  <Tooltip
                    title='Properties'
                    placement='right'
                  >
                    <EmojiTransportationIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary='Properties' style={{ color: '#060606' }} />
              </ListItem>

            </List>
  
        </div>

        <div className='SideNav_bottomMenu'>

          <List style={{ padding: '0' }}>
                
            <ListItem
              onClick={() => this.selectListItem('settings')}
              button
              selected={menuSelection['settings']}
            >
              <ListItemIcon style={{ minWidth: '35px' }}>
                <Tooltip
                  title='My Settings'
                  placement='right'
                >
                  <SettingsIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary='My Settings' style={{ color: '#060606' }} />
            </ListItem>

            <ListItem
              onClick={() => { 
                this.props.userLogout();
                this.goToRoute('/');
              }}
              button
              selected={false}
            >
              <ListItemIcon style={{ minWidth: '35px' }}>
                <Tooltip
                  title='Log Out'
                  placement='right'
                >
                  <PowerSettingsNewIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary='Log Out' style={{ color: '#060606' }} />
            </ListItem>

          </List>
        
        </div>

      </React.Fragment>
    );
  }

  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

}

export default withRouter(withStyles(muiStyles)(connect(select, {
  notificationShow,
  toggleSidenav,
  userLogout,
})(Sidenav)));