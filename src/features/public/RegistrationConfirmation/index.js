import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
} from '@material-ui/core';

import { 
  notificationShow,
} from 'utils/utility';

import 'features/public/RegistrationConfirmation/styles.css';

export class RegistrationConfirmation extends Component {

  static propTypes = {
    userLogin: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  };

  componentDidMount() {
    // load confirmation
  }

  render() {
    return (
      <div className='RegistrationConfirmation_container'>
        <div className='RegistrationConfirmation_organizer'>
          <div className='RegistrationConfirmation_logo'>
            <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
          </div>
          <div className='RegistrationConfirmation_contents'>
            Successful sign up.<br />
            <Button
              style={{ width: '250px' }}
              onClick={() => this.goToRoute('/')}
            >
              Click here to login.
            </Button>
          </div>
        </div>
      </div>
    );
  }

  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

}

export default connect(null, {
  notificationShow,
})(RegistrationConfirmation);