import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../../components/header';
import Category from '../../components/category';
import Footer from '../../components/footer';
import ReactAudioPlayer from 'react-audio-player';
import { FaMapMarkerAlt, FaPhoneAlt, FaHome, FaBuilding, FaUser } from "react-icons/fa";

import './css/AdDetails.css';

function AdDetails() {
  const idAd = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showmodal, setShowModal] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/ad/details/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, idad: idAd.productId },
        });
        const data = await response.json();
        setProduct(data.ad);
        await fetchUserDetails(data.ad.idUser);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [idAd]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch('http://localhost:8080/user/getuserdetails', {
        method: "GET",
        headers: { id: id },
      })
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleOwnerPage = (user) => {
    navigate(`/user/${user}`);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.pictures.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === product.pictures.length - 1 ? 0 : prevIndex + 1));
  };

  const handleFavoritesAd = async () => {
    try {
      const response = await fetch("http://localhost:8080/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status === true) {
        const InnerResponse = await fetch(`http://localhost:8080/ad/adfavorite/${data.userId}/${product._id}`, {
          method: "POST"
        })
        const InnerData = await InnerResponse.json();
        if (InnerData.success === true) {
          setMessage(InnerData.message);
        } else {
          setError(InnerData.message);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleChange = (e) => {
    setInfo(e.target.value);
  };

  const handleRapportAd = async () => {
    setShowModal(false);
    console.log(info);
    try {
      const response = await fetch("http://localhost:8080/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status === true) {
        const InnerResponse = await fetch(`http://localhost:8080/user/reclamation/${data.userId}/${product._id}`, {
          method: "POST",
          body: JSON.stringify({ info }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const InnerData = await InnerResponse.json();
        if (InnerData.success === true) {
          setMessage(InnerData.message);
        } else {
          setError(InnerData.message);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <Category />
      <div class="container p-5">
        <div class="row ">
          <div class="col-lg ratio ratio-4x3 " >
            <div id="carouselExampleIndicators" class=" carousel carousel-fade d-flex align-items-center justify-content-center " data-ride="carousel">
              <ol class="carousel-indicators ">
                {product.pictures.map((_, index) => (
                  <li data-target="#carouselExampleIndicators" data-slide-to={index} class={index === currentImageIndex ? 'active' : ''} key={index}></li>
                ))}
              </ol>
              <div class="carousel-inner border rounded custom-resizing p-10">
                {product.pictures.map((picture, index) => (
                  <div class={`custom-resizing carousel-item ${index === currentImageIndex ? 'active' : ''} d-flex `} key={index}>
                    <img class="rounded" src={picture} alt={product.title} />
                  </div>
                ))}
              </div>
              <button class="carousel-control-prev custom-carousel-button" type="button" data-target="#carouselExampleIndicators" data-slide="prev" onClick={() => handlePrevImage()}>
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </button>
              <button class="carousel-control-next custom-carousel-button" type="button" data-target="#carouselExampleIndicators" data-slide="next" onClick={() => handleNextImage()}>
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </button>
              <ol class="carousel-indicators">
                {product.pictures.map((_, index) => (
                  <li data-target="#carouselExampleIndicators" data-slide-to={index} class={index === currentImageIndex ? 'active' : ''} key={index}></li>
                ))}
              </ol>
            </div>
          </div>
          <div class="col-lg-6 px-5">
            {user !== null ? (
              <div>
                <div class="d-flex align-items-center">
                  <img src={user.picture} alt="User Picture" class="rounded-circle me-2 " style={{ width: "55px", height: "auto", cursor: "pointer" }} onClick={() => handleOwnerPage(user._id)} />
                  <div class="px-5 ">
                    <div class="d-flex align-items-center "><FaUser />
                      <p class="mb-2 px-2" style={{ color: "red", fontSize: "20px", cursor: "pointer" }} onClick={() => handleOwnerPage(user._id)}>  {user.firstname} {user.lastname}</p></div>
                    <p class="mb-2"><FaMapMarkerAlt /> {user.country}, {user.city}</p>
                    <p class="mb-2"><FaPhoneAlt /> +216 {user.tel}</p>
                    {user.type === "individual" ? (
                      <div class="d-flex align-items-center "><FaHome />
                        <p class="mb-2 px-2 text-primary">  Individual</p></div>
                    ) : (<div class="d-flex align-items-center "><FaBuilding />
                      <p class="mb-2 px-2 text-primary">  Entreprise</p></div>)}
                  </div>
                </div>
              </div>
            ) : null}
            <hr class="my-4"></hr>
            <h2 class="text-black">{product.title}</h2>
            <p class="text-black">{product.description}</p>
            <ReactAudioPlayer src={product.vocal} controls />
            <div class="d-flex align-items-center">
              <h3 class="text-danger me-2">{product.price}</h3>
              <h6 class="text-danger me-2">DT</h6>
            </div>
            <div className="d-flex justify-content-between">
              <button class="btn btn-primary py-2 my-2" onClick={() => handleFavoritesAd()}>Ajouter aux favoris</button>
              <button class="btn btn-danger py-2 my-2" onClick={() => handleShowModal()}>Repport Ad</button>
            </div>
            {message && <div className="text-success mb-3">{message}</div>}
            {error && <div className="text-danger mb-3">{error}</div>}
          </div>
          {showmodal && (
            <Modal show={showmodal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Repport Ad</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Why would you repport this ad?</p>
                <input
                  type="input"
                  className="form-control"
                  id="repport"
                  value={info}
                  onChange={handleChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >Cancel</button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleRapportAd()}
                >Submit</button>


              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div><Footer />
    </div>
  );
}

export default AdDetails;