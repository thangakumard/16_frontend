import React from "react";
import { Redirect } from "react-router-dom";
import Layout from "./shared/Layout";

import { login, signup } from "../api/auth";
import PageError from "./shared/PageError";

import * as storage from "../helpers/local-storage";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./Dashboard/Dashboard";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: storage.getUserInfo(),
      loading: false,
      email: null,
      password: null,
      erroMessage: null
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }
  async componentDidMount() {
    if (this.state.loggedInUser.token) {
      //await this.getAssignments();
    }
  }

  setInputValue = ({ target: { id, value } }) => {
    this.setState({
      [id]: value
    });
  };

  submitLogin = async e => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    const result = await login(user);
    if (result.token) {
      const userInfo = {
        token: result.token,
        id: result.user_info._id,
        isAdmin: result.user_info.isAdmin,
        userName: result.user_info.first_name
      };
      storage.setUserInfo(userInfo);
      this.setState({
        loggedInUser: userInfo
      });
      //await this.getAssignments();
      return <Redirect to="/students"></Redirect>;
    } else {
      this.setState({
        errorMessage: result.message
      });
    }
  };
  signupUser = e => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
      first_name: this.state.firstName,
      last_name: this.state.lastName
    };
    const result = signup(user);
    if (result.token) {
      return <Redirect to="/login"></Redirect>;
    } else {
      this.setState({
        errorMessage: result.message
      });
    }
  };

  render() {
    const { loading, errorMessage, loggedInUser } = this.state;
    if (loading) return <span />;
    const isLoggedIn = loggedInUser.id ? true : false;
    return (
      <React.Fragment>
        {isLoggedIn ? (
          
            <Dashboard></Dashboard>
          
        ) : (
          <React.Fragment>
            <Layout
              isLoggedIn={isLoggedIn}
              isAdmin={loggedInUser.isAdmin}
            ></Layout>
            <PageError errorMessage={errorMessage}></PageError>
            <LoginForm
              setInputValue={this.setInputValue}
              submitLogin={this.submitLogin}
            ></LoginForm>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default App;
