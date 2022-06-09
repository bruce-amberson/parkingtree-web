import { cloneDeep } from 'lodash';
import {
  LOGIN,
  BROWSER_WARNING,
  MOBILE_WARNING,
  TOGGLE_SIDENAV,
} from './constants';

const initialState = {
  isAuthenticated: false,
  token: '',
  userDetails: {},
  errors: [],

  disableLeftNavigationMenu: false,
  sideNavOpen: false,
};

export default function Session(state = initialState, action) {
  
  const newState = cloneDeep(state);

  switch (action.type) {
    
    case LOGIN: { 
      // newState.errors = [];
      // newState.token = action.payload.data.Token;
      const payload = action.payload;
      debugger;
      if (payload.userName === 'b@a.com' && payload.password === 'gosteep') {
        newState.isAuthenticated = true;
        newState.userDetails.name = 'Bruce Amberson';
      }
      
      return newState;
    }
    
    case BROWSER_WARNING: {
      newState.showBrowserWarning = !state.showBrowserWarning;
      return newState;
    }

    case MOBILE_WARNING: {
      newState.showMobileWarning = !state.showMobileWarning;
      return newState;
    }

    case TOGGLE_SIDENAV: {
      newState.sideNavOpen = !state.sideNavOpen;
      return newState;
    }

    default: 
      return newState;
  }
}