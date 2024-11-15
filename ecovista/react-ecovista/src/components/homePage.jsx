import React from 'react';
import './homePage.css';  // 引入CSS样式文件
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserAstronaut, faRobot, faPaperPlane, faChevronDown, faPlus, faTrashAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


function Home() {
  return (
    <div className="home">
      <div className="background">
        <img src="/homebackground.png" alt="Culinary Background" className="background-image" />
      </div>
      <div className="panel">
        <h1 className="title">EcoVista: Interactive Environmental Insights Map</h1>
        <p className="description">
        EcoVista is a web-based application that provides users with a platform for visualization and analyzing various environmental databases.
        </p>
        <button onClick={() => { window.location.href = '/login'; }} className="welcome-create-chat-btn">
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} /> Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
