import React, { Component } from 'react';

import SideNav from 'ui/Authenticated/SideNav';
import Container from 'ui/Authenticated/Container';

import 'ui/Authenticated/styles.css';

export class Authenticated extends Component {

  render() {
    return (
      <div className='Authenticated_AppContainer'>
        <div className='Authenticated_sidNav'><SideNav /></div>
        <div className='Authenticated_appContainer'><Container /></div>
      </div>
    );
  }
}

export default Authenticated;