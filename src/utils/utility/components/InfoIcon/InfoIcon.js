import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  withStyles,
} from '@material-ui/core';

import Tippy from '@tippyjs/react';

import './InfoIcon.styles.css';


const styles = theme => ({
  icon: {
    color: theme.palette.secondary.main,
    fontSize: '22px',
    cursor: 'pointer',
  },
});


export function InfoIcon({ message, tippyProps, classes }) {
  return (
    <Tippy
      content={message}
      animation='scale'
      theme='my529'
      delay={[200, 0]}
      {...tippyProps}
    >
      <Icon className={classes.icon}>info_outline</Icon>
    </Tippy>
  );
}

InfoIcon.propTypes = {
  message: PropTypes.node.isRequired,
  tippyProps: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoIcon);
