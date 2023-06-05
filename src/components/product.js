import React, { useState } from 'react';
import { FaMapMarkerAlt, FaRegHeart,FaHeart } from 'react-icons/fa';
import ReactAudioPlayer from 'react-audio-player';
import { useNavigate } from 'react-router-dom';
import './css/Product.css';


function Product({ product }) {

  const [id, setId] = useState('');
  const [favoritetrue, setFavoriteTrue] = useState(product.isFavorite ? product.isFavorite : false);
  const [distance, setDistance] = useState(product.distance ? product.distance : null)
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:8080/protected', {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      console.log('heeeeeeeeeeeeeeeeeeeheeeeeeeeeeeee', data);
      setId(data.userId);
      if (data.status) {
        const innerResponse = await fetch(`http://localhost:8080/ad/adfavorite/${data.userId}/${product._id}`, {
          method: "POST",
        });
        const innerData = await innerResponse.json();
        if (innerData.success === true) {
          console.log('added sucess');
          setFavoriteTrue(true);
        } else {
          console.log('failed');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser2 = async () => {
    try {
      const response = await fetch('http://localhost:8080/protected', {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setId(data.userId);
      if (data.status) {
        const innerResponse = await fetch(`http://localhost:8080/ad/deletefavorite/${data.userId}/${product._id}`, {
          method: "DELETE",
        });
        const innerData = await innerResponse.json();
        if (innerData.success === true) {
          console.log('deleted sucess');
          setFavoriteTrue(false);
        } else {
          console.log('failed');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <img className="card-img-top" src={product.pictures[0]} />
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
      <div className="card-body">
        <h6 className="card-title">{product.title}</h6>
        <p className="card-text" style={{color:"grey"}}><FaMapMarkerAlt /> {product.country}, {product.city}</p>
        {distance !== null ?(
           <p>à {product.distance.toString().slice(0, -3)} km</p>
        ):(null)}
        <p className="product-price my-2 text-danger text-end">{product.price} dt</p>
        <div className="card-footer custom-card-footer md-5 align-items-center justify-content-center">
          {product.vocal && (
            <ReactAudioPlayer
              src={product.vocal}
              controls
              className="custom-audio-player"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;