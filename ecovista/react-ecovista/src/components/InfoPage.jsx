import React, { useState } from 'react';
import axios from 'axios';
import './InfoPage.css';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function InfoPage() {
  const [state, setState] = useState('');
  const [year, setYear] = useState('');
  const [countyCode, setCountyCode] = useState('');
  const [dataType, setDataType] = useState('Air Quality');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8000/filter', {
        params: {
          state,
          year,
          county_code: countyCode,
          data_type: dataType
        }
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        alert('No data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="info-app">
      <div className="background">
        <img src="/homebackground.png" alt="Background" className="background-image" />
      </div>

      <div className="info-search-bar">
        <input
          type="text"
          placeholder="Search for county (with county code) or State"
          value={countyCode}
          onChange={(e) => setCountyCode(e.target.value)}
        />
        <button className="info-clear-btn" onClick={() => setCountyCode('')}>✖</button>
        <button className="info-search-btn" onClick={handleSearch}>Search</button>
      </div>

      <div className="info-filters">
        <label>
          Region/State:
          <input
            type="text"
            placeholder="Enter state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Year (xxxx - xxxx):
          <input
            type="text"
            placeholder="e.g., 2020 - 2023"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <label>
          Data type:
          <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
            <option>Air Quality</option>
            <option>Drought</option>
            <option>CO</option>
            <option>NO2</option>
          </select>
        </label>
      </div>

      <div className="info-result-header">Search Result Table</div>
      <div className="info-result-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.id}</td>
                <td>{result.timestamp}</td>
                <td>{result.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
}

export default InfoPage;