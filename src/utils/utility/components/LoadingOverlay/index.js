import React from 'react';
import PropTypes from 'prop-types';

import sizify from '../Sizify';

import './LoadingOverlay.styles.css';


export class LoadingOverlay extends React.Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    indicatorHeight: PropTypes.string,
    size: PropTypes.object,
  };

  render() {
    const { width, height, show, children, indicatorHeight, size } = this.props;
    /* eslint-disable indent */
    return (
      <div className='LoadingOverlay_container' style={{ width, height }}>
        <div className={`LoadingOverlay_children${show ? ' blur' : ''}`}>
          {children}
        </div>
        { show
          ? <div className='LoadingOverlay_overlay'>
              <div
                className='LoadingOverlay_indicatorContainer'
                style={indicatorHeight ? { height: indicatorHeight } : {}}
              >
                <div className='LoadingOverlay_indicator' style={size.componentWidth > 750 ? { animationDuration: '750ms' } : {}} />
              </div>
            </div>
          : null
        }
      </div>
    );
    /* eslint-enable indent */
  }
}

export default sizify(LoadingOverlay);