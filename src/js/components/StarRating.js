import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, displayNumber }) => {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    const star = (
      <img
        className="star-rating__star"
        key={i}
        src={`assets/images/star-${(rating >= i ? 'full' : 'empty')}.png`}
      />
    );

    stars.push(star);
  }

  return (
    <div className="star-rating">
      {displayNumber && <div className="star-rating__number">{rating}</div>}
      {stars}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  displayNumber: PropTypes.bool
};

export default StarRating;
