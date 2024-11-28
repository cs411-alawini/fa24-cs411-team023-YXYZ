import React from "react";
import {
  Row,
  Col,
  Table,
  Progress,
  Button,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Label,
  Badge,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import SearchIcon from "../../../components/Icons/HeaderIcons/SearchIcon";
import { Sparklines, SparklinesBars } from "react-sparklines";

import Widget from "../../../components/Widget";
import s from "./Static.module.scss";
// Helper function to determine badge color based on data type and value
const getDataBadgeColor = (type, value) => {
  value = Number(value);
  
  switch(type) {
    case "Drought":
      if (value >= 4) return "danger";     // Red for severe drought
      if (value >= 3) return "warning";    // Orange for moderate drought
      if (value >= 2) return "primary";    // Blue for mild drought
      if (value >= 1) return "info";       // Light blue for abnormally dry
      return "success";                     // Green for normal

    case "Air Quality":
      if (value >= 300) return "danger";    // Hazardous
      if (value >= 200) return "warning";   // Very Unhealthy
      if (value >= 150) return "info";      // Unhealthy
      if (value >= 100) return "primary";   // Moderate
      return "success";                      // Good

    case "CO":
      if (value >= 9) return "danger";      // High
      if (value >= 6) return "warning";     // Elevated
      if (value >= 3) return "info";        // Moderate
      return "success";                      // Low

    case "NO2":
      if (value >= 100) return "danger";    // High
      if (value >= 50) return "warning";    // Moderate
      if (value >= 25) return "info";       // Low
      return "success";                      // Very Low

    default:
      return "primary";                      // Default color
  }
};

// Legend component for different data types
const renderLegend = (dataType) => {
  switch(dataType) {
    case "Drought":
      return (
        <div className="mt-3">
          <Badge color="danger" pill className="mr-2">Severe ≥4</Badge>
          <Badge color="warning" pill className="mr-2">Moderate ≥3</Badge>
          <Badge color="primary" pill className="mr-2">Mild ≥2</Badge>
          <Badge color="info" pill className="mr-2">Abnormally Dry ≥1</Badge>
          <Badge color="success" pill>Normal &lt;1</Badge>
        </div>
      );

    case "Air Quality":
      return (
        <div className="mt-3">
          <Badge color="danger" pill className="mr-2">Hazardous ≥300</Badge>
          <Badge color="warning" pill className="mr-2">Very Unhealthy ≥200</Badge>
          <Badge color="info" pill className="mr-2">Unhealthy ≥150</Badge>
          <Badge color="primary" pill className="mr-2">Moderate ≥100</Badge>
          <Badge color="success" pill>Good &lt;100</Badge>
        </div>
      );

    case "CO":
      return (
        <div className="mt-3">
          <Badge color="danger" pill className="mr-2">High ≥9</Badge>
          <Badge color="warning" pill className="mr-2">Elevated ≥6</Badge>
          <Badge color="info" pill className="mr-2">Moderate ≥3</Badge>
          <Badge color="success" pill>Low &lt;3</Badge>
        </div>
      );

    case "NO2":
      return (
        <div className="mt-3">
          <Badge color="danger" pill className="mr-2">High ≥100</Badge>
          <Badge color="warning" pill className="mr-2">Moderate ≥50</Badge>
          <Badge color="info" pill className="mr-2">Low ≥25</Badge>
          <Badge color="success" pill>Very Low &lt;25</Badge>
        </div>
      );

    default:
      return null;
  }
};
class Static extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    tableStyles: [
      {
        id: 1,
        picture: require("../../../assets/tables/1.png"), // eslint-disable-line global-require
        description: "Palo Alto",
        info: {
          type: "JPEG",
          dimensions: "200x150",
        },
        date: new Date("September 14, 2012"),
        size: "45.6 KB",
        progress: {
          percent: 29,
          colorClass: "success",
        },
      },
      {
        id: 2,
        picture: require("../../../assets/tables/2.png"), // eslint-disable-line global-require
        description: "The Sky",
        info: {
          type: "PSD",
          dimensions: "2400x1455",
        },
        date: new Date("November 14, 2012"),
        size: "15.3 MB",
        progress: {
          percent: 33,
          colorClass: "warning",
        },
      },
      {
        id: 3,
        picture: require("../../../assets/tables/3.png"), // eslint-disable-line global-require
        description: "Down the road",
        label: {
          colorClass: "primary",
          text: "INFO!",
        },
        info: {
          type: "JPEG",
          dimensions: "200x150",
        },
        date: new Date("September 14, 2012"),
        size: "49.0 KB",
        progress: {
          percent: 38,
          colorClass: "inverse",
        },
      },
      {
        id: 4,
        picture: require("../../../assets/tables/4.png"), // eslint-disable-line global-require
        description: "The Edge",
        info: {
          type: "PNG",
          dimensions: "210x160",
        },
        date: new Date("September 15, 2012"),
        size: "69.1 KB",
        progress: {
          percent: 17,
          colorClass: "danger",
        },
      },
      {
        id: 5,
        picture: require("../../../assets/tables/5.png"), // eslint-disable-line global-require
        description: "Fortress",
        info: {
          type: "JPEG",
          dimensions: "1452x1320",
        },
        date: new Date("October 1, 2012"),
        size: "2.3 MB",
        progress: {
          percent: 41,
          colorClass: "primary",
        },
      },
    ],
    checkboxes1: [false, true, false, false],
    checkboxes2: [false, false, false, false, false, false],
    checkboxes3: [false, false, false, false, false, false],
    searchText1: "",
    searchText2: "",
    searchText3: "",
    searchText4: "",
    searchResults: []
  };
  this.checkAll = this.checkAll.bind(this);

  this.handleSearch = this.handleSearch.bind(this);
  this.performSearch = this.performSearch.bind(this);
}
handleDropdownChange = (event, selectedValue) => {
  this.setState(
    {
      searchText4: selectedValue,
    },
    () => {
      // Check if all search fields have values
      const { searchText1, searchText2, searchText3, searchText4 } = this.state;
      if (searchText1 && searchText2 && searchText3 && searchText4) {
        this.performSearch(searchText1, searchText2, searchText3, searchText4);
      }
    }
  );
};

handleSearch = (event, searchIndex) => {
  this.setState(
    {
      [`searchText${searchIndex}`]: event.target.value,
    },
    () => {
      // Check if all search fields have values
      const { searchText1, searchText2, searchText3, searchText4 } = this.state;
      if (searchText1 && searchText2 && searchText3 && searchText4) {
        this.performSearch(searchText1, searchText2, searchText3, searchText4);
      }
    }
  );
};

  performSearch = (search1, search2, search3, search4) => {
  // Make the API call to the FastAPI backend
  fetch(`http://localhost:10000/filter?state=${search1}&year=${search2}&county_code=${search3}&data_type=${search4}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the search results from the backend
      this.setState({ searchResults: data.data });
      console.log(data.results);
    })
    .catch((error) => {
      console.error("Error performing search:", error);
    });
  };

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${
      this.dateSet[2]
    }, ${this.dateSet[3]}`;
  }

  checkAll(ev, checkbox) {
    const checkboxArr = new Array(this.state[checkbox].length).fill(
      ev.target.checked
    );
    this.setState({
      [checkbox]: checkboxArr,
    });
  }

  changeCheck(ev, checkbox, id) {
    //eslint-disable-next-line
    this.state[checkbox][id] = ev.target.checked;
    if (!ev.target.checked) {
      //eslint-disable-next-line
      this.state[checkbox][0] = false;
    }
    this.setState({
      [checkbox]: this.state[checkbox],
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Row className="mb-3">
          <Col lg={3} md={6} sm={12}>
            <Form className="d-md-down-none mr-3 ml-3" inline>
              <FormGroup>
                <InputGroup className={`input-group-no-border ${s.searchForm}`}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className={s.inputGroupText}>
                      <SearchIcon className={s.headerIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="search-input-1"
                    className="input-transparent"
                    placeholder="Enter State Name..."
                    value={this.state.searchText1}
                    onChange={(event) => this.handleSearch(event, 1)}
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form className="d-md-down-none mr-3 ml-3" inline>
              <FormGroup>
                <InputGroup className={`input-group-no-border ${s.searchForm}`}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className={s.inputGroupText}>
                      <SearchIcon className={s.headerIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="search-input-2"
                    className="input-transparent"
                    placeholder="Enter Year..."
                    value={this.state.searchText2}
                    onChange={(event) => this.handleSearch(event, 2)}
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form className="d-md-down-none mr-3 ml-3" inline>
              <FormGroup>
                <InputGroup className={`input-group-no-border ${s.searchForm}`}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className={s.inputGroupText}>
                      <SearchIcon className={s.headerIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="search-input-3"
                    className="input-transparent"
                    placeholder="Enter County Code..."
                    value={this.state.searchText3}
                    onChange={(event) => this.handleSearch(event, 3)}
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <UncontrolledButtonDropdown>
              <DropdownToggle caret>
                {this.state.searchText4 || "Select Data Type"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={(event) => this.handleDropdownChange(event, "Air Quality")}
                >
                  Air Quality
                </DropdownItem>
                <DropdownItem
                  onClick={(event) => this.handleDropdownChange(event, "Drought")}
                >
                  Drought
                </DropdownItem>
                <DropdownItem
                  onClick={(event) => this.handleDropdownChange(event, "CO")}
                >
                  CO
                </DropdownItem>
                <DropdownItem
                  onClick={(event) => this.handleDropdownChange(event, "NO2")}
                >
                  NO2
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
              <div className={s.overFlow}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>County Code</th>
                    <th>Time</th>
                    <th>{this.state.searchText4 || "Value"}</th>
                  </tr>
                </thead>
                <tbody>
  {this.state.searchResults.map((result, index) => {
    const value = result.drought_level || result.aqi || result.co_measurement || result.no2_measurement || 0;
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{result.county_code}</td>
        <td>{result.timestamp}</td>
        <td>
          <Badge 
            color={getDataBadgeColor(this.state.searchText4, value)} 
            className="text-white"
            pill
          >
            {typeof value === 'number' ? value.toFixed(3) : value}
          </Badge>
        </td>
      </tr>
    );
  })}
  {this.state.searchResults.length === 0 && (
    <tr>
      <td colSpan="4" className="text-center">
        No results found
      </td>
    </tr>
  )}
</tbody>
              </Table>
              {this.state.searchText4 && renderLegend(this.state.searchText4)}
            </div>

          </Col>
        </Row>
      </div>
    );
  }
}

export default Static;