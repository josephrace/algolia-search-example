import React from 'react';
import PropTypes from 'prop-types';

const FilterList = ({ listKey, label, facets, onSelect }) => {
  if (!facets.length) {
    return null;
  }

  return (
    <div className="filter-list">
      <div className="filter-list__title">{label}</div>
      {facets.map(value => (
        <div
          className={'filter-list-item ' + (value.isRefined ? 'filter-list-item--active': '')}
          key={value.name}
          onClick={() => { onSelect(listKey, value.name) }}
        >
          <div className="filter-list-item__name">{value.name}</div>
          <div className="filter-list-item__count">{value.count}</div>
        </div>
      ))}
    </div>
  );
}

FilterList.propTypes = {
  listKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  facets: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default FilterList;
