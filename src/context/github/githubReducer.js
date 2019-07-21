import * as actions from '../types';

export default (state, action) => {
  switch (action.type) {
    case actions.SEARCH_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case actions.CLEAR_USERS:
      return {
        ...state,
        users: [],
        loading: false,
      };
    case actions.GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case actions.GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false,
      }
    case actions.SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  };
};