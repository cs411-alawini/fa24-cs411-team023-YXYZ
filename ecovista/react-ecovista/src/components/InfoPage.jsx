import React from 'react';
import './InfoPage.css';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";


function InfoPage() {
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
            <select>
              <option>All</option>
            </select>
          </label>
          <label>
            Year (xxxx - xxxx):
            <input type="text" placeholder="e.g., 2020 - 2023" />
          </label>
          <label>
            Data type (e.g., Air):
            <select>
              <option>All</option>
            </select>
          </label>
        </div>
      </div>

      <div className="info-result-table">
        <p>Result Table</p>
      </div>
    </div>
  );
}

export default InfoPage;
