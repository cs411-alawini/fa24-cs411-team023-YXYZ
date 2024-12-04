import React, { Component } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import cities from './mock';
import am4geodata_usaHigh from "@amcharts/amcharts4-geodata/usaHigh";

import AnimateNumber from 'react-animated-number';
import s from './am4chartMap.module.scss';
  
  class Am4chartMap extends Component {
  
  componentDidMount() {
    am4core.ready(() => {
    am4core.options.autoDispose = true;
    let map = am4core.create("mapdiv", am4maps.MapChart);
    map.geodata = am4geodata_usaHigh;
    map.percentHeight = 90;
    map.dy = 10;
    map.projection = new am4maps.projections.AlbersUsa();
    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    map.homeZoomLevel = 1.2;
    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.layout = 'horizontal';
    map.zoomControl.align = 'left';
    map.zoomControl.valign = 'bottom';
    map.zoomControl.dy = -10;
    map.zoomControl.contentHeight = 20;
    map.zoomControl.minusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.minusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.minusButton.label.fontWeight = 600;
    map.zoomControl.minusButton.label.fontSize = 22;
    map.zoomControl.minusButton.scale = .75;
    map.zoomControl.minusButton.label.scale = .75;
    map.zoomControl.plusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.plusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.plusButton.label.fontWeight = 600;
    map.zoomControl.plusButton.label.fontSize = 22;
    map.zoomControl.plusButton.label.align = "center";
    map.zoomControl.plusButton.scale = .75;
    map.zoomControl.plusButton.label.scale = .75;
    map.zoomControl.plusButton.dx = 5;
    let plusButtonHoverState = map.zoomControl.plusButton.background.states.create("hover");
    plusButtonHoverState.properties.fill = am4core.color("#354D84");
    let minusButtonHoverState = map.zoomControl.minusButton.background.states.create("hover");
    minusButtonHoverState.properties.fill = am4core.color("#354D84");
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#474D84");
    polygonTemplate.stroke = am4core.color("#6979C9")
    polygonTemplate.events.on("hit", async (ev) => {
      const stateName = ev.target.dataItem.dataContext.name;
      // console.log('Clicked state:', stateName);  // Log the state name
 
      if (this.props.onStateClick) {
        this.props.onStateClick(stateName);
      }
      // this.setState({ loading: true, error: null });
      
      // try {
      //   // Encode the state name for URL
      //   const encodedStateName = encodeURIComponent(stateName);
        
      //   const response = await fetch(`http://localhost:8000/state?state_name=${encodedStateName}`);
        
      //   if (!response.ok) {
      //     throw new Error('Failed to fetch state data');
      //   }
        
      //   const data = await response.json();
      //   this.setState({ 
      //     stateData: data.state_data,
      //     loading: false 
      //   });
        
      //   console.log('State Data:', data.state_data);
        
      // } catch (error) {
      //   this.setState({ 
      //     error: error.message,
      //     loading: false 
      //   });
      //   console.error('Error fetching state data:', error);
      // }
    });


    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#354D84");
    let citySeries = map.series.push(new am4maps.MapImageSeries());
    citySeries.data = cities;
    citySeries.dataFields.value = "size";
    let city = citySeries.mapImages.template;
    city.nonScaling = true;
    city.propertyFields.latitude = "latitude";
    city.propertyFields.longitude = "longitude";
    let circle = city.createChild(am4core.Circle);
    circle.fill = am4core.color("#C7D0FF");
    circle.strokeWidth = 0;
    let circleHoverState = circle.states.create("hover");
    circleHoverState.properties.strokeWidth = 1;
    circle.tooltipText = '{tooltip}';
    circle.propertyFields.radius = 'size';
    this.map = map;
  });
  }

  componentWillUnmount() {
    if(this.map) {
      this.map.dispose();
    }
    am4core.disposeAllCharts();
    am4core.options.queue = true;
  }

  render() {
    return (
      <div className={s.mapChart}>
        <div className={s.stats}>
          <h6 className="mt-1">GEO-LOCATIONS</h6>
          <p className="h3 m-0">
            <span className="mr-xs fw-normal">
              <AnimateNumber
                value={1656843}
                initialValue={0}
                duration={1000} 
                stepPrecision={0}
                formatValue={n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              /></span>
            <i className="fa fa-map-marker" />
          </p>
        </div>
        <div className={s.map} id="mapdiv" style={{ 
            width: "100%", 
            height: "400px",
            position: "relative",
            overflow: "hidden"
          }}>
          <span>Alternative content for the map</span>
        </div>
      </div>
    );
  }
}

export default Am4chartMap;
