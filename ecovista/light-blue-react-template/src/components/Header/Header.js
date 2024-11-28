import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import LinksGroup from '../Sidebar/LinksGroup';
import {changeActiveSidebarItem} from '../../actions/navigation';
import HomeIcon from '../Icons/SidebarIcons/HomeIcon';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Input,
  UncontrolledAlert,
  Dropdown,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ButtonGroup,
  Button,
  Form,
  FormGroup,
} from "reactstrap";
import Notifications from "../Notifications";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import BellIcon from "../Icons/HeaderIcons/BellIcon";
import SettingsIcon from "../Icons/HeaderIcons/SettingsIcon";
import MessageIcon from "../Icons/HeaderIcons/MessageIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";
import ArrowIcon from "../Icons/HeaderIcons/ArrowIcon";


import { logoutUser } from "../../actions/user";
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility,
} from "../../actions/navigation";

import sender1 from "../../assets/people/a1.jpg";
import sender2 from "../../assets/people/a5.jpg";
import sender3 from "../../assets/people/a4.jpg";

import avatar from "../../assets/people/a7.jpg";

import s from "./Header.module.scss";
import "animate.css";

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

  doLogout() {
    this.props.dispatch(logoutUser());
    this.props.history.push('/');
  }

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

  render() {
    return (
      <Navbar className={`d-print-none `}>
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
          {/* <UncontrolledAlert
            className={`${s.alert} mr-3 d-lg-down-none animate__animated animate__bounceIn animate__delay-1s`}
          >
            Check out Light Blue{" "}
            <button
              className="btn-link"
              onClick={() => this.setState({ settingsOpen: true })}
            >
              <SettingsIcon className={s.settingsIcon} />
            </button>{" "}
            on the right!
          </UncontrolledAlert> */}
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
          {/* <Form className="d-md-down-none mr-3 ml-3" inline>
            <FormGroup>
              <InputGroup className={`input-group-no-border ${s.searchForm}`}>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className={s.inputGroupText}>
                    <SearchIcon className={s.headerIcon} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="search-input"
                  className="input-transparent"
                  placeholder="Search Dashboard"
                />
              </InputGroup>
            </FormGroup>
          </Form> */}

          <Nav className="ml-md-0">
            <Dropdown
              nav
              isOpen={this.state.notificationsOpen}
              toggle={this.toggleNotifications}
              id="basic-nav-dropdown"
              className={`${s.notificationsMenu}`}
            >
              <DropdownToggle nav caret style={{ color: "#C1C3CF", padding: 0 }}>
                <span
                  className={`${s.avatar} rounded-circle thumb-sm float-left`}
                >
                  <img src={avatar} alt="..." />
                </span>
                <span className={`small d-sm-down-none ${s.accountCheck}`}>Philip smith</span>
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
                <SearchIcon addId='header-search' className={s.headerIcon} />
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
