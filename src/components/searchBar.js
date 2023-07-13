import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './css/SearchBar.css';

function SearchBar({ selectedCategoryId, selectedSubCategoryId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const queryString = `?keyword=${encodeURIComponent(searchTerm)}&categoryid=${encodeURIComponent(
      selectedCategoryId
    ) || ''}&subcategoryid=${encodeURIComponent(selectedSubCategoryId) || ''}`;
    window.location.href = `/search${queryString}`;
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          className="search-bar-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn submit-button">
          {isLoading ? (
            <div className="spinner-grow spinner-grow-sm"></div>
          ) : (
            <div className="searchbar-icon">
              <FaSearch />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;