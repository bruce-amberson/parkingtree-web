import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProtectedRoute from 'ui/ProtectedRoute';

import RolesList from 'features/private/UserManagement/RolesList';

import 'ui/Authenticated/Container/style.css';

export class Container extends Component {

  render() {
    return (
      <div className='Container_container'>
        <div className='Container_logo'>
          <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
        </div>
        <div className='Container_body'>
          <div styles={{ width: '90%' }}>
            <Switch>
              <ProtectedRoute path='/user-management/rolelist' component={RolesList} />
              {/* <Route component={PageNotFound} /> */}
            </Switch>
            </div>
        </div>
      </div>
    );
  }
}

export default Container;