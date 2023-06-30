import React from 'react';
import Product from './product';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './css/ProductList.css';
import { useNavigate } from 'react-router-dom';

function ProductList({ products }) {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/annonce/${product._id}`);
  };

  const CustomPrevArrow = (props) => (
    <button
      type="button"
      className="carousel-arrow prev-arrow"
      onClick={props.onClick}
    >
      <FaChevronLeft />
    </button>
  );

  const CustomNextArrow = (props) => (
    <button
      type="button"
      className="carousel-arrow next-arrow"
      onClick={props.onClick}
    >
      <FaChevronRight />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="p-5">
      <Slider {...settings}>
        {products.map((product) => (
          <div
          key={product._id}
          className="col mb-4"
          onClick={() => handleProductClick(product)}
        >
          <Product product={product} />
        </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductList;