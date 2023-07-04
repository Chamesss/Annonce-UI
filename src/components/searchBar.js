import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './css/SearchBar.css';

function SearchBar({ selectedCategoryId, selectedSubCategoryId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const queryString = `?keyword=${encodeURIComponent(searchTerm)}&categoryid=${encodeURIComponent(
      selectedCategoryId
    ) || ''}&subcategoryid=${encodeURIComponent(selectedSubCategoryId) || ''}`;
    window.location.href = `/search${queryString}`;
  }

  function toggleSearchBar() {
    setIsSearchBarOpen(!isSearchBarOpen);
  }

  return (
    <div className="search-bar-container">
      <div className="toggle-search-button">
        {isSearchBarOpen ? (
          <button type="button" className="btn search-button" onClick={toggleSearchBar}>
            <FaTimes />
          </button>
        ) : (
          <button type="button" className="btn search-button" onClick={toggleSearchBar}>
            <FaSearch />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className={`search-bar ${isSearchBarOpen ? 'open' : 'closed'}`}>
        <div className="search-bar-inner">
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn submit-button">
          {isLoading ? (
            <div className="spinner-grow spinner-grow-sm"></div>
          ) : (
            <FaSearch />
          )}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;