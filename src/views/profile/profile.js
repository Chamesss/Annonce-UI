import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
//import {FaCity, FaHome, FaBuilding, FaEnvelope, FaUser } from "react-icons/fa";

// import { Spinner } from 'react-bootstrap';
import { AiFillEdit } from 'react-icons/ai';
import './css/Profile.css';

function Profile({ userinfo }) {
  const [user] = useState(userinfo);
  // const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // const handleSendVerification = async (userid, email) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`https://annonce-backend.azurewebsites.net/user/send/${email}/${userid}`, {
  //       method: "GET"
  //     })
  //     const data = await response.json();
  //     if (data.status === true) {
  //       setIsLoading(false);
  //       setMessage(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  return (
    <div className="profile-section-main">
      {user !== null ? (
        <div className="">
          <div className="">
            <div className="upper-section-profile">
              <div className="upper-profile-section-info">
                <div className="" style={{ maxWidth: '80px', maxHeight: '80px' }}>
                  <img src={user.picture} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="upper-profile-section-details">
                  <span className="upper-profile-section-details-name">{user.firstname} {user.lastname}</span>
                  <span className="upper-profile-section-details-phone-adress"><FaPhoneAlt />&nbsp; +216 {user.tel}</span>
                  <span className="upper-profile-section-details-phone-adress"><FaMapMarkerAlt />&nbsp; {user.country}, {user.city}</span>
                </div>
              </div>
              <div>
                <div className="button profile-edit-button" onClick={() => null}><AiFillEdit /></div>
              </div>
            </div>
            <div className="profile-body-section-main">
              <div className="profile-section-title">
                <div>
                  <span>Personal information</span>
                </div>
                <div>
                  <div className="button profile-edit-button" onClick={() => null}><AiFillEdit /></div>
                </div>
              </div>
              <div className="profile-body-section">
                <div className="profile-body-section-info">
                  <div className="col">
                    <p className="upper-profile-section-details-phone-adress">First Name</p>
                    <p>{user.firstname}</p>
                    <p className="upper-profile-section-details-phone-adress">Email address</p>
                    <p>{user.email}</p>
                    <p className="upper-profile-section-details-phone-adress">Type</p>
                    <p>{user.type}</p>
                  </div>
                  <div className="col col-lg-7">
                    <p className="upper-profile-section-details-phone-adress">Last Name</p>
                    <p>{user.lastname}</p>
                    <p className="upper-profile-section-details-phone-adress">Phone</p>
                    <p>+216 {user.tel}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-body-section-main">
              <div className="profile-section-title">
                <div>
                  <span>Address</span>
                </div>
                <div>
                  <div className="button profile-edit-button" onClick={() => null}><AiFillEdit /></div>
                </div>
              </div>
              <div className="profile-body-section">
                <div className="profile-body-section-info">
                  <div className="col">
                    <p className="upper-profile-section-details-phone-adress">Country</p>
                    <p>{user.country}</p>
                  </div>
                  <div className="col col-lg-7">
                    <p className="upper-profile-section-details-phone-adress">City</p>
                    <p>{user.city}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {
            /*
             <div className="profile-body-section">
              <div className="col-lg-8">
                <div>
                  {user.type === "individual" ? (
                    <div><p><FaHome /><strong> Type: </strong>Individuelle</p></div>
                  ) : (<div><p><FaBuilding /><strong> Type: </strong>Entreprise</p></div>)}
                  <p><FaPhoneAlt /><strong> Telephone:</strong> +216 {user.tel}</p>
                  <p><FaEnvelope /><strong> E-mail:</strong> {user.email} </p>
                  <p><FaMapMarkerAlt /><strong> Région:</strong> {user.country} </p>
                  <p><FaCity /><strong> Ville:</strong> {user.city}</p>
                  <p><FaMapMarkerAlt /><strong> Rejoint à:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  {user.state ? (
                    <p className="d-flex flex-row"><FaUser /><strong> Status:</strong><p className="text text-success"> Compte activé                    </p></p>
                  ) : (<div>
                    <p><FaUser /><strong> Status:</strong> Compte non activé</p>
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleSendVerification(user._id, user.email)}
                    >Demande de vérification</button>
                    {isLoading && (
                      <div className="loading-block">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    )}
                    {message && <p className="text text-success">{message}</p>}
                  </div>)}
                </div>
              </div>
            </div>
            */
            }

          </div>
        </div>
      ) : (null)}
    </div>
  )
}

export default Profile;