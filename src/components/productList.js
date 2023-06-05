import React from 'react';
import Product from './product';
import { useNavigate } from 'react-router-dom';
import './css/ProductList.css'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

function ProductList({ products }) {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    console.log('aaaaaaaaaaaaaaaaa',product);
    navigate(`/annonce/${product._id}`);
  };

  // Group the products into chunks of 5 cards
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 5) {
    groupedProducts.push(products.slice(i, i + 5));
  }

  // Calculate the number of empty placeholders needed for the last slide
  const lastSlideEmptySlots = 5 - (products.length % 5);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ width: '100%', backgroundColor:"white"}}
      >
        <div className="carousel-inner">
          {groupedProducts.map((group, index) => (
            <div key={index} className={`carousel-item${index === 0 ? ' active' : ''}`} >
              <div
                className="row d-flex flex-row justify-content-center align-items-center"
                style={{ backgroundColor:"white" }}
              >
                {group.map((product) => (
                  <div
                    key={product._id}
                    className="col-md-2 mx-3"
                    onClick={() => handleProductClick(product)}
                  >
                    <Product product={product} />
                  </div>
                ))}
                {/* Add empty placeholders for the last slide */}
                {index === groupedProducts.length - 1 &&
                  [...Array(lastSlideEmptySlots)].map((_, placeholderIndex) => (
                    <div
                      key={placeholderIndex}
                      className="col-md-2 mx-3 card"
                      style={{ visibility: 'visible', width: '250px', height:'400px'}}
                    ></div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {groupedProducts.length > 1 && (
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
            style={{width:"6%"}}
          >
            <span className="carousel-control-prev-icon custom-carousel-button" aria-hidden="true"></span>
            <span className="visually-hidden">Précédent</span>
          </button>
        )}
        {groupedProducts.length > 1 && (
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
            style={{width:"6%"}}
          >
            <span className="carousel-control-next-icon custom-carousel-button" aria-hidden="true"></span>
            <span className="visually-hidden">Suivant</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductList;