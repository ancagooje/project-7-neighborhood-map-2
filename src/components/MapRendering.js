
import React, {Component} from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';

const MAP_KEY = "AIzaSyCRlDr_ACA80UcW_svxFgZqtUkzhL6COqI";

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

    mapReady = (props, map) => {
        // Saving the map reference in state and preparing the location markers
        this.setState({map});
        this.updateMarkers(this.props.venues);
    }
    closeInfoWindow = () => {
        // Disable any active marker animation
        this.state.activeMarker && this
            .state
            .activeMarker
            .setAnimation(null);
        this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
    }

    onMarkerClick = (props, marker, e) => {
        // Close any info window already open
        this.closeInfoWindow();

        // Set the state to have the marker info show
        this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps: props});
    }

    updateMarkers = (venues) => {
        // If all the locations have been filtered then we're done
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
            let marker = new this.props.google.maps.Marker({
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
                                <a href={amProps.url}>See website</a>
                            )
                            : ""}
                        
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}
export default GoogleApiWrapper({apiKey: MAP_KEY})(MapRendering)