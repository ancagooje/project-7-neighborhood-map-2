import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

class VenuesDrawer extends Component {
    state = {
        open: false,
        query: ""
    }

    styles = {
        list: {
            width: "250px",
            padding: "0px 15px 0px"
        },
        noBullets: {
            listStyleType: "none",
            padding: 0
        },
        fullList: {
            width: 'auto'
        },
        listItem: {
            marginBottom: "15px"
        },
        listLink: {
            background: "transparent",
            border: "none",
            color: "blue"
        },
        filterEntry: {
            border: "2px solid gray",
            padding: "3px",
            margin: "30px 0px 15px",
            width: "100%"
        }
    };

    updateQuery = (newQuery) => {
        // Save the new query string in state and pass the string
        // up the call tree
        this.setState({ query: newQuery });
        this.props.filterVenues(newQuery);
    }

    render = () => {
        return (
            <div>
                <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
                    <div style={this.styles.list}>
                        <input
                            style={this.styles.filterEntry}
                            type="text"
                            placeholder="Filter restaurants"
                            name="filter"
                            onChange={e => this
                                .updateQuery(e.target.value)}
                            value={this.state.query} />
                        <ul style={this.styles.noBullets}>
                            {this.props.venues && this
                                .props
                                .venues
                                .map((venue, index) => {
                                    return (
                                        <li style={this.styles.listItem} key={index}>
                                            <button style={this.styles.listLink} key={index} onClick={e => this.props.clickListItem(index)}>{venue.name}</button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default VenuesDrawer;