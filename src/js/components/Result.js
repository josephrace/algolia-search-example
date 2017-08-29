import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { isMobile } from '../utils';

const Result = ({ result }) => (
  <div className="result">
    <a href={isMobile ? result.mobile_reserve_url : result.reserve_url}>
      <img className="result__image" src={result.image_url} alt="" />
    </a>
    <div>
      <div className="result__name">
        <a
          href={isMobile ? result.mobile_reserve_url : result.reserve_url}
          dangerouslySetInnerHTML={{
            __html: result._highlightResult.name.value
          }}
        ></a>
      </div>
      <div className="result__reviews">
        <StarRating rating={result.stars_count} displayNumber={true} />
        ({result.reviews_count} reviews)
      </div>
      <div>
        {result.dining_style} | {result.neighborhood} | {result.price_range}
      </div>
    </div>
  </div>
);

Result.propTypes = {
  result: PropTypes.object.isRequired
};

export default Result;
