import { cloneDeep } from 'lodash';

import { roleList } from './data';

import {
  GET_ROLES,
} from './constants';

const initialState = {
  roles: roleList,
};

function UserManagementReducer(state = initialState, action) {

  const newState = cloneDeep(state);

  switch (action.type) {

    case GET_ROLES: {
      // newState.roles = roleList
      return newState;
    }

    default:
      return state;
  }
}

export default UserManagementReducer;