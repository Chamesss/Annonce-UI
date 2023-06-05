import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/header';
import Banner from '../components/banner';
import Category from '../components/category';
import ProductList from '../components/productList';
import Footer from '../components/footer';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './css/homepage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/category/getall');
      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/ad/get`, {
          method: 'GET',
          headers: { authorization: `Bearer ${token}`, searchquery:'', categoryid:'', subcategoryid:'', locationid:'' },
        });
        const data = await response.json();
        setProducts(data.ads);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="header">
        <Header />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="parent-container">
            <Category />
            <div>
              <h2 className="titleCat mt-5">Nouveauté</h2>
              <div className="horizontal-bar"> </div>
              <div className="products-container">
                <ProductList products={products}/>
              </div>
            </div>
            {categories.map((category) => (
              <div key={category._id}>
                <h2 className='titleCat mt-5'>{category.name}</h2>
                <div className="horizontal-bar"></div>
                <div className="products-container">
                  {Array.isArray(products) && products.length > 0 ? (
                    <ProductList
                      products={products.filter(
                        (product) => product.category === category._id
                      )}
                    />
                  ) : (
                    <p>No products available</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        </>

      )}


      <Footer />
    </div>
  );
}

export default HomePage;