import { GETrequest } from 'utils/helpers/api_handler';
import {
  GET_ROLES,
} from './constants';

export function getRoles() {
  const payload = GETrequest('/roles');
  return {
    type: GET_ROLES,
    payload,
  };
}