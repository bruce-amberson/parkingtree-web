import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE,
  ALL_NOTIFICATIONS_HIDE,
} from './constants';
import { v4 as uuidv4 } from 'uuid';


export function notificationShow(message, messageType) {
  const id = uuidv4();
  return {
    type: NOTIFICATION_SHOW,
    id,
    message,
    messageType,
  };
}

export function notificationHide(id) {
  return {
    type: NOTIFICATION_HIDE,
    id,
  };
}

export function allNotificationsHide() {
  return {
    type: ALL_NOTIFICATIONS_HIDE,
  };
}
