import React, { Component } from 'react';

import 'ui/Authenticated/Container/style.css';

export class Container extends Component {

  render() {
    return (
      <div className='Container_container'>
        <div className='Container_logo'>
          <img src={ require('ui/media/parkingtree/logo.png') } alt='The Parking Tree' width='325px' />
        </div>
        <div className='Container_body'>Body</div>
      </div>
    );
  }
}

export default Container;