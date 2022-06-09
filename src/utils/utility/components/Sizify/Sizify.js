/*
*
* Sizify
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';


function sizify(WrappedComponent) {
  const Sizified = class extends React.Component { // eslint-disable-line react/display-name

    static propTypes = {
      size: PropTypes.object.isRequired,
    };

    state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };

    windowDimensionsSet = () => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }

    componentDidMount() {
      window.addEventListener('resize', this.windowDimensionsSet);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.windowDimensionsSet);
    }

    render() {
      const { size, ...otherProps } = this.props;
      const sizeProps = {
        windowWidth: this.state.windowWidth,
        windowHeight: this.state.windowHeight,
        componentWidth: size.width,
        componentHeight: size.height,
      };
      return <WrappedComponent size={sizeProps} { ...otherProps } />;
    }
  };

  return sizeMe({ monitorHeight: true })(Sizified);
}

export default sizify;
