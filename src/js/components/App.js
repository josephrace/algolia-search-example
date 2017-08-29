import React, { Component } from 'react';
import algoliasearchHelper from 'algoliasearch-helper';
import SearchInput from './SearchInput';
import FilterList from './FilterList';
import RatingFilterList from './RatingFilterList';
import ResultList from './ResultList';
import {
  searchClient,
  searchIndex,
  searchFacets,
  searchPaymentOptions,
  searchHelperOptions
} from '../algolia-config';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      busy: true,
      page: null,
      appendHits: false,
      totalHits: null,
      totalPages: null,
      responseTime: null,
      hits: [],
      facets: []
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
    this.handleRatingSelection = this.handleRatingSelection.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.handleResult = this.handleResult.bind(this);
  }

  componentDidMount() {
    // Ask for user's location and pass to search helper config if provided
    navigator.geolocation.getCurrentPosition(result => {
      const { coords } = result;
      this._initSearchHelper({
        aroundLatLng: `${coords.latitude}, ${coords.longitude}`
      });
    }, () => {
      this._initSearchHelper();
    });
  }

  /**
   * Init search helper, bind to 'result' event and kick off with empty search
   *
   * @param {object} options  Extra options for search helper
   */
  _initSearchHelper(options) {
    this._searchHelper = algoliasearchHelper(
      searchClient,
      searchIndex,
      Object.assign(searchHelperOptions, options)
    );
    this._searchHelper.on('result', this.handleResult);
    this._searchHelper.search();
  }

  /**
   * Handle search input
   *
   * @param {string} val  Search string
   */
  handleSearch(val) {
    this._searchHelper.setQuery(val).search();
    this.setState({ busy: true, appendHits: false });
  }

  /**
   * Handle facet selection using helper's toggleFacetRefinement method
   *
   * @param {string} key  The facet to operate upon
   * @param {string} val  The facet value to toggled
   */
  handleFacetSelection(key, val) {
    this._searchHelper.toggleFacetRefinement(key, val).search();
    this.setState({ busy: true, appendHits: false });
  }

  /**
   * Handle rating selection by adding numberic refinement displaying
   * results with star_count greater than or equal to val provided
   *
   * @param {number} val  Star count selected
   */
  handleRatingSelection(val) {
    this._searchHelper
      .removeNumericRefinement('stars_count', '>=')
      .addNumericRefinement('stars_count', '>=', val)
      .search();
    this.setState({ busy: true, appendHits: false });
  }

  /**
   * Load more results by using helper's nextPage method
   *
   * Note: Setting `appendHits: true` will ensure new results are added
   * to end of current list in handleResult method
   */
  handleShowMore() {
    this._searchHelper.nextPage().search();
    this.setState({ busy: true, appendHits: true });
  }

  /**
   * Handle search results
   *
   * @param  {object} content Algolia response object
   */
  handleResult(content) {
    const facets = {};
    let hits = [];

    // Get facet values for each facet and push to array with key and label
    searchFacets.forEach(facet => {
      facets[facet] = content.getFacetValues(facet);
    });

    // The requirement states that we should only show certain payment
    // options but is unclear about what to do with the others.
    // Therefore I am simply removing the others on front-end so we
    // retain others in search index for use in future if needed.
    facets['payment_options'] = facets['payment_options'].filter(po =>
      searchPaymentOptions.indexOf(po.name.toLowerCase()) > -1
    );

    // If appendHits is true then add new hits onto end of current hits array
    if (this.state.appendHits) {
      hits = this.state.hits.concat(content.hits);
    } else {
      hits = content.hits;
    }

    this.setState({
      busy: false,
      page: content.page,
      hits: hits,
      totalHits: content.nbHits,
      totalPages: content.nbPages,
      responseTime: content.processingTimeMS,
      facets: facets
    });
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          <SearchInput onSearch={this.handleSearch} />
        </div>
        {this.state.busy && !this.state.hits.length
          ? <div style={{ padding: 25 }}>Loading...</div>
          : <div className="sidebar-main">
              <div className="sidebar">
                <FilterList
                  listKey="food_type"
                  label="Cuisine/Food Type"
                  facets={this.state.facets['food_type']}
                  onSelect={this.handleFacetSelection}
                />
                <RatingFilterList
                  onSelect={this.handleRatingSelection}
                />
                <FilterList
                  listKey="payment_options"
                  label="Payment Options"
                  facets={this.state.facets['payment_options']}
                  onSelect={this.handleFacetSelection}
                />
              </div>
              <div className="main">
                {this.state.busy && !this.state.appendHits
                  ? <div>Loading...</div>
                  : <ResultList
                      results={this.state.hits}
                      page={this.state.page}
                      totalPages={this.state.totalPages}
                      totalHits={this.state.totalHits}
                      responseTime={this.state.responseTime}
                      onShowMore={this.handleShowMore}
                    />
                }
                {this.state.busy && this.state.appendHits && <div>Loading...</div>}
              </div>
            </div>
        }
      </div>
    );
  }
}

export default App;
