import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-autocomplete-places';
import HomeBody from './HomeBody'
import './HomePage.css'
import Loading from '../Loading/Loading';

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            coords: null,
            restData: [],
            loading: false
        };

    }


    handleChange = address => {
        this.setState({ address });
    };


    handleSelect = address => {
        this.setState({ loading: true })
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({ coords: latLng })
                this.props.csrf('/api/home/', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.state.coords),
                })
                    .then(res => res.json())
                    .then(data => {
                        this.setState({ loading: false })
                        this.setState({ restData: data.restaurants })
                    })
            })
            .catch(error => console.error('Error', error));
        this.setState({ address: address })
    };


    render() {
        return (
            <>
                <div className='home-search'>
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input',
                                    })}
                                />
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion, index) => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        const style = suggestion.active
                                            ? { backgroundColor: 'lightgray', cursor: 'pointer', width: '400px' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer', width: '400px' };
                                        return (
                                            <div key={suggestion.id}
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style,
                                                })}
                                            >
                                                <span key={suggestion.id}>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
                <div className='home__img'>
                    <img src='https://images.unsplash.com/photo-1574936145840-28808d77a0b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80' alt='' />
                </div>
                <div className='home__body'>
                    {this.state.loading ?
                        <Loading />
                        :
                        <HomeBody data={this.state.restData} />
                    }
                </div>
            </>
        );
    }
}

export default SearchInput
