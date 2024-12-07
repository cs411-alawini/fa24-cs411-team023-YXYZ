import { connect } from "react-redux";
import React, {useEffect} from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Input,
  Dropdown,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  Badge,
  Button,
} from "reactstrap";
import Notifications from "../Notifications";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";
import { logoutUser } from "../../actions/user";
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility,
} from "../../actions/navigation";
import axios from 'axios';
import avatar from "../../assets/people/a7.jpg";
import s from "./Header.module.scss";
import "animate.css";

function retrieveLoginTime() {
  // Get the data from localStorage
  const loginTimeData = localStorage.getItem("lastLoginTime");
  const lastLoginTimeElement = document.getElementById("lastLoginTime");
  if (loginTimeData) {
    // Parse the JSON string back into an object
    const parsedData = JSON.parse(loginTimeData);
    console.log("Retrieved Login Time Data:", parsedData);

    // Use the data (e.g., display it in the UI)
    // document.getElementById("lastLoginTime").textContent = `Last Login: ${parsedData.last_login}`;
    const lastLoginDate = new Date(parsedData.last_login);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Chicago", timeZoneName: "short" 
    }).format(lastLoginDate);

    // Set the formatted date with the time zone
    lastLoginTimeElement.textContent = formattedDate;
    console.log(loginTimeData);
  } else {
    console.log("No login time data found in localStorage.");
  }
}

class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      messagesOpen: false,
      supportOpen: false,
      settingsOpen: false,
      searchFocused: false,
      searchOpen: false,
      notificationsOpen: false,
      notificationMessage: "",
    };
  }

  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  };

  onDismiss() {
    this.setState({ visible: false });
  }

//  doLogout() {
//    this.props.dispatch(logoutUser());
//    this.props.history.push("/logout");
//  }
    deleteCookie = (name) => {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 2000 00:00:00 GMT; SameSite=Lax`;
    };

    doLogout = async () => {
      try {
        this.props.dispatch(logoutUser());
//        await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
        this.deleteCookie("user_session");
        this.props.history.push('/');
      } catch (error) {
        console.error('Logout failed:', error);

        this.props.history.push('/error');
      }
    };

  toggleMessagesDropdown() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleSupportDropdown() {
    this.setState({
      supportOpen: !this.state.supportOpen,
    });
  }

  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen,
    });
  }

  toggleAccountDropdown() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened
      ? this.props.dispatch(closeSidebar())
      : this.props.dispatch(openSidebar());
  }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position));
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility));
  }
  componentDidMount() {
    retrieveLoginTime(); // Call after component is mounted
  }




  handleNotify = async () => {
    try {
      const response = await fetch('http://localhost:8000/notify',{
        method: 'POST',
        credentials: "include",
      });


      if (response.ok) {
        const data = await response.json();
        this.setState({ notificationMessage: data.message }); // Update the message state
      } else {
        this.setState({ notificationMessage: 'Failed to notify users.' });
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ notificationMessage: 'An error occurred while notifying users.' });
    }
  };




  render() {
    return (
      
      <Navbar className={`d-print-none `}>
        <Button
          color="primary"
          onClick={this.handleNotify}
          className={`${s.navItem} text-white`}
        >
          Update Notification
        </Button>
        <span
          className={`${s.navItem} ml-2`}
          style={{ fontSize: '0.85rem', color: 'white' }}
        >
          {this.state?.notificationMessage || ''}
        </span>
        <div className={s.burger}>
          <NavLink
            onClick={this.toggleSidebar}
            className={`d-md-none ${s.navItem} text-white`}
            href="#"
          >
            <BurgerIcon className={s.headerIcon} />
          </NavLink>
        </div>
        
        <div className={`d-print-none ${s.root}`}>
          <Collapse
            className={`${s.searchCollapse} ml-lg-0 mr-md-3`}
            isOpen={this.state.searchOpen}
          >
            <InputGroup
              className={`${s.navbarForm} ${
                this.state.searchFocused ? s.navbarFormFocused : ""
              }`}
            >
              <InputGroupAddon addonType="prepend" className={s.inputAddon}>
                <InputGroupText>
                  <i className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="search-input-2"
                placeholder="Search..."
                className="input-transparent"
                onFocus={() => this.setState({ searchFocused: true })}
                onBlur={() => this.setState({ searchFocused: false })}
              />
            </InputGroup>
          </Collapse>
          

          <Nav className="ml-md-0">
            <Dropdown
              nav
              isOpen={this.state.notificationsOpen}
              toggle={this.toggleNotifications}
              id="basic-nav-dropdown"
              className={`${s.notificationsMenu}`}
            >
              <DropdownToggle
                nav
                caret
                style={{ color: "#C1C3CF", padding: 0 }}
              >
                <span
                  className={`${s.avatar} rounded-circle thumb-sm float-left`}
                  onClick={() => (window.location.href = '/profile')}
                >
                  <img src={avatar} alt="..." />
                </span>
                <span className={`small d-sm-down-none ${s.accountCheck}`}>
                  Philip smith
                  <div id="lastLoginTime" className="last-login-time"></div>
                </span>
               
                <Badge className={`d-sm-down-none ${s.badge}`} color="danger">
                  9
                </Badge>
              </DropdownToggle>
              <DropdownMenu
                right
                className={`${s.notificationsWrapper} py-0 animate__animated animate__faster animate__fadeInUp`}
              >
                <Notifications />
              </DropdownMenu>
            </Dropdown>
            
            <NavItem className="d-lg-none">
              <NavLink
                onClick={this.toggleSearchOpen}
                className={s.navItem}
                href="#"
              >
                <SearchIcon addId="header-search" className={s.headerIcon} />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={this.doLogout}
                className={`${s.navItem} text-white`}
                href="#"
              >
                <PowerIcon className={s.headerIcon} />
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
