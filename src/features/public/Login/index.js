import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import {
  Button,
  withStyles,
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

import { coreColors } from 'ui/themes/parkingtree/parkingtreeTheme';
import 'features/public/Login/styles.css';

const muiStyles = {
  root: {
    color: coreColors.primary,
    top: '0px',
    marginBottom: '0px',
  }
}

export class Login extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const { classes } = this.props;
    return (
      <div className='Login_formContainer'>
        <LoadingOverlay
          show={loading}
          width='100%'
        > 
          <form onSubmit={this.loginUser}>
            <div className='Login_Container'>
              <div className='Login_logo'>
                <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' /><br />
                <h1><font style={{ color: coreColors.primary }}>The all-in-one parking platform</font><br/>
                for multifamily communities</h1>
              </div>
              <div className='Login_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='User Name'
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
                <Button
                  style={{ width: '300px' }}
                  className={classes.root}
                  onClick={() => this.goToRoute('/forgot-password')}
                >
                  forgot password
                </Button><br />
                <Button
                  style={{ width: '300px' }}
                  className={classes.root}
                  onClick={() => this.goToRoute('/forgot-username')}
                >
                  forgot username
                </Button><p />
                
                Don't have an account?<br />
                <Button
                  style={{ width: '250px' }}
                  className={classes.root}
                  onClick={() => this.goToRoute('/register')}
                >
                  sign up
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

export default withStyles(muiStyles)(connect(null, {
  userLogin,
  notificationShow,
})(Login));