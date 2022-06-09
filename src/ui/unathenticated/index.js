import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Login from 'features/public/Login';
import Register from 'features/public/Register';
import ForgotPassword from 'features/public/ForgotPassword';

export class Unauthenticated extends Component {

  render() {
    return (
      <Switch>
        <Route exact path='/' render={props => (<Login {...props} />)} />
        <Route exact path='/register' render={props => (<Register {...props} />)} />
        <Route exact path='/forgot-password' render={props => (<ForgotPassword {...props} />)} />
      </Switch>
    );
  }
}

export default withRouter(Unauthenticated);