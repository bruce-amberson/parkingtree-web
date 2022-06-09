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

import { 
  clearSmartForm,
  checkRequiredInputs,
  prepInputList,
  updateInputList,
} from 'utils/smartForm/helper';

import { userLogin } from 'ui/actions';

import 'features/public/ForgotPassword/styles.css';

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
      <div className='Forgot_formContainer'>
        <LoadingOverlay
          show={loading}
          width='100%'
        > 
          <form onSubmit={this.loginUser}>
            <div className='Forgot_Container'>
              <div className='Forgot_logo'>
                <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
              </div>
              <div className='Forgot_title'>forgot password</div>
              <div className='Forgot_explanation'>
                <p>After you submit your username or email address, we'll email you a code you can use to change your password.</p>
                If you don't receive an email within 10 minutes, please check your spam/junk folder and adjust your filtering by allowing emails from noreply@parkingtreeco.com.
              </div>
              <div className='Forgot_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='Email'
                  style={{ width: '250px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Forgot_btn'>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  style={{ width: '250px' }}
                  onClick={e => this.loginUser(e)}
                >
                  SUBMIT
                </Button>
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
      alert(result);
    }
    else {
      updateInputList(validationObject.list);
      this.forceUpdate();
    }
  }

}

export default connect(null, {
  userLogin,
  notificationShow,
})(Login);