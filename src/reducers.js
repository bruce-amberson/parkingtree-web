import { combineReducers } from 'redux';

import Session from 'ui/reducer';
import UserManagement from 'features/private/UserManagement/reducer'
import Notifications from 'utils/utility/components/Notifications/reducer';


/*
Ability to reinitialize the entire store.
This action type is used by /logout
*/
const rootReducer = (state, action) => {
  if (action.type === 'INITIALIZE_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};

const appReducer = combineReducers({
  session: Session,
  usermgmt: UserManagement,
  notifications: Notifications,
});

export default rootReducer;