
import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import NoMapRendering from './NoMapRendering';


const MAP_KEY = "AIzaSyCRlDr_ACA80UcW_svxFgZqtUkzhL6COqI";
const FS_CLIENT = "RXELH2QF5VFRWCD11BWSZWE1TP3OEDXDY3FSN1U552FCOY0J ";
const FS_SECRET = "X0O4RURKYRVBH0IXWDZRLUWT0ZPKWQXIDJXB3ANT3T44111N ";
const FS_VERSION = "20181029";

class MapRendering extends Component {
    state = {
        map: null,
        markers: [],
        markerProps: [],
        activeMarker: null,
        activeMarkerProps: null,
        showingInfoWindow: false
    };

    componentDidMount = () => {
    }
    componentWillReceiveProps = (props) => {
        this.setState({firstDrop: false});

        if (this.state.markers.length !== props.venues.length) {
            this.closeInfoWindow();
            this.updateMarkers(props.venues);
            this.setState({activeMarker: null});

            return;
        }
// The selected item is not the same as the active marker, so close the info window
if (!props.selectedIndex || (this.state.activeMarker && 
    (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
    this.closeInfoWindow();
}

// Make sure there's a selected index
if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
    return;
};

// Treat the marker as being clicked
this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
}

    mapReady = (props, map) => {
        // Saving the map reference in state and preparing the location markers
        this.setState({map});
        this.updateMarkers(this.props.venues);
    }
    closeInfoWindow = () => {
        // Disable any existing marker animation
        this.state.activeMarker && this
            .state
            .activeMarker
            .setAnimation(null);
        this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
    }

    getBusinessInfo = (props, data) => {
        // Look for matching venue data in FourSquare compared to what we know
        return data
            .response
            .venues
            .filter(item => item.name.includes(props.name) || props.name.includes(item.name));
    }
    onMarkerClick = (props, marker, e) => {
        // Close any info window already open
        this.closeInfoWindow();

          // Get the FourSquare data for each venue
          let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
          let headers = new Headers();
          let request = new Request(url, {
              method: 'GET',
              headers
          });

// Create props for the active marker
let activeMarkerProps;
fetch(request)
    .then(response => response.json())
    .then(result => {
        // Get just the business reference for the restaurant we want from the FourSquare
        // return
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
            ...props,
            foursquare: restaurant[0]
        };

        // Get the list of images for the restaurant if we got FourSquare data, or just
                // finish setting state with the data we have
                if (activeMarkerProps.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${restaurant[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            activeMarkerProps = {
                                ...activeMarkerProps,
                                images: result.response.photos
                            };
                            if (this.state.activeMarker) 
                                this.state.activeMarker.setAnimation(null);
                            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                        })
                } else {
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                }
            })
    }

    updateMarkers = (venues) => {
        // If all the venues have been filtered,  we finished
        if (!venues) 
            return;
        
        // For any existing markers remove them from the map
        this
            .state
            .markers
            .forEach(marker => marker.setMap(null));

        
        // Add markers to the map using the hardcoded venues list.
        let markerProps = [];
        let markers = venues.map((venue, index) => {
            let mProps = {
                key: index,
                index,
                name: venue.name,
                position: venue.pos,
                url: venue.url
            };
            markerProps.push(mProps);

            let animation = this.props.google.maps.Animation.DROP;
            let marker = new this
            .props
            .google
            .maps
            .Marker({
                position: venue.pos, 
                map: this.state.map, 
                animation
            });
            marker.addListener('click', () => {
                this.onMarkerClick(mProps, marker, null);
            });
            return marker;
        })

        this.setState({markers, markerProps});
    }
    render = () => {
        const style = {
            width: '100%',
            height: '100%'
        }
        const center = {
            lat: this.props.lat,
            lng: this.props.lon
        }

        let amProps = this.state.activeMarkerProps;
        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                style={style}
                initialCenter={center}
                onClick={this.closeInfoWindow}>
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}>
                    <div>
                        <h3>{amProps && amProps.name}</h3>
                        {amProps && amProps.url
                            ? (
                                <a href={amProps.url}>Visit website</a>
                            )
                            : ""}
                            {amProps && amProps.images
                            ? (
                                <div><img
                                    alt={amProps.name + " food picture"}
                                    src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix}/>
                                    <p>Image from Foursquare</p>
                                </div>
                            )
                            : ""
                        }
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}
export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: NoMapRendering})(MapRendering)