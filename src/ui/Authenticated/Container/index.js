import React, { Component } from 'react';
import { Switch } from 'react-router-dom';

import ProtectedRoute from 'ui/ProtectedRoute';

import RolesList from 'features/private/UserManagement/RolesList';
import RolesManage from 'features/private/UserManagement/RolesManage';

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
              <ProtectedRoute path='/user-management/roleslist' component={RolesList} />
              <ProtectedRoute path='/user-management/rolesmanage' component={RolesManage} />
              {/* <Route component={PageNotFound} /> */}
            </Switch>
            </div>
        </div>
      </div>
    );
  }

}



export default Container;