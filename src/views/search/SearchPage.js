import queryString from 'query-string';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/header';
import Category from '../../components/category';
import Product from '../../components/product';
import Footer from '../../components/footer';
import Spinner from '../../components/Spinner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './search.css';

/* eslint-disable react-hooks/exhaustive-deps */

function SearchPage() {
  const search = window.location.search;
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [locationId, setLocationId] = useState(null);
  const [keyword] = useState(queryString.parse(search).keyword);
  const [categoryId, setCategoryId] = useState(queryString.parse(search).categoryid);
  const [subcatgeoryId, setSubCategoryid] = useState(queryString.parse(search).subcategoryid);
  const [radius, setRadius] = useState(13);
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [userlng, setUserLng] = useState(10.1815);
  const [userlat, setUserLat] = useState(36.8065);
  const [markerRadius, setMarkerRadius] = useState('20');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const markerRef = useRef(null);



  useEffect(() => {

    const fetchLocations = async () => {
      try {
        const response = await fetch('https://annonce-backend.azurewebsites.net/location/get');
        const data = await response.json();
        setLocations(data.locations);
        fetchUser(data.locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://annonce-backend.azurewebsites.net/category/getall');
        const data = await response.json();
        setCategories(data.category);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  useEffect(() => {
    mapRef.current = L.map(mapContainerRef.current, {
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([userlat, userlng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(mapRef.current);
    geocoderRef.current = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: new L.Control.Geocoder.Nominatim(),
    }).addTo(mapRef.current);
    markerRef.current = L.circle([userlat, userlng], {
      radius: radius * 1000,
      color: 'blue',
      fillOpacity: 0.2,
    }).addTo(mapRef.current);
    return () => {
      mapRef.current.remove();
    };
  }, [userlat]);

  const handleProductClick = (product) => {
    navigate(`/annonce/${product._id}`);
  };


  const fetchUser = async (location) => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/protected', {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (data.status) {
        const innerResponse = await fetch(`https://annonce-backend.azurewebsites.net/user/getuserdetails`, {
          method: "GET",
          headers: { id: data.userId }
        });
        const innerData = await innerResponse.json();
        if (innerData.status === true) {
          setUserLng(parseInt(innerData.user.lng, 10));
          setUserLat(parseInt(innerData.user.lat, 10));
          const selectedLocation = location.find((loc) => loc.city === innerData.user.city);
          setLocationId(selectedLocation._id);
          fetchData(keyword, categoryId, subcatgeoryId, selectedLocation._id, markerRadius, currentPage);
        }
      } else {
        setLocationId('646a282aa3d17726b7ad138d');
        fetchData(keyword, categoryId, subcatgeoryId, '646a282aa3d17726b7ad138d', markerRadius, currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async (keyword, categoryId, subcategoryId, locationid, radius, currentPage) => {
    subcategoryId = subcategoryId === 'undefined' ? '' : subcategoryId;
    categoryId = categoryId === 'undefined' ? '' : categoryId;
    keyword = keyword === 'undefined' ? '' : keyword;
    radius = radius === 'undefined' ? '' : radius;

    try {
      setProducts([]);
      const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/get?page=${currentPage}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          searchquery: keyword,
          categoryid: categoryId,
          subcategoryid: subcategoryId,
          locationid: locationid,
          radius: radius
        },
      });
      const data = await response.json();
      if (data.ads.length === 0) {
        setProducts(['empty']);
        return
      }
      setProducts(data.ads);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching Ads:', error);

    }
  }

  const options = suggestions.slice(0, 8).map((location) => ({
    id: `${location._id}`,
    value: `${location.admin_name}, ${location.city}`,
    label: `${location.admin_name}, ${location.city}`,
  }));


  const handleLocationSelect = (location) => {
    setLocationId(location.id);
    const selectedLocation = locations.find((loc) => loc._id === location.id);
    if (selectedLocation) {
      const defaultLocation = {
        id: selectedLocation._id,
        value: `${selectedLocation.admin_name}, ${selectedLocation.city}`,
        label: `${selectedLocation.admin_name}, ${selectedLocation.city}`,
      };
      setLocation(defaultLocation);
      const { lat, lng } = selectedLocation;
      if (lat && lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.circle([latitude, longitude], {
            radius: radius * 1000,
            color: 'blue',
            fillOpacity: 0.2,
          }).addTo(mapRef.current);
        }
        mapRef.current.setView([latitude, longitude], radius);
      }
    } else {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  };

  const handleInputChange = (value) => {
    const filteredLocations = locations.filter(
      (location) =>
        location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
        location.city.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredLocations);
  };


  const handleDistanceChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    const mapping = {
      6: 450,
      7: 150,
      8: 80,
      9: 40,
      10: 20,
      11: 10,
    };
    const markerRadius = mapping[newRadius];
    if (newRadius === 6) {
      setMarkerRadius('> 350')
    } else {
      setMarkerRadius(markerRadius)
    }

    if (markerRef.current && mapRef.current) {
      const { lat, lng } = markerRef.current.getLatLng();
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = L.circle([lat, lng], {
        radius: markerRadius * 1000,
        color: 'blue',
        fillOpacity: 0.2,
      }).addTo(mapRef.current);
      mapRef.current.setView([lat, lng], newRadius);
    }
  };

  const handleApplyFilters = () => {
    fetchData(keyword, categoryId, subcatgeoryId, locationId, markerRadius, currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handlePageChange(pageNumber) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setProducts([]);
    setCurrentPage(pageNumber);
    fetchData(keyword, categoryId, subcatgeoryId, locationId, markerRadius, pageNumber)
  }


  return (
    <div>
      <Header />
      <div className='header'>
        <Category />
      </div>

      <div className="cards-container">
        <div className="filter-container">
          <div className="filter-content">
            <h2 className="filter-title">Filtrage</h2>
            <div className="filter-section">
              <label htmlFor="location" className="filter-label">Location:</label>
              <Select
                options={options}
                value={location}
                onChange={handleLocationSelect}
                onInputChange={handleInputChange}
                placeholder="Enter an address"
                blurInputOnSelect={false}
                className="filter-select"
              />
            </div>
            <div className="filter-section">
              <label htmlFor="category" className="filter-label">Category:</label>
              <select
                value={categoryId}
                className="filter-select"
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value=''>Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-section">
              <label htmlFor="subcategory" className="filter-label">Subcategory:</label>
              <select
                className="filter-select"
                value={subcatgeoryId}
                onChange={(e) => setSubCategoryid(e.target.value)}
              >
                <option value=''>Select subcategory</option>
                {categories.find((category) => category._id === categoryId)?.subcategories.map(
                  (subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="filter-section">
              <label htmlFor="distance" className="filter-label">Distance:</label>
              <input
                id="distance"
                type="range"
                className="filter-range"
                min="6"
                max="10"
                value={radius}
                onChange={handleDistanceChange}
              />
              <span className="filter-range-value">{markerRadius} km</span>
            </div>
            <div className="filter-section">
              <button className="filter-button" onClick={handleApplyFilters}>
                Appliquer
              </button>
            </div>
          </div>
          <div className="map-container" ref={mapContainerRef}></div>
        </div>

        <div className="cards-section">
          {keyword && (
            <div className="search-query">
              <h1 className="search-query-text">
                Votre requête de recherche : "{keyword}"
              </h1>
            </div>
          )}
          <h3 className="results-heading">Résultats de recherche:</h3>
          {products.length > 0 && products[0] !== 'empty' ? (
            <div className="card-grid">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="card-item"
                  onClick={() => handleProductClick(product)}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          ) : products[0] === 'empty' ? (
            <div className="empty-results">Aucun produit à afficher.</div>
          ) : (
            <div className="spinner-container"><Spinner /></div>
          )}
          <div className="pagination">
            {totalPages > 1 && (
              Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;