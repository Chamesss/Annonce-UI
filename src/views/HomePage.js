import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Banner from '../components/banner';
import ProductList from '../components/productList';
import Footer from '../components/footer';
import './css/homepage.css';
import Spinner from './../components/Spinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/* eslint-disable react-hooks/exhaustive-deps */

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/category/getall');
      const data = await response.json();
      setCategories(data.category);
      return (data.category)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const responseNouveaute = await fetch(`https://annonce-backend.azurewebsites.net/ad/get`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, searchquery: '', categoryid: '', subcategoryid: '', locationid: '' },
      });
      const dataNouveaute = await responseNouveaute.json();
      const categoriess = await fetchCategories();
      const productsByCategory = await Promise.all(
        categoriess.map((category) =>
          fetchProductsByCategory(category._id)
        )
      );

      setProducts([dataNouveaute.ads, ...productsByCategory]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/get`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, searchquery: '', categoryid: categoryId, subcategoryid: '', locationid: '' },
      });
      const data = await response.json();
      return data.ads;
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err);
      return [];
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <Banner />
      {loading ? (
        <div><Spinner /></div>
      ) : (
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <h2 className="titleCat mt-5">Nouveauté</h2>
            <div className="horizontal-bar"> </div>
            <div>
              <ProductList products={products[0]} />
            </div>
          </div>
          {categories.map((category, index) => (
            <div key={category._id}>
              <h2 className='titleCat mt-5'>{category.name}</h2>
              <div className="horizontal-bar"></div>
              <div>
                <ProductList products={products[index + 1]} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default HomePage;