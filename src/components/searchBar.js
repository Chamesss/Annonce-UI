import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './css/SearchBar.css';

function SearchBar({ selectedCategoryId, selectedSubCategoryId, selectedLocationId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const queryString = `?keyword=${encodeURIComponent(searchTerm)}&categoryid=${encodeURIComponent(selectedCategoryId) || ''}&subcategoryid=${encodeURIComponent(selectedSubCategoryId) || ''}`;
    window.location.href = `/search${queryString}`;
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">
          {isLoading ?<div className='spinner-border spinner-border-sm'></div> : <FaSearch />}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;