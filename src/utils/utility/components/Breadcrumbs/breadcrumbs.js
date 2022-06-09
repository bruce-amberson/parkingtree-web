import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@material-ui/core';

export class BreadCrumbs extends Component {

  static propTypes = {
    crumbs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        route: PropTypes.string,
      })
    ).isRequired,
  };

  render() {    
    return (
      <div style={{ display: 'flex' }}>
        {this.renderCrumbs()}
      </div>
    );
  }

  renderCrumbs() {
    const linkStyle = {
      position: 'relative', 
      top: '-7px', 
      left: '1px',
      fontSize: '12pt'
    };

    const textStyle = {
      position: 'relative', 
      top: '1px', 
      left: '-1px',
      fontSize: '12pt'
    };
    
    return this.props.crumbs.map((crumb, index) => {
      const rightArrow = index !== this.props.crumbs.length - 1 
        ? <Icon key={`icon-${crumb.title}`} className='material-icons'>keyboard_arrow_right</Icon>
        : '';
      const theStyle = index !== this.props.crumbs.length - 1 ? linkStyle : textStyle;
      if (crumb.route) {
        return (
          <div key={`link-${crumb.title}`}>
            <a 
              href={crumb.route}
              onClick={(event) => {
                event.preventDefault();
                // this.goToRoute(crumb.title, crumb.route);
              }}
              style={theStyle}
            >
              {crumb.title}
            </a>
            {rightArrow}
          </div>
        );
      }
      else {
        return (
          <div key={`text-${crumb.title}`} style={{ position: 'relative', top: '4px' }}>
            {crumb.title}
            {rightArrow}
          </div>
        );
      }
    });
  }

}

export default BreadCrumbs;