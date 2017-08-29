import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

const ResultList = (props) => {
  const {
    results,
    page,
    totalPages,
    totalHits,
    responseTime,
    onShowMore
  } = props;

  return (
    <div className="results-list">
      <div className="results-list-header">
        <div className="results-list-stats">
          <span>{totalHits} results found</span> in {responseTime/1000} seconds
        </div>
        <div className="results-list-header-border"></div>
      </div>
      {results.map(result => (
        <Result key={result.objectID} result={result} />
      ))}
      <div className="results-list-footer">
        {page + 1 < totalPages
          ? <div className="results-list-more" onClick={onShowMore}>
              Show More
            </div>
          : null
        }
      </div>
    </div>
  );
};

ResultList.propTypes = {
  results: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalHits: PropTypes.number.isRequired,
  responseTime: PropTypes.number.isRequired,
  onShowMore: PropTypes.func.isRequired
};

export default ResultList;
