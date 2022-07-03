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
          <form onSubmit={this.forgotPasswordSubmit}>
            <div className='Forgot_Container'>
              <div className='Forgot_logo'>
                <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
              </div>
              <div className='Forgot_title'><p />forgot password</div>
              <div className='Forgot_explanation'>
                <p>After you submit your username or email address,<br />
                we'll email you a link you can click to change your password.</p>
            
                If you don't receive a text within 10 minutes, please contact support.
              </div>
              <div className='Forgot_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='Email'
                  style={{ width: '300px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Forgot_btn'>
                <Button
                  type='submit'
                  disabled={loading}
                  style={{ width: '150px' }}
                  onClick={() => this.goToRoute('/')}
                >
                  cancel
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  style={{ width: '150px' }}
                  onClick={e => this.forgotPasswordSubmit(e)}
                >
                  send
                </Button>
              </div>
            </div>
          </form>              
        </LoadingOverlay>
      </div>
    );
  }

  forgotPasswordSubmit(e) {
    e.preventDefault();
    const list = cloneDeep(window.smartForm.inputList);
    const validationObject = checkRequiredInputs(list);
    if (validationObject.isValid) {
      const result = prepInputList(validationObject.list);
      console.log(result);
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