/*
*
* StyledLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './StyledLink.styles.css';


class StyledLink extends React.Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
  };

  render() {
    return (
      <NavLink
        to={this.props.to}
        className='StyledLink_link'
      >
        {this.props.children}
      </NavLink>
    );
  }
}

export default StyledLink;
