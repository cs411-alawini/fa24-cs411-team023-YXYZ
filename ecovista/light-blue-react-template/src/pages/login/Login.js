import React from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Container,
  Alert,
  Button,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
} from "reactstrap";
import Widget from "../../components/Widget";
import microsoft from "../../assets/microsoft.png";

function exportToAnotherFile(loginTimeData) {
  console.log("Exporting to another file:", loginTimeData);

  // Pass the data to another module or component
  // You can use global variables, shared state, or localStorage as needed
  localStorage.setItem("lastLoginTime", JSON.stringify(loginTimeData));
}


class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static isAuthenticated(token) {
    if (token) return true;
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "admin@flatlogic.com",
      password: "password",
    };

    this.doLogin = this.doLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  async doLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Redirect to dashboard or homepage
        const loginTimeResponse = await fetch("http://localhost:8000/log-login-time", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user_id, // User ID from the login response
            loginTime: new Date(), // Current time
          }),
        });
  
        if (loginTimeResponse.ok) {
          const loginTimeData = await loginTimeResponse.json();
          console.log("Login time updated successfully.");
          this.handleLoginTime(loginTimeData);
        } else {
          console.error("Failed to update login time.");
        }
        this.props.history.push("/dashboard");
      } else {
        const errorData = await response.json();
        this.setState({ error: errorData.detail });
      }
    } catch (error) {
      this.setState({ error: "An error occurred. Please try again later." });
    }
  }

  handleLoginTime(loginTimeData) {
    // Example: Save it to a global state, export it, or log it
    console.log("Handling Login Time Data:", loginTimeData);
  
    // If you want to pass it to another file
    exportToAnotherFile(loginTimeData);
  }
  
  // Example of exporting to another file

  signUp() {
    this.props.history.push("/register");
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/dashboard" },
    }; // eslint-disable-line

    // cant access login page while logged in
    if (
      Login.isAuthenticated(JSON.parse(localStorage.getItem("authenticated")))
    ) {
      return <Redirect to={from} />;
    }

    return (
      <div className="auth-page">
        <Container>
          <Widget
            className="widget-auth mx-auto"
            title={<h3 className="mt-0">EcoVista</h3>}
          >
            <p className="widget-auth-info">Use your email to sign in.</p>
            <form onSubmit={this.doLogin}>
              {this.props.errorMessage && (
                <Alert
                  className="alert-sm widget-middle-overflow rounded-0"
                  color="danger"
                >
                  {this.props.errorMessage}
                </Alert>
              )}
              <FormGroup className="mt">
                <Label for="email">Email</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-user text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={this.state.email}
                    onChange={this.changeEmail}
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-lock text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={this.state.password}
                    onChange={this.changePassword}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="bg-widget auth-widget-footer">
                <Button
                  type="submit"
                  color="danger"
                  className="auth-btn"
                  size="sm"
                  style={{ color: "#fff" }}
                >
                  <span className="auth-btn-circle" style={{ marginRight: 8 }}>
                    <i className="la la-caret-right" />
                  </span>
                  {this.props.isFetching ? "Loading..." : "Login"}
                </Button>
                <p className="widget-auth-info mt-4">
                  Don't have an account? Sign up now!
                </p>
                <Link className="d-block text-center mb-4" to="register">
                  Create an Account
                </Link>
                <div className="social-buttons">
                  <Button color="primary" className="social-button">
                    <i className="social-icon social-google" />
                    <p className="social-text">GOOGLE</p>
                  </Button>
                  <Button color="success" className="social-button">
                    <i
                      className="social-icon social-microsoft"
                      style={{ backgroundImage: `url(${microsoft})` }}
                    />
                    <p className="social-text" style={{ color: "#fff" }}>
                      MICROSOFT
                    </p>
                  </Button>
                </div>
              </div>
            </form>
          </Widget>
        </Container>
        <footer className="auth-footer">
          {new Date().getFullYear()} &copy; Light Blue Template - React Admin
          Dashboard Template Made by{" "}
          <a
            href="https://flatlogic.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Flatlogic LLC
          </a>
          .
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Login));
