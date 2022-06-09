import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { allNotificationsHide } from 'utils/utility';

const select = state => ({
  isAuthenticated: state.session.isAuthenticated,
  token: state.session.token,
});

export class ProtectedRoute extends React.Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    allNotificationsHide: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.onload = () => {
      this.props.allNotificationsHide();
    };
  }

  render() {
    const { component: Component, isAuthenticated, ...rest } = this.props; // eslint-disable-line react/prop-types
    return (
      <Route {...rest} render={props => {
        return isAuthenticated
          ? <Component {...props} />
          : <Redirect to='/' />;
      }}
      />
    );
  }

}

export default connect(select, { 
  allNotificationsHide, 
})(ProtectedRoute);