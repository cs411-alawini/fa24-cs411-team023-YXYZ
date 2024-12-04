import React from "react";
import { Row, Col, Progress} from "reactstrap";
import * as am4core from "@amcharts/amcharts4/core";
import Widget from "../../components/Widget";
import Map from "./components/am4chartMap/am4chartMap";
import s from "./Dashboard.module.scss";

import peopleA1 from "../../assets/people/a1.jpg";
import peopleA2 from "../../assets/people/a2.jpg";
import peopleA5 from "../../assets/people/a5.jpg";
import peopleA4 from "../../assets/people/a4.jpg";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateData: {}, 
      loading: false,  
      error: null,     
      graph: null,
      checkedArr: [false, false, false],
    };
    this.checkTable = this.checkTable.bind(this);
  }

 
  handleStateClick = async (stateName) => {
    this.setState({ loading: true, error: null });

    try {
      const encodedStateName = encodeURIComponent(stateName);
      const response = await fetch(
        `http://localhost:8000/state?state_name=${encodedStateName}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch state data");
      }
      
      const data = await response.json();
      console.log('State Data:', data.state_data);
      this.setState({ stateData: data.state_data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

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
    const { stateData, loading, error, graph, checkedArr } = this.state;
  
    return (
      <div className={s.root}>
        {/* Map 组件 */}
        <Widget className="bg-transparent">
        
          <Map key={Date.now()} onStateClick={this.handleStateClick} />
          {/* <Map
            key={Date.now()}
            onStateClick={(data) =>
              this.setState({
                stateData: Object.fromEntries(
                  Object.entries(data).map(([tableName, records]) => [
                    tableName,
                    Array.isArray(records)
                      ? records.map((record) => ({
                          ...record,
                          avg_value: parseFloat(record.avg_value),
                        }))
                      : [],
                  ])
                ),
              })
            }
          /> */}
        </Widget>
  
        <Row>
          {/* 判断 stateData 是否为空 */}
          {!stateData || Object.keys(stateData).length === 0 ? (
            <Col>
              <Widget>
                <h6>Loading...</h6>
                <p>Fetching data for the selected state...</p>
              </Widget>
            </Col>
          ) : (
            // 动态渲染 stateData 的每个表
            Object.entries(stateData).map(([tableName, data]) => (
              <Col lg={6} xl={6} xs={12} key={tableName}>
                <Widget title={<h6>{tableName}</h6>} close settings>
                  <div className="stats-row">
                  {Array.isArray(data) ? (
                      data.map((entry, index) => (
                          <div className="stat-item" key={index}>
                              <h6 className="name">{`Quarter: ${entry.quarter}`}</h6>
                              <p className="value">{`Average Value: ${entry.avg_value}`}</p>
                          </div>
                      ))
                  ) : (
                      <p>No data available for {tableName}</p>
                  )}
                  </div>
                  <Progress
                    color="info"
                    value={data.length > 0 ? data[0].avg_value || 0 : 0}
                    className="bg-subtle-blue progress-xs"
                  />
                  <p>
                    <small>
                      <span className="circle bg-default text-white mr-2">
                        <i className="fa fa-info" />
                      </span>
                    </small>
                    <span className="fw-semi-bold">
                      &nbsp;Weather data for {tableName}
                    </span>
                  </p>
                </Widget>
              </Col>
            ))
          )}
        </Row>
      </div>
    );
  }

//   render() {
//     const { stateData } = this.state; // 从 state 中提取 stateData
//     return (
//       <div className={s.root}>
//         <Widget className="bg-transparent">
//           <Map 
//           key={Date.now()}
//           onStateDataFetched={(data) => this.setState({ stateData: data })}
//           />
//         </Widget>

//         <Row>
//           <Col lg={6} xl={6} xs={12}>
//             <Widget title={<h6> USERBASE GROWTH </h6>} close settings>
//               <div className="stats-row">
//                 <div className="stat-item">
//                   <h6 className="name">Overall Growth</h6>
//                   <p className="value">76.38%</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name">Montly</h6>
//                   <p className="value">10.38%</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name">24h</h6>
//                   <p className="value">3.38%</p>
//                 </div>
//               </div>
//               <Progress
//                 color="success"
//                 value="60"
//                 className="bg-subtle-blue progress-xs"
//               />
//               <p>
//                 <small>
//                   <span className="circle bg-default text-white mr-2">
//                     <i className="fa fa-chevron-up" />
//                   </span>
//                 </small>
//                 <span className="fw-semi-bold">&nbsp;17% higher</span>
//                 &nbsp;than last month
//               </p>
//             </Widget>
//           </Col>
//           <Col lg={6} xl={6} xs={12}>
//             <Widget title={<h6> TRAFFIC VALUES </h6>} close settings>
//               <div className="stats-row">
//                 <div className="stat-item">
//                   <h6 className="name">Overall Values</h6>
//                   <p className="value">17 567 318</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name">Montly</h6>
//                   <p className="value">55 120</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name">24h</h6>
//                   <p className="value">9 695</p>
//                 </div>
//               </div>
//               <Progress
//                 color="danger"
//                 value="60"
//                 className="bg-subtle-blue progress-xs"
//               />
//               <p>
//                 <small>
//                   <span className="circle bg-default text-white mr-2">
//                     <i className="fa fa-chevron-down" />
//                   </span>
//                 </small>
//                 <span className="fw-semi-bold">&nbsp;8% lower</span>
//                 &nbsp;than last month
//               </p>
//             </Widget>
//           </Col>
//         </Row>

//         <Row>
//           <Col lg={6} xl={6} xs={12}>
//             <Widget title={<h6> RANDOM VALUES </h6>} close settings>
//               <div className="stats-row">
//                 <div className="stat-item">
//                   <h6 className="name fs-sm">Overcome T.</h6>
//                   <p className="value">104.85%</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name fs-sm">Takeoff Angle</h6>
//                   <p className="value">14.29&deg;</p>
//                 </div>
//                 <div className="stat-item">
//                   <h6 className="name fs-sm">World Pop.</h6>
//                   <p className="value">7,211M</p>
//                 </div>
//               </div>
//               <Progress
//                 color="bg-primary"
//                 value="60"
//                 className="bg-subtle-blue progress-xs"
//               />
//               <p>
//                 <small>
//                   <span className="circle bg-default text-white mr-2">
//                     <i className="fa fa-plus" />
//                   </span>
//                 </small>
//                 <span className="fw-semi-bold">&nbsp;8 734 higher</span>
//                 &nbsp;than last month
//               </p>
//             </Widget>
//           </Col>
//           <Col lg={6} xl={6} xs={12}>
//             <Widget
//               title={
//                 <h6>
//                   <span className="badge badge-success mr-2">New</span> Messages
//                 </h6>
//               }
//               refresh
//               close
//             >
//               <div className="widget-body undo_padding">
//                 <div className="list-group list-group-lg">
//                   <button className="list-group-item text-left">
//                     <span className="thumb-sm float-left mr">
//                       <img
//                         className="rounded-circle"
//                         src={peopleA2}
//                         alt="..."
//                       />
//                       <i className="status status-bottom bg-success" />
//                     </span>
//                     <div>
//                       <h6 className="m-0">Chris Gray</h6>
//                       <p className="help-block text-ellipsis m-0">
//                         Hey! What&apos;s up? So many times since we
//                       </p>
//                     </div>
//                   </button>
//                   <button className="list-group-item text-left">
//                     <span className="thumb-sm float-left mr">
//                       <img
//                         className="rounded-circle"
//                         src={peopleA4}
//                         alt="..."
//                       />
//                       <i className="status status-bottom bg-success" />
//                     </span>
//                     <div>
//                       <h6 className="m-0">Jamey Brownlow</h6>
//                       <p className="help-block text-ellipsis m-0">
//                         Good news coming tonight. Seems they agreed to proceed
//                       </p>
//                     </div>
//                   </button>
//                   <button className="list-group-item text-left">
//                     <span className="thumb-sm float-left mr">
//                       <img
//                         className="rounded-circle"
//                         src={peopleA1}
//                         alt="..."
//                       />
//                       <i className="status status-bottom bg-primary" />
//                     </span>
//                     <div>
//                       <h6 className="m-0">Livia Walsh</h6>
//                       <p className="help-block text-ellipsis m-0">
//                         Check my latest email plz!
//                       </p>
//                     </div>
//                   </button>
//                   <button className="list-group-item text-left">
//                     <span className="thumb-sm float-left mr">
//                       <img
//                         className="rounded-circle"
//                         src={peopleA5}
//                         alt="..."
//                       />
//                       <i className="status status-bottom bg-danger" />
//                     </span>
//                     <div>
//                       <h6 className="m-0">Jaron Fitzroy</h6>
//                       <p className="help-block text-ellipsis m-0">
//                         What about summer break?
//                       </p>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//               <footer className="bg-widget-transparent mt">
//                 <input
//                   type="search"
//                   className="form-control form-control-sm bg-custom-dark border-0"
//                   placeholder="Search"
//                 />
//               </footer>
//             </Widget>
//           </Col>
//         </Row>
//       </div>
//     );
//   }
}

export default Dashboard;
