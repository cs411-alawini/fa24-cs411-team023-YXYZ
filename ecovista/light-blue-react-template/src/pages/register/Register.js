import React from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Container,
  Alert,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
} from "reactstrap";
import Widget from "../../components/Widget";
import { registerError } from "../../actions/register";
import microsoft from "../../assets/microsoft.png";
import Login from "../login";
import axios from "axios";

class Register extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      county_code: "",
    };

    this.doRegister = this.doRegister.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.isPasswordValid = this.isPasswordValid.bind(this);
  }
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  checkPassword() {
    if (!this.isPasswordValid()) {
      if (!this.state.password) {
        this.props.dispatch(registerError("Password field is empty"));
      } else {
        this.props.dispatch(registerError("Passwords are not equal"));
      }
      setTimeout(() => {
        this.props.dispatch(registerError());
      }, 3 * 1000);
    }
  }

  isPasswordValid() {
    return (
      this.state.password && this.state.password === this.state.confirmPassword
    );
  }

  doRegister(e) {
    e.preventDefault();
    if (!this.isPasswordValid()) {
      this.checkPassword();
    } else {
      const { email, password, county_code } = this.state;
      const nickname = email.split("@")[0];

      axios
        .post("http://localhost:8000/register", {
          email,
          nickname,
          county_code,
          password,
        })
        .then((response) => {
          alert("Registration successful!");
          this.props.history.push("/login");
        })
        .catch((error) => {
          let errorMessage = "An error occurred. Please try again.";

          if (error.response?.data) {
            if (typeof error.response.data === "object") {
              errorMessage =
                error.response.data.msg || JSON.stringify(error.response.data);
            } else {
              errorMessage = error.response.data;
            }
          }

          this.setState({ error: errorMessage });
        });
    }
  }
  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/app" },
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
            <p className="widget-auth-info">Please fill all fields below.</p>
            <form onSubmit={this.doRegister}>
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
                    onChange={this.handleInputChange}
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
                    onChange={this.handleInputChange}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Confirm</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-lock text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="confirmPassword"
                    className="input-transparent pl-3"
                    value={this.state.confirmPassword}
                    onChange={this.handleInputChange}
                    onBlur={this.checkPassword}
                    type="password"
                    required
                    name="confirmPassword"
                    placeholder="Confirm"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="county_code">county_code</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-lock text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="county_code"
                    className="input-transparent pl-3"
                    value={this.state.county_code}
                    onChange={this.handleInputChange}
                    type="county_code"
                    required
                    name="county_code"
                    placeholder="county_code"
                  />
                </InputGroup>
              </FormGroup>
              <div className="bg-widget-transparent auth-widget-footer">
                <Button
                  type="submit"
                  color="danger"
                  className="auth-btn"
                  size="sm"
                  style={{ color: "#fff" }}
                >
                  {this.props.isFetching ? "Loading..." : "Register"}
                </Button>
                <p className="widget-auth-info mt-4">
                  Already have the account? Login now!
                </p>
                <Link className="d-block text-center mb-4" to="login">
                  Enter the account
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
    isFetching: state.register.isFetching,
    errorMessage: state.register.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Register));
