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

import 'features/public/Register/styles.css';

export class Register extends Component {

  static propTypes = {
    notificationShow: PropTypes.func.isRequired,
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
      <div className='Register_formContainer'>
        <LoadingOverlay
          show={loading}
          width='100%'
        > 
          <form onSubmit={this.loginUser}>
            <div className='Register_Container'>
              <div className='Register_logo'>
                <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
              </div>
              <div className='Register_title'>register a new account</div>
              <div className='Register_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='User Name'
                  style={{ width: '250px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Register_pass'>
                <PasswordInput
                  inputName='password'
                  isRequired={true}
                  labelText='Password'
                  style={{ width: '250px' }}
                />
              </div>
              <div className='Register_btn'>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  style={{ width: '250px' }}
                  onClick={e => this.register(e)}
                >
                  REGISTER
                </Button>
              </div>
            </div>
          </form>              
        </LoadingOverlay>
      </div>
    );
  }

  register(e) {
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
  notificationShow,
})(Register);