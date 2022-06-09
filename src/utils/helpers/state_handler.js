export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('parkingtree_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  const serializedState = JSON.stringify(state);
  sessionStorage.setItem('parkingtree_state', serializedState);
};

export const clearState = (state) => { // eslint-disable-line no-unused-vars
  sessionStorage.removeItem('parkingtree_state');
};