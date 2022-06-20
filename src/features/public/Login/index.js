import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import {
  Button,
} from '@material-ui/core';

import { 
  LoadingOverlay,
  notificationShow,
} from 'utils/utility';

import EmailInput from 'utils/smartForm/components/EmailInput';
import PasswordInput from 'utils/smartForm/components/PasswordInput';

import { 
  clearSmartForm,
  checkRequiredInputs,
  prepInputList,
  updateInputList,
} from 'utils/smartForm/helper';

import { userLogin } from 'ui/actions';

import 'features/public/Login/styles.css';

export class Login extends Component {

  static propTypes = {
    userLogin: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  };

  componentWillUnmount() {
    clearSmartForm();
  }

  render() {
    const { loading } = this.state;
    return (
      <div className='Login_formContainer'>
        <LoadingOverlay
          show={loading}
          width='100%'
        > 
          <form onSubmit={this.loginUser}>
            <div className='Login_Container'>
              <div className='Login_logo'>
                <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
              </div>
              <div className='Login_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='User Name (eMail)'
                  style={{ width: '250px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Login_pass'>
                <PasswordInput
                  inputName='password'
                  isRequired={true}
                  labelText='Password'
                  style={{ width: '250px' }}
                />
              </div>
              <div className='Login_btn'>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  style={{ width: '250px' }}
                  onClick={e => this.loginUser(e)}
                >
                  LOG IN
                </Button>
              </div>
              <div className='Login_links'>
                <a href='/register'>Register</a><br />
                <a href='/forgot-password'>Forgot Password</a>
              </div>
            </div>
          </form>              
        </LoadingOverlay>
      </div>
    );
  }

  loginUser(e) {
    e.preventDefault();
    const list = cloneDeep(window.smartForm.inputList);
    const validationObject = checkRequiredInputs(list);
    if (validationObject.isValid) {
      const result = prepInputList(validationObject.list);
      this.setState({ loading: true });
      this.props.userLogin(result);
    }
    else {
      updateInputList(validationObject.list);
      this.forceUpdate();
    }
  }

  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

}

export default connect(null, {
  userLogin,
  notificationShow,
})(Login);