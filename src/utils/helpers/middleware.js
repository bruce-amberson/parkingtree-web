import { notificationShow } from 'utils/utility';

export const middleWare = store => next => action => {
  
  // debugger; // eslint-disable-line
  
  const { payload } = action;
  
  if (payload) { // Handle asynchronous API Response
    
    // debugger; // eslint-disable-line
    
    const errorMsg = [];
    const warningMsg = [];
    const infoMsg = [];
    const inputMsg = [];
    
    if (payload.status >= 299 && payload.status < 400) { // Redirection
      errorMsg.push('A temporary redirect was issued by the server.'); 
      window.location.href = '/';
    } 
    else if (payload.status === 400) { // payload.data may be an array of messages.
      debugger;
      if (payload.data && payload.data.length > 0) {
        payload.data.forEach(msg => {
          switch (msg.MessageType) {
            case 0: infoMsg.push(msg.Message); break;
            case 1: warningMsg.push(msg.Message); break;
            case 2: {
              if (!msg.Field) {
                errorMsg.push(msg.Message);
                break;
              }
              else if (msg.Field !== '') {
                inputMsg.push(msg.Message);
                break;
              }
              break;
            }
            default: break;
          }
        });
      }
      else {
        errorMsg.push('A bad request or invalid credentials were provided. No messages were provided. Status: 400.');
      }
    }
    else if (payload.status === 401) { // Likely invalid token
      // import('src/ViewContainer/actions') // have to import now instead of at the beginning of file because otherwise fails in tests
      //   .then(({ clearStore }) => {
      //     store.dispatch(clearStore());
      //   });
    }
    else if (payload.status === 403) { // Likely user doesn't have needed Claim/Permission
      errorMsg.push('Unauthorized request.');
    }
    else if (payload.status === 404) {
      errorMsg.push('Not found');
    }
    else if (payload.status > 404 && payload.status < 409) { 
      errorMsg.push('You are attempting an action that is not allowed. Contact my529 if you continue to experience this issue.');
    }
    else if (payload.status === 409) { // race condition
      errorMsg.push('You are attempting to modify a record that is in the process of being modified.');
    }
    else if (payload.status === 412) {
      infoMsg.push('Precondition Failed!'); // TODO look into correct message
    }
    else if (payload.status > 409 && payload.status < 600) {
      errorMsg.push('There was an issue communicating with the server. Please try again later, or contact my529 if you continue to experience this issue.');
    }

    if (errorMsg.length > 0) {
      errorMsg.forEach(error => store.dispatch(notificationShow(error, 'error')));
      const updatedAction = action;
      updatedAction.type = `${action.type}_ERRORS`;
      next(updatedAction);
      return Promise.reject(action);
    }

    if (inputMsg.length > 0) {
      const updatedAction = action;
      updatedAction.type = `${action.type}_ERRORS`;
      next(updatedAction);
      return Promise.reject(action);
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach(warning => store.dispatch(notificationShow(warning, 'warning')));
    }

    if (infoMsg.length > 0) {
      infoMsg.forEach(info => store.dispatch(notificationShow(info, 'warning')));
    }

    return next(action);
  }
  else { // Synchronous actions
    return next(action);
  }
  
};