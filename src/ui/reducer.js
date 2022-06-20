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
  passwordRequirements: [
    {
      ApplicationPasswordRequirements: null,
      ChangeState: 0,
      PasswordRegularExpression: "^.{8,1000}$",
      PasswordRequirementId: 3,
      RequirementDescription: "Must be at least eight characters long.",
      SecurityLevel: 2,
      SecurityPoints: 1,
    },
    {
      ApplicationPasswordRequirements: null,
      ChangeState: 0,
      PasswordRegularExpression: "^(?=.*\\d).{1,1000}$",
      PasswordRequirementId: 4,
      RequirementDescription: "Must contain a numeric character.",
      SecurityLevel: 3,
      SecurityPoints: 1,
    },
    {
      ApplicationPasswordRequirements: null,
      ChangeState: 0,
      PasswordRegularExpression: "^(?=.*[^0-9a-zA-Z]).{1,1000}$",
      PasswordRequirementId: 5,
      RequirementDescription: "Must contain a special character.",
      SecurityLevel: 4,
      SecurityPoints: 1,
    },
    {
      ApplicationPasswordRequirements: null,
      ChangeState: 0,
      PasswordRegularExpression: "^(?=.*[A-Z]).{1,1000}$",
      PasswordRequirementId: 6,
      RequirementDescription: "Must contain an uppercase letter.",
      SecurityLevel: 1,
      SecurityPoints: 1,
    },
    {
      ApplicationPasswordRequirements: null,
      ChangeState: 0,
      PasswordRegularExpression: "^(?=.*[a-z]).{1,1000}$",
      PasswordRequirementId: 7,
      RequirementDescription: "Must contain a lowercase letter.",
      SecurityLevel: 1,
      SecurityPoints: 1,
    }
  ],

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