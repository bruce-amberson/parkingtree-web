import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import parkingtreeTheme from 'ui/themes/parkingtree/parkingtreeTheme';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import Authenticated from 'ui/Authenticated';
import Unathenticated from 'ui/Unathenticated';

import {
  notificationShow, 
  Notifications
} from 'utils/utility';

import './styles.css';

const select = state => ({
  isAuthenticated: state.session.isAuthenticated,
});

export class App extends Component {

  static propTypes = {
    notificationShow: PropTypes.func.isRequired,
  };

  render() {
    
    const view = this.props.isAuthenticated
      ? <Authenticated />
      : <Unathenticated />;
    
    return (
      <ThemeProvider theme={createTheme(parkingtreeTheme)}>
        {view}
        <Notifications />
      </ThemeProvider>
    );
  }
}

export default connect(select, { notificationShow })(App);