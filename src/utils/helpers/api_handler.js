import axios from 'axios';
import { store } from 'src/index';

export function configureRequest(apiPath) {
  const temp_store = store.getState();
  const token = temp_store.session.token;
  axios.defaults.headers.common.Authorization = token || 'no~auth';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  // return window.sessionData.api + apiPath;
}

export function GETrequest(apiPath, config = {}) {
  const endPoint = configureRequest(apiPath);
  return axios.get(endPoint, config)
    .then(res => res)
    .catch(err => err.response);
}

export function POSTrequest(apiPath, data, config = {}) {
  const endPoint = configureRequest(apiPath);
  return axios.post(endPoint, data, config)
    .then(res => res)
    .catch(err => err.response);  
}

export function PUTrequest(apiPath, data, config = {}) {
  const endPoint = configureRequest(apiPath);
  return axios.put(endPoint, data, config)
    .then(res => res)
    .catch(err => err.response);
}

export function DELETErequest(apiPath, config = {}) {
  const endPoint = configureRequest(apiPath);
  return axios.delete(endPoint, config)
    .then(res => res)
    .catch(err => err.response);
}

export function GETaddress(searchCriteria) {
  const endPoint = `https://us-autocomplete-pro.api.smartystreets.com/lookup?key=3795161896457999660&search=${searchCriteria}`;
  return axios.get(endPoint)
    .then(res => res)
    .catch(err => Promise.reject(err));
}