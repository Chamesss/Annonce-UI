import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Modal } from 'react-bootstrap';
import { FaChevronLeft } from 'react-icons/fa';
import Header from '../../components/header';
import Category from '../../components/category';
import Footer from '../../components/footer';
import ReactAudioPlayer from 'react-audio-player';
import { FaMapMarkerAlt, FaPhoneAlt, FaHome, FaBuilding, FaUser, FaRegCalendarAlt } from "react-icons/fa";
import Spinner from '../../components/Spinner';
import { calculateTimeAgo } from '../../utils/DateDefiner';
import ProductList from '../../components/productList';

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
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/details/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, idad: idAd.productId },
        });
        const data = await response.json();
        setProduct(data.ad);
        await fetchUserDetails(data.ad.idUser);
        await getAds(data.ad.categoryId);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [idAd]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getAds = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/get`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, searchquery: '', categoryid: categoryId, subcategoryid: '', locationid: '' },
      });
      const data = await response.json();
      setAds(data.ads);

    } catch (err) {
      console.log(err);
    }
  };



  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/user/getuserdetails', {
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
      const response = await fetch("https://annonce-backend.azurewebsites.net/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status === true) {
        const InnerResponse = await fetch(`https://annonce-backend.azurewebsites.net/ad/adfavorite/${data.userId}/${product._id}`, {
          method: "POST"
        })
        const InnerData = await InnerResponse.json();
        if (InnerData.success === true) {
          setMessage(InnerData.message);
        } else {
          setError(InnerData.message);
        }
      } else {
        navigate('/login');
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
    try {
      const response = await fetch("https://annonce-backend.azurewebsites.net/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status === true) {
        const InnerResponse = await fetch(`https://annonce-backend.azurewebsites.net/user/reclamation/${data.userId}/${product._id}`, {
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

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <Category />
      <div className="p-3" onClick={handleGoBack} style={{ transform: "translateY(50%)" }}>
        <FaChevronLeft className="carousel-arrow" />
      </div>
      {!product ? (<div><Spinner /></div>) : (<div className="container p-5">
        <div className="row ">
          <div className="col-lg ratio ratio-4x3 " >
            <div id="carouselExampleIndicators" className=" carousel carousel-fade d-flex align-items-center justify-content-center " data-ride="carousel">
              <ol className="carousel-indicators ">
                {product.pictures.map((_, index) => (
                  <li data-target="#carouselExampleIndicators" data-slide-to={index} className={index === currentImageIndex ? 'active' : ''} key={index}></li>
                ))}
              </ol>
              <div className="carousel-inner border rounded custom-resizing p-10">
                {product.pictures.map((picture, index) => (
                  <div className={`custom-resizing carousel-item ${index === currentImageIndex ? 'active' : ''} d-flex `} key={index}>
                    <img className="rounded" src={picture} alt={product.title} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev custom-carousel-button" type="button" data-target="#carouselExampleIndicators" data-slide="prev" onClick={() => handlePrevImage()}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Précédent</span>
              </button>
              <button className="carousel-control-next custom-carousel-button" type="button" data-target="#carouselExampleIndicators" data-slide="next" onClick={() => handleNextImage()}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Suivant</span>
              </button>
              <ol className="carousel-indicators">
                {product.pictures.map((_, index) => (
                  <li data-target="#carouselExampleIndicators" data-slide-to={index} className={index === currentImageIndex ? 'active' : ''} key={index}></li>
                ))}
              </ol>
            </div>
          </div>
          <div className="col-lg-6 px-5">
            {user !== null ? (
              <div>
                <div className="d-flex align-items-center">
                  <img src={user.picture} alt="" className="rounded-circle me-2 " style={{ width: "55px", height: "auto", cursor: "pointer" }} onClick={() => handleOwnerPage(user._id)} />
                  <div className="px-5 ">
                    <div className="d-flex align-items-center "><FaUser />
                      <p className="mb-2 px-2" style={{ color: "red", fontSize: "20px", cursor: "pointer" }} onClick={() => handleOwnerPage(user._id)}>  {user.firstname} {user.lastname}</p></div>
                    {user.type === "individual" ? (
                      <div className="d-flex align-items-center "><FaHome />
                        <p className="mb-2 px-2 text-primary">  Individuelle</p></div>
                    ) : (<div className="d-flex align-items-center "><FaBuilding />
                      <p className="mb-2 px-2 text-primary">  Entreprise</p></div>)}
                    <p className="mb-2"><FaMapMarkerAlt /> {user.country}, {user.city}</p>
                    <p className="mb-2"><FaPhoneAlt /> +216 {user.tel}</p>
                    <p className="mb-2"><FaRegCalendarAlt />  Rejoint: {user.createdAt.split('T')[0]}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <hr className="my-4"></hr>
            <h2 className="text-black">{product.title}</h2>
            <p className="text-black">{product.description}</p>

            <ReactAudioPlayer src={product.vocal} controls />
            <div className="d-flex align-items-center">
              <h3 className="text-danger me-2">{product.price}</h3>
              <h6 className="text-danger me-2">DT</h6>
            </div>
            <p className="text-black">{calculateTimeAgo(product.date)}</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary py-2 my-2" onClick={() => handleFavoritesAd()}>Ajouter aux favoris</button>
              <button className="btn btn-danger py-2 my-2" onClick={() => handleShowModal()}>Signaler l'annonce</button>
            </div>
            {message && <div className="text-success mb-3">{message}</div>}
            {error && <div className="text-danger mb-3">{error}</div>}
          </div>
          {showmodal && (
            <Modal show={showmodal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Signaler l'annonce</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Pourquoi signaler cette annonce ??</p>
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
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >Annuler</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleRapportAd()}
                >Valider</button>


              </Modal.Footer>
            </Modal>
          )}

        </div>
      </div>)}
      <div className="d-flex justify-content-center align-items-center">
        <hr className="my-4" style={{ width: '90%', borderWidth: '4px', fontWeight: 'bold' }} />
      </div>
      <div className="container pb-5">
        <h3 style={{ color: "#D85A60" }}>Autre Annonces de même category: </h3>
      </div>
      <div >
        {ads.length > 0 ? (
          <div>
            <ProductList products={ads} />
          </div>
        ) : (
          <div><Spinner /></div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdDetails;