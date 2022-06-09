import _ from 'lodash';
import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
  ALL_NOTIFICATIONS_HIDE,
} from './constants';

const initialState = [];

function NotificationsReducer(state = initialState, action) {
  
  let newState = _.cloneDeep(state); // eslint-disable-line prefer-const

  switch (action.type) {
    
    case NOTIFICATION_SHOW: {
      newState.push({
        id: action.id,
        message: action.message,
        messageType: action.messageType,
      });
      return newState;
    }

    case NOTIFICATION_HIDE: {
      newState.forEach((notification, index) => {
        if (notification.id === action.id) {
          return newState.splice(index, 1);
        }
      });
      return newState;
    }
    
    case ALL_NOTIFICATIONS_HIDE: {
      return initialState;
    }
    
    default: {
      return newState;
    }
  }

}

export default NotificationsReducer;