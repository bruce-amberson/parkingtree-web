import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import {
  Button,
  Dialog,
  Slide,
  withStyles,
} from '@material-ui/core';

import CloseIcon from '@mui/icons-material/Close';

import { 
  LoadingOverlay,
  notificationShow,
  PasswordRequirements
} from 'utils/utility';

import FirstNameInput from 'utils/smartForm/components/FirstNameInput';
import LastNameInput from 'utils/smartForm/components/LastNameInput';
import EmailInput from 'utils/smartForm/components/EmailInput';
import PasswordInput from 'utils/smartForm/components/PasswordInput';
import CheckboxWithLabelInput from 'utils/smartForm/components/CheckboxWithLabelInput';

import { 
  clearSmartForm,
  checkRequiredInputs,
  prepInputList,
  updateInputList,
  updateInput,
} from 'utils/smartForm/helper';

import 'features/public/Register/styles.css';

const muiStyles = () => ({
  expansionPanelBody: {
    boxShadow: 'none',
  },
});

const select = (state) => ({
  passwordRequirements: state.session.passwordRequirements,
});

export class Register extends Component {

  static propTypes = {
    notificationShow: PropTypes.func.isRequired,
    passwordRequirements: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
  };

  state = {
    loading: false,
    isPasswordValid: false,
    pass: undefined,
    passConfirm: undefined,
    isReadingTerms: false,
    isCheckbox: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const inputList = cloneDeep(window.smartForm.inputList);
    const pass = inputList.find(input => input.inputName === 'pass');
    if (pass && pass.val !== prevState.pass) {
      if (pass) this.setState({ pass: pass.val });
    }
  }
  
  componentWillUnmount() {
    clearSmartForm();
  }

  render() {
    const { loading, isPasswordValid, pass, isReadingTerms, isCheckbox } = this.state;
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
              <div className='Register_title'>resident registration</div>
              <div className='Register_firstname'>
                <FirstNameInput
                  inputName='firstName'
                  isRequired={true}
                  labelText='First Name'
                  inputFocus={true}
                  style={{ width: '300px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Register_lastname'>
                <LastNameInput
                  inputName='lastName'
                  isRequired={true}
                  labelText='Last Name'
                  style={{ width: '300px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Register_username'>
                <EmailInput
                  inputName='userName'
                  isRequired={true}
                  labelText='User Name (email)'
                  style={{ width: '300px' }}
                  autoComplete={'off'}
                />
              </div>
              <div className='Register_pass'>
                <PasswordInput
                  inputName='pass'
                  isRequired={true}
                  labelText='Password'
                  style={{ width: '300px' }}
                  fieldUpdate={() => this.forceUpdate()}
                />
              </div>
              <div className='Register_passrequirements'>
                <div style={{ width: '300px', margin: 'auto' }}>
                  <PasswordRequirements
                    password={pass || ''}
                    passwordRequirements={this.props.passwordRequirements}
                    onPasswordCheck={() => this.setState({ isPasswordValid })}
                  />    
                </div>
              </div>
              <div className='Register_terms'>
                <CheckboxWithLabelInput 
                  inputName='terms'
                  labelText='Terms and Conditions'
                  isRequired={true}
                  updateError={() => this.setState({ isCheckbox: false })}
                  hasError={isCheckbox}
                /><br />
                <Button
                  style={{ width: '250px' }}
                  onClick={() => this.setState({ isReadingTerms: true })}
                >
                  Read Terms and Conditions
                </Button>
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

        <Dialog fullScreen open={isReadingTerms} onClose={null} TransitionComponent={Transition}>
          <div className='Register_terms_close'>
            <Button
              style={{ cursor: 'grab' }}
              onClick={() => this.setState({ isReadingTerms: false })}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className='Register_terms_text'>
            <strong>Terms and Conditions</strong><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              variant='contained'
              style={{ width: '250px', marginBottom: '100px' }}
              onClick={() => this.acceptTerms()}
            >
              Ok, enough!
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  register(e) {
    e.preventDefault();
    const list = cloneDeep(window.smartForm.inputList);
    const validationObject = checkRequiredInputs(list);
  
    if (validationObject.isValid) {
      const result = prepInputList(validationObject.list);
      console.log(result);
    }
    else {
      const termsCheckbox = list.find(input => input.inputName === 'terms');
      if (!termsCheckbox.val) {
        this.setState({ isCheckbox: true })
      }

      updateInputList(validationObject.list);
      this.forceUpdate();
    }
  }

  acceptTerms() {
    const checkBoxIndex = window.smartForm.inputList.findIndex(input => input.inputName === 'terms');
    updateInput(checkBoxIndex, { inputName: 'terms', val: true, isValid: true });
    this.setState({ isReadingTerms: false }); // close buttom page
  }
}

export default withStyles(muiStyles)(connect(select, {
  notificationShow,
})(Register));

const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction='up' ref={ref} {...props} />;
});