import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const RatingFilterList = ({ onSelect }) => {
  const filters = [];

  for (let i = 0; i <= 5; i++) {
    const filter = (
      <div key={i} onClick={() => { onSelect(i) }}>
        <StarRating rating={i} />
      </div>
    );

    filters.push(filter);
  }

  return (
    <div className="filter-list rating-filter-list">
      <div className="filter-list__title">Rating</div>
      {filters}
    </div>
  );
};

RatingFilterList.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default RatingFilterList;
