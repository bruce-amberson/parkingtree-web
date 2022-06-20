import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';

import 'utils/utility/components/Notifications/css/NotificationCard.styles.css';


class NotificationCard extends React.Component {

  static propTypes = {
    message: PropTypes.node.isRequired,
    messageType: PropTypes.oneOf(['success', 'error', 'genericError', 'warning']).isRequired,
    id: PropTypes.string.isRequired,
    onDismiss: PropTypes.func.isRequired,
  };

  state = {
    successMessageTimeoutID: null,
    cardClass: 'NotificationsCard_cardContainer_hide',
  };
  
  dismissHandle() {
    this.setState({
      cardClass: 'NotificationsCard_cardContainer_hide',
    }, () => {
      setTimeout(() => this.props.onDismiss(this.props.id), 300);
    });
  }

  componentDidMount() {
    if (this.props.messageType === 'success') {
      const successMessageTimeoutID = setTimeout(() => {
        this.dismissHandle();
      }, 3000);

      this.setState({
        successMessageTimeoutID,
      });
    }

    setTimeout(() => {
      this.setState({
        cardClass: 'NotificationsCard_cardContainer_show',
      });
    }, 10);
  }

  componentWillUnmount() {
    if (this.state.successMessageTimeoutID !== null) {
      clearTimeout(this.state.successMessageTimeoutID);
    }
  }

  render() {
    let colorBarClass = 'NotificationsCard_colorBarError';
    if (this.props.messageType === 'success') {
      colorBarClass = 'NotificationsCard_colorBarSuccess';
    }
    else if (this.props.messageType === 'warning') {
      colorBarClass = 'NotificationsCard_colorBarWarn';
    }

    return (
      <div className={this.state.cardClass}>
        <div className={colorBarClass} />
        <div className='NotificationsCard_messageBody'>
          { this.props.messageType === 'genericError'
              ? 'There was an issue communicating with the server. Please try again later, or contact my529 if you continue to experience this issue.'
              : this.props.message
          }
        </div>

        <Button 
          endIcon={<CloseIcon />}
          onClick={() => this.dismissHandle()}
        />
      </div>
    );
    
  }
}

export default NotificationCard;