import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const RatingFilterList = ({ onSelect, ratingFilter }) => {
  const filters = [];

  for (let i = 0; i <= 5; i++) {
    const filter = (
      <div
        key={i}
        onClick={() => { onSelect(i) }}
        style={{ opacity: (ratingFilter && ratingFilter !== i ? '0.4': '1')}}
      >
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
