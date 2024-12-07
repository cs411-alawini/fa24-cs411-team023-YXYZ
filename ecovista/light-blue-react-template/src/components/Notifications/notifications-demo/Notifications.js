import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';

import s from './ListGroup.module.scss';


class NotificationsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null, // State to store the cookie value
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  componentDidMount() {
    // Retrieve the 'notified' cookie value and update the state
    const notifiedValue = this.getCookie('notified');
    this.setState({ notification: notifiedValue });
  }

  render() {
    const { notification } = this.state;
    return (
      <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
        <ListGroupItem className={s.listGroupItem}>
          
          <p className="m-0 overflow-hidden">
            {notification === '1' && (
              <>
                <strong>Notification: Yes</strong>
                <br />
                Your location has bad environment than average and still have bad trend.
              </>
            )}
            {notification === '0' && (
              <>
                <strong>Notification: No</strong>
                <br />
                Your location has good environment.
              </>
            )}
          </p>
          
        </ListGroupItem>
        
      </ListGroup>
      
    );
  }
}

export default NotificationsDemo;
