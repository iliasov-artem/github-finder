import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import * as actions from '../types';

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET; 
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search users

  const searchUsers = async (text) => {
    setLoading();
    const { data: { items } } = await axios
      .get(`https://api.github.com/search/users?q=${text}&client_id=${githubClientId}
      &client_secret=${githubClientSecret}`);
    dispatch({
      type: actions.SEARCH_USERS,
      payload: items,
    });
  };

  // Get user
  const getUser = async (username) => {
    setLoading();
    const { data } = await axios
      .get(`https://api.github.com/users/${username}?client_id=${githubClientId}
      &client_secret=${githubClientSecret}`);

    dispatch({
      type: actions.GET_USER,
      payload: data,
    });
  };
  // Get repos
  const getUserRepos = async (username) => {
    setLoading();
    const { data } = await axios
      .get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}
      &client_secret=${githubClientSecret}`);
    dispatch({
      type: actions.GET_REPOS,
      payload: data,
    });
  };

  // Clear users
  const clearUsers = () => dispatch({ type: actions.CLEAR_USERS });

  // Set loading
  const setLoading = () => dispatch({ type: actions.SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>)
}

export default GithubState;
