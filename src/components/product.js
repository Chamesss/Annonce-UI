import React, { useState } from 'react';
import { FaMapMarkerAlt, FaRegHeart, FaHeart } from 'react-icons/fa';
import ReactAudioPlayer from 'react-audio-player';
import './css/Product.css';
import { calculateTimeAgo } from './../utils/DateDefiner';


function Product({ product }) {
  const [favoritetrue, setFavoriteTrue] = useState(product.isFavorite ? product.isFavorite : false);
  const [distance] = useState(product.distance ? product.distance : null)


  const handleButtonClick = async (event) => {
    event.stopPropagation();
    if (favoritetrue === false) {
      await fetchUser();
    } else {
      await fetchUser2();
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/protected', {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (data.status) {
        const innerResponse = await fetch(`https://annonce-backend.azurewebsites.net/ad/adfavorite/${data.userId}/${product._id}`, {
          method: "POST",
        });
        const innerData = await innerResponse.json();
        if (innerData.success === true) {
          setFavoriteTrue(true);
        } else {
          console.log('failed');
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser2 = async () => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/protected', {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (data.status) {
        const innerResponse = await fetch(`https://annonce-backend.azurewebsites.net/ad/deletefavorite/${data.userId}/${product._id}`, {
          method: "DELETE",
        });
        const innerData = await innerResponse.json();
        if (innerData.success === true) {
          setFavoriteTrue(false);
        } else {
          console.log('failed');
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card-product">
      <div class="card-img-container">
        <img className="card-img-top" src={product.pictures[0]} alt="" />
      </div>
      <div className="position-absolute top-0 end-0 mt-3 me-3">
        {favoritetrue ? (
          <div className="icontrue" style={{ zIndex: 1 }} onClick={handleButtonClick}>
            <div>
              <FaHeart />
            </div>
          </div>
        ) : (<div className="iconfalse" style={{ zIndex: 1 }} onClick={handleButtonClick}>
          <div>
            <FaRegHeart />
          </div>
        </div>
        )}
      </div>
      <div className="card-body ">
        <h6 className="card-title">{product.title}</h6>
        <span className="card-text text-start " style={{ color: "grey"}}><FaMapMarkerAlt />&nbsp;{product.country}, {product.city}
          {distance !== null ? (
            <span className="small-font text-black">&nbsp;({distance.toString().slice(0, -3)} km)</span>
          ) : (null)}
        </span><br></br>
        <span className="small-font">{calculateTimeAgo(product.createdAt)}</span><br></br>
        <span className="product-price text-danger text-end">{product.price} DT</span>
      </div>
      <div>
        {product.vocal ? (
          <div className="card-footer">
            <ReactAudioPlayer
              src={product.vocal}
              controls
              className="custom-audio-player"
            />
          </div>
        ) : (<div className="card-footer"></div>)}
      </div>
    </div>
  );
}

export default Product;