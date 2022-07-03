import React from 'react';
import PropTypes from 'prop-types';

import { Paper } from '@material-ui/core';

import './Card.styles.css';


function Card({ title, children, className, zDepth = 1, onClick, onMouseEnter, onMouseLeave }) {

  return (
    <div className={className || ''}>
      <Paper
        elevation={zDepth}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ height: '100%' }}
      >
        <div className='Card_container'>
          <span className='Card_cardTitle'>{title}</span>
          <div className='Card_children'>{children}</div>
        </div>
      </Paper>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  zDepth: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Card;
