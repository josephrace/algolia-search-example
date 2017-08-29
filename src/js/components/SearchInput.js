import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle input onChange event
   *
   * @param  {object} event Event object
   */
  handleChange(event) {
    this.props.onSearch(event.target.value);
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <input
        className="search"
        type="text"
        name="search"
        placeholder="Search for Restaurants by Name, Cuisine, Location"
        onChange={this.handleChange}
      />
    );
  }
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default SearchInput;
