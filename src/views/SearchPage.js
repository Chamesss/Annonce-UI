import queryString from 'query-string';
import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Category from '../components/category';
import ProductList from '../components/productList';
import Footer from '../components/footer';

function SearchPage() {

  const [products, setProducts] = useState([]);


  useEffect(() => {
    const search = window.location.search;
    const { keyword, categoryId, subcategoryId, locationId } = queryString.parse(search);

    // Perform the API call using the query parameters
    fetchData(keyword, categoryId, subcategoryId, locationId);
  }, []);

  async function fetchData(keyword, categoryId, subcategoryId, locationId) {
    // Perform the API call with the search parameters and handle the response
    try {
      const response = await fetch('http://localhost:8080/ad/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          searchQuery: keyword,
          categoryId,
          subcategoryId,
          locationId,
        },
      });
      const data = await response.json();
      console.log(data);
      setProducts(data);
      // Handle the fetched data
    } catch (error) {
      console.error('Error fetching Ads:', error);
    }
  }

  return (
    <div>
      <div>
      <Header />
          <div>
            <Category />
            <ProductList products={products} productsPerPage={10} />
          </div>
      <Footer />
    </div>
    </div>
  );
}

export default SearchPage;