import { combineReducers } from 'redux';

import Notifications from 'utils/utility/components/Notifications/reducer';
import Session from 'ui/reducer';


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
  notifications: Notifications,
  session: Session,
});

export default rootReducer;