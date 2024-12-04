import React from "react";
import { connect } from "react-redux";
import { Switch, Redirect } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../components/homePage";
/* eslint-disable */
import ErrorPage from "../pages/error";
import Layout from "./Layout";
import "../styles/theme.scss";
import Login from "../pages/login";
import Register from "../pages/register";
import Tables from "../pages/tables/static/Static";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import { logoutUser } from "../actions/user";

const CloseButton = ({ closeToast }) => (
  <i onClick={closeToast} className="la la-close notifications-close" />
);

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          closeButton={<CloseButton />}
        />
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/error" exact component={ErrorPage} />

            <Route
              path="/app/tables"
              render={(props) => (
                <Layout>
                  <Tables {...props} />
                </Layout>
              )}
            />

            <Route
              path="/dashboard"
              render={(props) => (
                <Layout>
                  <Dashboard {...props} />
                </Layout>
              )}
            />

            <Route
              path="/profile"
              render={(props) => (
                <Layout>
                  <Profile {...props} />
                </Layout>
              )}
            />

            <Route
              path="/app"
              render={(props) => (
                <Layout>
                  <Switch>
                    <Redirect to="/login" />
                  </Switch>
                </Layout>
              )}
            />

            <Redirect to="/error" />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
