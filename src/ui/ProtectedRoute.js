import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const select = state => ({
  isAuthenticated: state.session.isAuthenticated,
});

export class ProtectedRoute extends React.Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

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

export default connect(select, null)(ProtectedRoute);