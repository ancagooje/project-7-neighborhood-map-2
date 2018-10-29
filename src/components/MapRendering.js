
import React, {Component} from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';

const MAP_KEY = "AIzaSyCRlDr_ACA80UcW_svxFgZqtUkzhL6COqI";

class MapRendering extends Component {
    state = {
        map: null
    };

    componentDidMount = () => {
    }

    mapReady = (props, map) => {
        // Saving the map reference in state and preparing the location markers
        this.setState({map});
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
            </Map>
        )
    }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(Map)