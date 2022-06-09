import React from 'react';
import PropTypes from 'prop-types';

import { Paper } from '@material-ui/core';

import './FormWrapper.styles.css';


export class FormWrapper extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    instructions: PropTypes.string,
  };

  render() {
    return (
      <div className='FormWrapper_container'>
        <Paper elevation={2}>
          <h1 className='FormWrapper_title'>
            {this.props.title}
          </h1>
          <p className='FormWrapper_instructions'>{this.props.instructions}</p>
          <div className='FormWrapper_body'>
            {this.props.children}
          </div>
        </Paper>
      </div>
    );
  }
}

export default FormWrapper;