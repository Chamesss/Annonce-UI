import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { FaUser, FaHeart, FaQuestionCircle, FaSignOutAlt, FaBell, FaFilter, FaMapMarkerAlt } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import "./css/Header.css";
import SearchBar from "./searchBar";

function Header({ onSearchData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategoryName, setSubCategoryName] = useState(null);
  const [selectedSubCategoryId, setSubCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isSearchBarClicked, setIsSearchBarClicked] = useState(false);


  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCategoryid(category._id);
    setSubCategoryName(null);
  };

  useEffect(() => {
    fetchUser();
    fetchLocations();
    fetchCategories();

  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8080/location/get');
      const data = await response.json();
      setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // Filter the locations based on the search term
    const filteredLocations = locations.filter(
      (location) =>
        location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
        location.city.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredLocations);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:8080/user/getuser", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.status === true) {
          setUser(data.user);
          setIsAuthenticated(true);
          console.log(data.user);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/category/getall");
      const data = await response.json();
      setCategories(data.category);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearchBarClick = () => {
    setIsSearchBarClicked(true);
  };

  const handleLocationSelect = (event, locationId, city, country) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedLocationId(locationId);
    let place = country + ', ' + city;
    setSearchTerm(place);
    setSelectedLocation(place);
    setSuggestions([]);
  };

  function handleLocationIconClick() {
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
  }

  function handleModalSubmit(event) {
    event.preventDefault();
    setShowModal(false);
  }

  const navigatehome = () => {
    navigate("/");
  }

  const handleMouseEnter = () => {
    setShowNavbar(true);
  };

  const handleMouseLeave = () => {
    setShowNavbar(false);
  };

  const handleCreateAdClick = () => {
    isAuthenticated ? navigate("/create-ad") : navigate("/login");
  };

  const handleMyAds = () => {
    isAuthenticated ? navigate("/my-ads") : navigate("/login");
  };

  const handleLoginClick = () => {
      navigate("/login");
  };

  const handleSubCategorySelect = (subcategory) => {
    setSubCategoryName(subcategory);
    setSubCategoryId(subcategory._id)
  }

  return (
    <header className="header-transition">
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Enter an address"
            />
            {searchTerm.length > 1 && suggestions.length > 0 && (
              <ul>
                {suggestions.slice(0, 6).map((location) => (
                  <li
                    key={location._id}
                    onClick={(event) =>
                      handleLocationSelect(
                        event,
                        location._id,
                        location.city,
                        location.admin_name
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {location.admin_name}, {location.city}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="logo-container">
        <h1
          className="logo"
          onClick={navigatehome}
          style={{ cursor: 'pointer', fontFamily: 'Helvetica', color: "#0A62F3", fontWeight: "520" }}
        >
          Annonce
        </h1>
      </div>
      <div className="dropdown-container">
        <div className="category">
          <Dropdown className="collapse-list">
            <Dropdown.Toggle variant="primary" id="dropdown-categories" className="theme">
              <FaFilter className="category-icon" />
              {selectedCategory ? selectedCategory.name : 'Categories'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Dropdown className="collapse-list">
          <Dropdown.Toggle variant="primary" id="dropdown-subcategories" className="theme">
            <FaFilter className="category-icon" />
            {selectedSubCategoryName ? selectedSubCategoryName.name : 'Subcategories'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
              selectedCategory.subcategories.map((subcategory) => (
                <Dropdown.Item key={subcategory.id} onClick={() => handleSubCategorySelect(subcategory)}>
                  {subcategory.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No subcategories available</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

      </div>
      <div className="fixed-content">
        <div className="search">
          <FaMapMarkerAlt className="location-icon" onClick={handleLocationIconClick} />
          {selectedLocation && (
            <div className="selected-location">{selectedLocation}</div>
          )}
        </div>
      </div>
      <div onClick={handleSearchBarClick}>
        <SearchBar
          selectedCategoryId={isSearchBarClicked ? selectedCategoryId : null}
          selectedSubCategoryId={isSearchBarClicked ? selectedSubCategoryId : null}
          selectedLocationId={isSearchBarClicked ? selectedLocationId : null}
        />
      </div>
      <div className="buttons-container">
        <Button
          variant="primary"
          className="btn btn-primary create-ad-button"
          onClick={handleCreateAdClick}
        >
          <TiPlus className="button-icon" />
          <span>Publier Annonce</span>
        </Button>
        {isAuthenticated ? (
          <>
            <Button
              variant="primary"
              className="btn btn-primary my-ad-button"
              onClick={handleMyAds}
            >
              <span>My Ads</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              className="login-btn"
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button
              variant="primary"
              className="login-btn"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </>
        )}
        {isAuthenticated && (
          <div
            className="profile-nav"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="profile-section">
              <div className="ms-3">
                {user.picture && (
                  <div className="profile-picture-container">
                    <img
                      src={user.picture}
                      alt={user.firstname}
                      className="profile-picture"
                    />
                  </div>
                )}
              </div>
            </div>
            {showNavbar && (
              <div>
                <nav className="small-navbar">
                  <a href="#profile">
                    <FaUser /> My Profile
                  </a>
                  <a href="#favorites">
                    <FaHeart /> Favorites
                  </a>
                  <a href="#notifications">
                    <FaBell /> Notifications
                  </a>
                  <a href="#faq">
                    <FaQuestionCircle /> FAQ
                  </a>
                  <a href="#logout" style={{ color: "red" }}>
                    <FaSignOutAlt /> Log Out
                  </a>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;