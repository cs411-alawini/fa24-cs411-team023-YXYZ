
import React, { useState } from 'react';
import './InfoPage.css';
import axios from 'axios';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

const Data_Types = [
  "Air Quality","NO2","CO","Drought"
];

function InfoPage() {
  const [filterText, setFilterText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [yearRange, setYearRange] = useState('');
  const [county_code, setCountyCode] = useState('');
  const [filterResult, setFilterResult] = useState(null);


  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFilterText(e.target.value);
    setShowDropdown(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && filteredStates.length > 0) {
      // Select the first option on Enter
      setFilterText(filteredStates[0]);
      setShowDropdown(false);
    }
  };

  const handleOptionClick = (state) => {
    setFilterText(state);
    setShowDropdown(false);
  };

  const handleApplyFilter = async () => {
    try {
      console.log('Applying filter with:', filterText, yearRange, selectedDataType);
      const response = await axios.get('http://localhost:10000/filter', {
        params: {
          state: filterText,
          year: yearRange,
          county_code: county_code,
          data_type: selectedDataType
        }
      });
      console.log('Filter response:', response.data);
      setFilterResult(response.data); 
      console.log('filterResult state updated:', filterResult);
    } catch (error) {
      console.error('Error applying filter:', error);
      alert('Failed to apply filters');
    }
  };
  
  return (
    <div className="info-app">
      <div className="background">
        <img src="/homebackground.png" alt="Culinary Background" className="background-image" />
      </div>
      <div className="info-search-bar">
        <input type="text" placeholder="Search for county(with county code) or State" />
        <button className="info-clear-btn">✖</button>
        <button className="info-search-btn">Search</button>
      </div>

      <div className="info-result-header">Search Result Table</div>

      <div className="info-tab-navigation">
        <button className="info-tab active">Air Quality</button>
        <button className="info-tab">Drought</button>
      </div>

      <div className="info-map">
      <ComposableMap projection="geoAlbersUsa" width={800} height={500}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#D6D6DA", outline: "none", stroke: "black", strokeWidth: 0.5 },
                  hover: { fill: "#F53", outline: "none" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      </div>

          
      <div className="info-ranking-section">
        <h2>Ranking</h2>
        <div className="info-filters">
        <label>
            Region/State:
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Type to filter states"
                value={filterText}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              {showDropdown && filterText && filteredStates.length > 0 && (
                <select
                  size="5"
                  value=""
                  onChange={() => {}} // Prevent default behavior
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    zIndex: 1,
                  }}
                >
                  {filteredStates.map((state, index) => (
                    <option
                      key={index}
                      value={state}
                      onClick={() => handleOptionClick(state)}
                      style={{ cursor: 'pointer' }}
                    >
                      {state}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </label>

          <label>
            Year (xxxx - xxxx):
            <input
              type="text"
              placeholder="e.g., 2020-2023"
              value={yearRange}
              onChange={(e) => setYearRange(e.target.value)}
            />
          </label>

          <label>
            County Code (xxxx):
            <input
              type="text"
              placeholder="e.g., 1001"
              value={county_code}
              onChange={(e) => setCountyCode(e.target.value)}
            />
          </label>

          <label>
            Data type (e.g., Air):
            <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)}>
              <option value="">All</option>
              {Data_Types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <button className="filter-button" onClick={handleApplyFilter}>Apply</button>
        </div>
      </div>

      <div className="info-result-table">
        <p>Result Table</p>
        {filterResult && filterResult.data && filterResult.data.length > 0 ? (
          <table style={{ borderCollapse: 'separate', borderSpacing: '30px 30px' }}>
            <thead>
              <tr>
                <th>County Code</th>
                <th>Timestamp</th>
                <th>AQI</th>
              </tr>
            </thead>
            <tbody>
              {filterResult.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.county_code}</td>
                  <td>{item.timestamp}</td>
                  <td>{item.aqi.toString()}</td> {/* Convert AQI to string for rendering */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results to display</p>
        )}
      </div>

    </div>
  );
}

export default InfoPage;
