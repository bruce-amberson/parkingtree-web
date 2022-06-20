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

import DomesticPhoneInput from 'utils/smartForm/components/DomesticPhoneInput';

import { 
  clearSmartForm,
  checkRequiredInputs,
  prepInputList,
  updateInputList,
} from 'utils/smartForm/helper';

import { userLogin } from 'ui/actions';

import 'features/public/ForgotUsername/styles.css';

export class ForgotUsername extends Component {

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
              <div className='Forgot_title'><p />forgot username</div>
              <div className='Forgot_explanation'>
                <p>Your username is your email address.</p>
                If the email address you are using doesn't work you can enter your mobile phone number.<br />
                If it is one record we can text you the associated email address.<p/>
              </div>
              <div className='Forgot_phone'>
                <DomesticPhoneInput
                  inputName='phone'
                  isRequired={true}
                  labelText='Mobile Phone'
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
      console(result);
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
})(ForgotUsername);