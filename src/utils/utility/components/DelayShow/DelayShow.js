import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';


class DelayShow extends React.Component {

  static propTypes = {
    timeoutCount: PropTypes.number.isRequired,
  };

  state = {
    opacity: 0,
  };

  update(timeoutCount) {
    setTimeout(() => {
      this.setState({
        opacity: 1
      });
    }, timeoutCount);
  }

  componentDidMount() {
    this.update(this.props.timeoutCount);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.update(this.props.timeoutCount);
    }
  }

  render() {
    return this.props.children(this.state.opacity);
  }
}

export default DelayShow;