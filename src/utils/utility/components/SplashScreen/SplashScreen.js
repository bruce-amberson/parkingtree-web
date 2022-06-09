/*
*
* SplashScreen Component
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  Fade,
} from '@material-ui/core';

import splashScreenDesktopLogo from './Splash_Desktop.gif';
import splashScreenMobileLogo from './Splash_Mobile.gif';

import './SplashScreen.styles.css';

const desktopWidth = '1024px';
const fadeExitDuration = 500;
const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Fade ref={ref} {...props} timeout={{ enter:0, exit: fadeExitDuration }} />;
});


export class SplashScreen extends React.Component {
  static propTypes = {
    isAppLoading: PropTypes.bool.isRequired,
    toggleSplashHasDisplayed: PropTypes.func.isRequired,
    splashHasDisplayed: PropTypes.bool.isRequired,
  };

  state = {
    isSmallScreen: window.innerWidth <= parseInt(desktopWidth),
    displaySplash: true,
  };

  componentDidMount() {
    const { isAppLoading, splashHasDisplayed, toggleSplashHasDisplayed } = this.props;
    
    if (isAppLoading || !splashHasDisplayed) {
      // sets minimum time for splash animation to run, even if account list is loaded earlier
      setTimeout(() => this.setState({ displaySplash: false }), 3000);
    }
    else {
      // prevents splash screen running after initial login
      this.setState({ displaySplash: false });
      toggleSplashHasDisplayed();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isAppLoading, toggleSplashHasDisplayed } = this.props;
    const { displaySplash } = this.state;

    if ((!isAppLoading && !displaySplash && prevState.displaySplash) // triggers if app has loaded before min display time
    || (!isAppLoading && prevProps.isAppLoading && !displaySplash)) { // triggers if app finished loading after min display time
      setTimeout(() => toggleSplashHasDisplayed(), fadeExitDuration); // delays splashHasDisplayed toggle by extra Fade exit time
    }
  }

  render() {
    const { displaySplash, isSmallScreen, } = this.state;
    const { isAppLoading, } = this.props;

    return (
      <Dialog
        fullScreen
        open={isAppLoading || displaySplash}
        onClose={null}
        TransitionComponent={Transition}
      >
        <div className='SplashScreen_splashScreenContainer'>
          <div className='SplashScreen_splashScreen'>
            <img 
              src={isSmallScreen ? splashScreenMobileLogo : splashScreenDesktopLogo} 
              alt='spashLogo' 
              className='SplashScreen_splashScreenLogo'
            />
            <div className='SplashScreen_pulsingOne' />
            <div className='SplashScreen_pulsingTwo' />
            <div className='SplashScreen_pulsingThree' />
          </div>
        </div>
      </Dialog>
    );
  }
}


export default SplashScreen;