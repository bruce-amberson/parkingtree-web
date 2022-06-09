// import { POSTrequest } from 'utils/helpers/api_handler';
import {
  INITIALIZE_STORE,
  LOGIN,
  BROWSER_WARNING,
  MOBILE_WARNING,
  TOGGLE_SIDENAV
} from './constants';

/////////////////////////////// AUTHENTICATION //////////////////////////////////
export function userLogin(body) {
  // const response = POSTrequest('/authentication/login', body);
  return {
    type: LOGIN,
    payload: body
  };
}

export function userLogout() {
  // const response = POSTrequest('/authentication/logout', body);
  return {
    type: INITIALIZE_STORE,
  };
}

export function setBrowserWarning() {
  return {
    type: BROWSER_WARNING,
  };
}

export function setMobileWarning() {
  return {
    type: MOBILE_WARNING,
  };
}

export function clearStore() {
  return {
    type: INITIALIZE_STORE
  };
}

export function toggleSidenav(isOpen) {
  return {
    type: TOGGLE_SIDENAV,
    meta: { isOpen }
  };
}