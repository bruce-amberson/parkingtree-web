import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { Button } from '@material-ui/core';
import Add from '@material-ui/icons/ArrowForward';
import Remove from '@material-ui/icons/ArrowBack';

import { LoadingOverlay } from 'utils/utility/components/LoadingOverlay';

import TitleInput from 'utils/smartForm/components/TitleInput';

import { 
  clearSmartForm,
  checkRequiredInputs,
  prepInputList,
  updateInputList,
} from 'utils/smartForm/helper';

import 'features/private/UserManagement/RolesManage/styles.css';


export class RolesManage extends Component {

  static propTypes = {
    // roleList: PropTypes.array.isRequired,
  };

  state = {
    loading: false,
    unusedPermissions:[
      'EditRole',
      'EditUser',
      'EditProperty',
      'EditTow',
    ],
    usedPermissions: [],
  };

  componentWillUnmount() {
    clearSmartForm();
  }

  render() {
    const { loading } = this.state;
    return (
      <LoadingOverlay
        show={loading}
        width='100%'
      >
        <div style={{ marginTop: '15px' }}>
          <TitleInput
            inputName='roleName'
            isRequired={true}
            labelText='Role Name'
            style={{ width: '240px' }}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'grid', marginRight: '20px', marginTop: '5px', backgroundColor: '#EEE', borderRadius: '10px', padding: '10px', alignContent: 'start', minHeight: '500px' }}>
            <div className='RolesAdd_unused'>Unassigned Permissions</div>
            {this.renderUnused()}
          </div>
          <div style={{ display: 'grid', marginTop: '5px', backgroundColor: '#EEE', borderRadius: '5px', padding: '10px', alignContent: 'start', }}>
            <div className='RolesAdd_used'>Assigned Permissions</div>
            {this.renderUsed()}
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Button
            type='submit'
            variant='contained'
            onClick={() => this.manageRole()}
            style={{ width: '175px' }}
          >
            add role
          </Button>
        </div>
      </LoadingOverlay>
    );
  }

  manageRole() {
    const list = cloneDeep(window.smartForm.inputList);
    const validationObject = checkRequiredInputs(list);
    if (validationObject.isValid) {
      const result = prepInputList(validationObject.list);
      result.unusedPermissions = this.state.unusedPermissions;
      result.usedPermissions = this.state.usedPermissions;
      console.log(result);
      this.goToRoute('/user-management/roleslist');
    }
    else {
      updateInputList(validationObject.list);
      this.forceUpdate();
    }
  }
  
  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

  renderUsed() {
    const usedPermissions = cloneDeep(this.state.usedPermissions);
    if (usedPermissions.length === 0) {
      return (
        <div id='claims-unused' style={{ textAlign: 'center', marginTop: '10px' }}>
          No Claims added yet.<br />You must add at least one claim.
        </div>
      );
    }
    
    return usedPermissions.map((claim, index) => {
      return (
        <div onClick={() => this.handleRemove(index)} className='RolesAdd_addUser' key={index}>
          <Remove />
          <span style={{ width: '100%', textAlign: 'right' }}>
            {claim}
          </span>
        </div>
      );
    });
  }

  renderUnused() {
    const unusedPermissions = cloneDeep(this.state.unusedPermissions);
    if (unusedPermissions.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          All claims are used.
        </div>
      );
    }    
    
    return unusedPermissions.map((claim, index) => {
      return (
        <div onClick={() => this.handleAdd(index)} className='RolesAdd_addUser' key={index}>
          <span style={{ width: '100%' }}>
            {claim}
          </span>
          <Add />
        </div>
      );
    });
  }

  handleAdd(id) {
    const { usedPermissions, unusedPermissions } = cloneDeep(this.state);
    usedPermissions.push(unusedPermissions[id]);
    unusedPermissions.splice(id, 1);
    this.setState({ unusedPermissions, usedPermissions });
  }

  handleRemove(id) {
    const { usedPermissions, unusedPermissions } = cloneDeep(this.state);
    unusedPermissions.push(usedPermissions[id]);
    usedPermissions.splice(id, 1);
    this.setState({ unusedPermissions, usedPermissions });
  }

}

export default connect(null, null)(RolesManage);