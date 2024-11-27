import React from 'react';
import './homePage.css';  // 引入CSS样式文件
import background from './homebackground.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCoffee, faComments, faUserAstronaut, faRobot, faPaperPlane, faChevronDown, faPlus, faTrashAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="background">
        <img src={background} className="background-image" />
      </div>
      <div className="panel">
        <h1 className="title">EcoVista: Interactive Environmental Insights Map</h1>
        <p className="description">
        EcoVista is a web-based application that provides users with a platform for visualization and analyzing various environmental databases.
        </p>
        <Link to="/register" className="welcome-create-chat-btn">
            Get Started
        </Link>
      </div>
    </div>
  );
}

export default Home;
