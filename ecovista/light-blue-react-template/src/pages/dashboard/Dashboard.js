import React from "react";
import { Row, Col, Progress, Table, Label, Input } from "reactstrap";
import * as am4core from "@amcharts/amcharts4/core";
import Widget from "../../components/Widget";

import Calendar from "./components/calendar/Calendar";
import Map from "./components/am4chartMap/am4chartMap";
import Rickshaw from "./components/rickshaw/Rickshaw";

import AnimateNumber from "react-animated-number";

import s from "./Dashboard.module.scss";

import peopleA1 from "../../assets/people/a1.jpg";
import peopleA2 from "../../assets/people/a2.jpg";
import peopleA5 from "../../assets/people/a5.jpg";
import peopleA4 from "../../assets/people/a4.jpg";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: null,
      checkedArr: [false, false, false],
    };
    this.checkTable = this.checkTable.bind(this);
  }

  checkTable(id) {
    let arr = [];
    if (id === 0) {
      const val = !this.state.checkedArr[0];
      for (let i = 0; i < this.state.checkedArr.length; i += 1) {
        arr[i] = val;
      }
    } else {
      arr = this.state.checkedArr;
      arr[id] = !arr[id];
    }
    if (arr[0]) {
      let count = 1;
      for (let i = 1; i < arr.length; i += 1) {
        if (arr[i]) {
          count += 1;
        }
      }
      if (count !== arr.length) {
        arr[0] = !arr[0];
      }
    }
    this.setState({
      checkedArr: arr,
    });
  }

  componentDidMount() {
    am4core.options.queue = true;
  }
  
  componentWillUnmount() {
    am4core.disposeAllCharts();
  }

  render() {
    return (
      <div className={s.root}>
        {/* <Row>
          <Col lg={7}> */}
            <Widget className="bg-transparent">
              <Map key={Date.now()}/>
            </Widget>
          {/* </Col>
          <Col lg={1} /> */}

          {/* <Col lg={4}> */}
            {/* <Widget
              className="bg-transparent"
              title={
                <h5>
                  {" "}
                  Map
                  <span className="fw-semi-bold">&nbsp;Statistics</span>
                </h5>
              }
              settings
              refresh
              close
            >
              <p>
                Status: <strong>Live</strong>
              </p>
              <p>
                <span className="circle bg-default text-white">
                  <i className="fa fa-map-marker" />
                </span>{" "}
                &nbsp; 146 Countries, 2759 Cities
              </p>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Foreign Visits</h6>
                  <p className="description deemphasize mb-xs text-white">
                    Some Cool Text
                  </p>
                  <Progress
                    color="primary"
                    value="60"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={75} />%
                    </small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Local Visits</h6>
                  <p className="description deemphasize mb-xs text-white">
                    P. to C. Conversion
                  </p>
                  <Progress
                    color="danger"
                    value="39"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={84} />%
                    </small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Sound Frequencies</h6>
                  <p className="description deemphasize mb-xs text-white">
                    Average Bitrate
                  </p>
                  <Progress
                    color="success"
                    value="80"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={92} />%
                    </small>
                  </span>
                </div>
              </div>
              <h6 className="fw-semi-bold mt">Map Distributions</h6>
              <p>
                Tracking: <strong>Active</strong>
              </p> */}
              {/* <p>
                <span className="circle bg-default text-white">
                  <i className="fa fa-cog" />
                </span>
                &nbsp; 391 elements installed, 84 sets
              </p> */}
              {/* <div className="input-group mt">
                <input
                  type="text"
                  className="form-control bg-custom-dark border-0"
                  placeholder="Search Map"
                />
                <span className="input-group-btn">
                  <button
                    type="submit"
                    className={`btn btn-subtle-blue ${s.searchBtn}`}
                  >
                    <i className="fa fa-search text-light" />
                  </button>
                </span>
              </div> */}
            {/* </Widget>
          </Col> */}
        {/* </Row>  */}

        <Row>
          <Col lg={6} xl={6} xs={12}>
            <Widget title={<h6> USERBASE GROWTH </h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Overall Growth</h6>
                  <p className="value">76.38%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">Montly</h6>
                  <p className="value">10.38%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">24h</h6>
                  <p className="value">3.38%</p>
                </div>
              </div>
              <Progress
                color="success"
                value="60"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-chevron-up" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;17% higher</span>
                &nbsp;than last month
              </p>
            </Widget>
          </Col>
          <Col lg={6} xl={6} xs={12}>
            <Widget title={<h6> TRAFFIC VALUES </h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Overall Values</h6>
                  <p className="value">17 567 318</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">Montly</h6>
                  <p className="value">55 120</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">24h</h6>
                  <p className="value">9 695</p>
                </div>
              </div>
              <Progress
                color="danger"
                value="60"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-chevron-down" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;8% lower</span>
                &nbsp;than last month
              </p>
            </Widget>
          </Col>
        </Row>

        <Row>
        <Col lg={6} xl={6} xs={12}>
            <Widget title={<h6> RANDOM VALUES </h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name fs-sm">Overcome T.</h6>
                  <p className="value">104.85%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name fs-sm">Takeoff Angle</h6>
                  <p className="value">14.29&deg;</p>
                </div>
                <div className="stat-item">
                  <h6 className="name fs-sm">World Pop.</h6>
                  <p className="value">7,211M</p>
                </div>
              </div>
              <Progress
                color="bg-primary"
                value="60"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-plus" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;8 734 higher</span>
                &nbsp;than last month
              </p>
            </Widget>
          </Col>
          <Col lg={6} xl={6} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="badge badge-success mr-2">New</span> Messages
                </h6>
              }
              refresh
              close
            >
              <div className="widget-body undo_padding">
                <div className="list-group list-group-lg">
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA2}
                        alt="..."
                      />
                      <i className="status status-bottom bg-success" />
                    </span>
                    <div>
                      <h6 className="m-0">Chris Gray</h6>
                      <p className="help-block text-ellipsis m-0">
                        Hey! What&apos;s up? So many times since we
                      </p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA4}
                        alt="..."
                      />
                      <i className="status status-bottom bg-success" />
                    </span>
                    <div>
                      <h6 className="m-0">Jamey Brownlow</h6>
                      <p className="help-block text-ellipsis m-0">
                        Good news coming tonight. Seems they agreed to proceed
                      </p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA1}
                        alt="..."
                      />
                      <i className="status status-bottom bg-primary" />
                    </span>
                    <div>
                      <h6 className="m-0">Livia Walsh</h6>
                      <p className="help-block text-ellipsis m-0">
                        Check my latest email plz!
                      </p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA5}
                        alt="..."
                      />
                      <i className="status status-bottom bg-danger" />
                    </span>
                    <div>
                      <h6 className="m-0">Jaron Fitzroy</h6>
                      <p className="help-block text-ellipsis m-0">
                        What about summer break?
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              <footer className="bg-widget-transparent mt">
                <input
                  type="search"
                  className="form-control form-control-sm bg-custom-dark border-0"
                  placeholder="Search"
                />
              </footer>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
