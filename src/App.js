import React, { Component } from 'react';
import './App.css';
import MapRendering from './components/MapRendering';
import venues from './data/venues.json';
import {InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
class App extends Component {
  state = {
    lat: 43.5780556,
    lon: -70.3222222,
    zoom: 13,
    all: venues
  }
 
 

  render = () => {
    return (
      <div className="App">
        <div>
          <h1> Seafood in Scarborough, ME </h1>
        </div>
        <MapRendering
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.all}/>
      </div>
    );
  }
}

export default App;
   
//export default GoogleApiWrapper({
  //apiKey: (AIzaSyCRlDr_ACA80UcW_svxFgZqtUkzhL6COqI)})(MapContainer)
  
  
   
  
