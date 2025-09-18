
import React from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter, Calendar, Flag, ChevronDown } from 'lucide-react';

// Sort options ke liye ek helper object
const sortOptions = {
  created_at: { label: 'By Date', icon: <Calendar size={16} /> },
  priority: { label: 'By Priority', icon: <Flag size={16} /> },
  due_date: { label: 'By Due Date', icon: <Calendar size={16} /> },
};

const FilterBar = ({ filter, setFilter, sort, setSort, searchTerm, setSearchTerm, variants }) => {
  const filters = ['all', 'pending', 'completed'];

  return (
    <motion.div
      variants={variants} // Parent se animation variants lega
      className="relative z-10 flex flex-col items-center gap-4 p-3 border my-7 rounded-xl sm:flex-row bg-slate-900/70 border-slate-700 backdrop-blur-sm"
    >
      {/* Search Input */}
      <div className="relative flex-grow w-full">
        <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-10 transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Buttons with Sliding Pill Animation */}
      <div className="flex p-1 space-x-1 rounded-lg bg-slate-800/50">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${filter === f ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
          >
            {filter === f && (
              <motion.span
                layoutId="filter-highlight"
                className="absolute inset-0 rounded-md bg-info/80"
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
            <span className="relative z-10 capitalize">{f}</span>
          </button>
        ))}
      </div>

      {/* Custom Sort Dropdown */}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="m-1 btn btn-ghost bg-slate-800/50 hover:bg-slate-800">
          {sortOptions[sort].icon}
          <span className="hidden ml-2 md:inline">{sortOptions[sort].label}</span>
          <ChevronDown size={16} className="ml-1" />
        </label>
        <ul tabIndex={0} className="p-2 border shadow dropdown-content menu bg-slate-800 rounded-box w-52 border-slate-700">
          {Object.entries(sortOptions).map(([key, { label, icon }]) => (
            <li key={key} onClick={() => setSort(key)}>
              <a>{icon} {label}</a>
            </li>
      
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default FilterBar;