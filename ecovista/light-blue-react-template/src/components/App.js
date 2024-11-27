import React from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router';
// import { HashRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from '../components/homePage'; 
/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';
import '../styles/theme.scss';
import LayoutComponent from './Layout';
import Login from '../pages/login';
import Register from '../pages/register';
import Tables from '../pages/tables/static/Static';
import Dashboard from '../pages/dashboard/Dashboard';
import { logoutUser } from '../actions/user';

const PrivateRoute = ({dispatch, component, ...rest }) => {
    if (!Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
        dispatch(logoutUser());
        return (<Redirect to="/login"/>)
    } else {
        return ( // eslint-disable-line
            <Route {...rest} render={props => (React.createElement(component, props))}/>
        );
    }
};

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  render() {
    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
    <Router>
    <Switch>
                    {/* Public Routes - These should come first */}
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/error" exact component={ErrorPage} />
                    <Route path="/app/tables" exact component={Tables} />
                    {/* Protected Routes - Using a more specific structure */}
                    {/* <Route 
                        path="/app/tables"
                        render={(props) => (
                            <Layout>
                                <Tables {...props} />
                            </Layout>
                        )}
                    /> */}

                    <Route 
                        path="/dashboard" 
                        render={(props) => (
                            <Layout>
                                <Dashboard {...props} />
                            </Layout>
                        )}
                    />

                    <Route 
                        path="/tables" 
                        render={(props) => (
                            <Layout>
                                <Tables {...props} />
                            </Layout>
                        )}
                    />

                    <Route 
                        path="/app"
                        render={(props) => (
                            <Layout>
                                <Switch>
                                    <Route path="/tables" component={Tables} />
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
