import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { notificationHide } from './actions';

import NotificationCard from './NotificationCard';

import 'utils/utility/components/Notifications//css/Notifications.styles.css';

const select = (state) => ({
  notifications: state.notifications,
  all: state
});

export class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    notificationHide: PropTypes.func.isRequired,
  };

  notificationsCompile() {
    return this.props.notifications.map(notification => {
      return (
        <NotificationCard
          key={notification.id}
          id={notification.id}
          message={notification.message}
          messageType={notification.messageType}
          onDismiss={this.props.notificationHide}
        />
      );
    });
  }

  render() {
    return (
      <div className='Notifications_container'>
        {this.notificationsCompile()}
      </div>
    );
  }
}

export default connect(select, { notificationHide })(Notifications);