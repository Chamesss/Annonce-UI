import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

function SearchBar({ selectedCategoryId, selectedSubCategoryId, selectedLocationId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const queryString = `?keyword=${encodeURIComponent(searchTerm)}&categoryId=${encodeURIComponent(selectedCategoryId)}&subcategoryId=${encodeURIComponent(selectedSubCategoryId)}&locationId=${encodeURIComponent(selectedLocationId)}`;
    Navigate(`/search${queryString}`);
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">
          {isLoading ? 'Loading...' : <FaSearch />}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;