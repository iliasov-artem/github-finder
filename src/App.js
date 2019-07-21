import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Users from './Components/Users';
import User from './Components/User';
import Search from './Components/Search';
import Alert from './Components/Alert';
import About from './Components/pages/About';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Search github users
  const searchUsers = async (text) => {
    setLoading(true);
    const { data: { items } } = await axios
      .get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUsers(items);
    setLoading(false);
  };

  // Get single github user
  const getUser = async (username) => {
    setLoading(true);
    const { data } = await axios
      .get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUser(data);
    setLoading(false);
  }

  // Get users repos

  const getUserRepos = async (username) => {
    setLoading(true);
    const { data } = await axios
      .get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setRepos(data);
    setLoading(false);
  }

  // Clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  // Show alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route exact path='/' render={props =>(
              <>
                <Search
                  searchUsers={searchUsers}
                  clearUsers={clearUsers}
                  showClear={users.length > 0 ? true : false}
                  setAlert={showAlert}
                />
                <Users loading={loading} users={users} />
              </>
            )} />
            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={props => (
              <User
                {...props}
                getUser={getUser}
                getUserRepos={getUserRepos}
                user={user}
                repos={repos}
                loading={loading}
              />
            )} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
