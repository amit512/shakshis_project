import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: 'Location',
    filterKey: 'location',
    array: ['Kathmandu', 'Nepalgunj', 'Pokhara', 'Butwal', 'Birgunj'],
  },
  {
    filterType: 'Industry',
    filterKey: 'industry',
    array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer'],
  },
  {
    filterType: 'Salary',
    filterKey: 'salary',
    array: ['0-40k', '42-1lakh', '1lakh to 5lakh'],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(store => store.job);

  const handleFilterChange = (filterKey, value) => {
    dispatch(setFilters({ [filterKey]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="w-full p-4 bg-white rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Filter Jobs</h2>
        {(filters.location || filters.industry || filters.salary) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#00707a] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-6">
        {filterData.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-sm mb-2">{section.filterType}</h3>
            <div className="space-y-2">
              {section.array.map((item, idx) => (
                <label key={idx} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name={section.filterType}
                    value={item}
                    checked={filters[section.filterKey] === item}
                    onChange={() => handleFilterChange(section.filterKey, item)}
                    className="form-radio text-[#00707a] accent-[#00707a]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
