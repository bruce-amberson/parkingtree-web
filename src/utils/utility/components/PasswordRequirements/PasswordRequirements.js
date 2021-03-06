import React from 'react';
import PropTypes from 'prop-types';

import {
  LinearProgress,
  withStyles,
} from '@material-ui/core';

import { CheckCircle } from '@material-ui/icons';

import './PasswordRequirements.styles.css';

const styles = theme => ({
  progressRoot: {
    backgroundColor: theme.palette.grey['300'],
    width: '50%',
  },
  progressRed: {
    backgroundColor: theme.palette.error.main,
  },
  progressYellow: {
    backgroundColor: theme.palette.common.warn,
  },
  progressGreen: {
    backgroundColor: '#41AD49',
  },
});


export class PasswordRequirements extends React.Component {

  static propTypes = {
    passwordRequirements: PropTypes.array.isRequired,
    password: PropTypes.string.isRequired,
    onPasswordCheck: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    passwordRequirements: [],
  };

  componentDidUpdate(prevProps) {
    const { password, passwordRequirements, onPasswordCheck } = this.props;
    if (password !== prevProps.password) {
      if (this.passwordCheck(password, passwordRequirements)) {
        onPasswordCheck(true);
      }
      else {
        onPasswordCheck(false);
      }
    }
  }

  render() {
    return (
      <div className='PasswordRequirements_container'>
        {this.progressBarCompose()}
        <div className='PasswordRequirements_requirementsContainer'>
          {this.requirementsCompose()}
        </div>
      </div>
    );
  }

  passwordCheck(password, pwdReqs) {
    return pwdReqs.every(req => this.requirementCheck(password, req));
  }

  progressBarCompose() {
    let progressClass;
    let progress = 0;
    const { passwordRequirements: requirements, classes } = this.props;

    requirements.forEach(req => {
      if (this.requirementCheck(this.props.password, req)) {
        progress = progress + (100 / requirements.length);
      }
    });

    if (progress >= 0 && progress <= 40) {
      progressClass = classes.progressRed;
    }
    else if (progress >= 50 && progress <= 90) {
      progressClass = classes.progressYellow;
    }
    else {
      progressClass = classes.progressGreen;
    }

    return (
      <div className='PasswordRequirements_progressBarContainer'>
        <span>Weak</span>
        <LinearProgress
          variant='determinate'
          value={progress}
          classes={{
            root: classes.progressRoot,
            bar: progressClass,
          }}
        />
        <span>Strong</span>
      </div>
    );
  }

  requirementCheck(password, req) {
    return password.search(req.PasswordRegularExpression) === 0;
  }

  requirementsCompose() {
    const { passwordRequirements, password } = this.props;
    const requirements = passwordRequirements.map(req => {
      
      let checkColor = 'silver';
      if (this.requirementCheck(password, req)) {
        checkColor = 'green';
      }

      return (
        <div
          key={req.PasswordRequirementId}
          className='PasswordRequirements_requirement'
        >
          <CheckCircle style={{ color: checkColor }} />
          <span style={{ color: '#666', marginLeft: '5px' }}>{req.RequirementDescription}</span>
        </div>
      );
    });

    return (
      <div>
        {requirements}
      </div>
    );
  }
}

export default withStyles(styles)(PasswordRequirements);
