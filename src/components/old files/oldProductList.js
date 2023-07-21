import React, { useState } from 'react';
import Product from '../product';
import { useNavigate } from 'react-router-dom';
import './css/ProductList.css';

function ProductList({ productsPerPage = 10, products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Add type checking for productsPerPage
  if (typeof productsPerPage !== 'number') {
    console.error(
      `Expected 'productsPerPage' to be a number, but got ${typeof productsPerPage}.`
    );
    return null;
  }
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(products)
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  const productRows = [];
  for (let i = 0; i < currentProducts.length; i += 6) {
    productRows.push(currentProducts.slice(i, i + 6));
  }

  const handleProductClick = (product) => {
    navigate(`/annonce/${product.id}`);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <div className="product-list-container">
        <div className="product-list">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="col mb-4"
                onClick={() => handleProductClick(product)}
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button
          className="button mr-2"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="button"
          onClick={handleNextPage}
          disabled={currentProducts.length < productsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;