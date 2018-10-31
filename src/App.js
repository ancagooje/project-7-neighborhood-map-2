import React, { Component } from 'react';
import './App.css';
import venues from './data/venues.json';
import MapRendering from './components/MapRendering';
import VenuesDrawer from './components/VenuesDrawer';

 //import {InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


  class App extends Component {
    state = {
      lat: 43.5780556,
      lon: -70.3222222,
      zoom: 12,
      all: venues,
      open: false
    }
   
  

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "yellow",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterVenues(this.state.all, "")
    });
  }
  toggleDrawer = () => {
    // Toggle the value controlling whether the drawer is displayed
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    // Update the query value and filter the list of venues 
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterVenues(this.state.all, query)
    });
  }

  filterVenues = (venues, query) => {
    // Filter venues to match the query 
    return venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
  }

  clickDrawerItem = (index) => {
     
    this.setState({ selectedIndex: index, open: !this.state.open })
  }
  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            <i className="fa fa-bars"></i>
          </button>
          <h1>Seafood in Scarborough, ME </h1>
        </div>
        <MapRendering
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          venues={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
          clickListItem={this.clickListItem}/>
        <VenuesDrawer
          venues={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterVenues={this.updateQuery}
          clickVenueItem={this.clickVenueItem}/>
      </div>
    );
  }
  }

export default App;