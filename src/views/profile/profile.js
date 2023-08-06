import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaUpload } from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";

//import {FaCity, FaHome, FaBuilding, FaEnvelope, FaUser } from "react-icons/fa";

// import { Spinner } from 'react-bootstrap';
import { AiFillEdit } from 'react-icons/ai';
import './css/Profile.css';

function Profile({ userinfo }) {
  const [user] = useState(userinfo);
  const [showformgeneralinfo, setShowformGeneralInfo] = useState(false);
  const [image, setPicture] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  console.log(image);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // If isLoading is true, show the loading animation for 1 second
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);

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

  const modifyGeneralInfo = () => {
    if (!showformgeneralinfo) {
      setIsLoading(true);
    } else {
      setSelectedImage('');
    }
    setShowformGeneralInfo(!showformgeneralinfo);
  }

  const handleImageChange = (e) => {
    setPicture(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-section-main">
      {user !== null ? (
        <div>

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
              <div className="profile-section-title">
                <div>
                  <span>General info</span>
                </div>
                <div>
                  <div className="button profile-edit-button" onClick={modifyGeneralInfo}><AiFillEdit /></div>
                </div>
              </div>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <PulseLoader color="hsl(12, 88%, 59%)" />
                </div>
              ) : (
                showformgeneralinfo ? (
                  <div>
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="profile-picture border border-2 rounded-circle shadow-lg bg-white rounded" style={{ width: '150px', height: '150px', position: 'relative', overflow: 'hidden' }}>
                          {selectedImage ? (
                            <img src={selectedImage} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <img src={user.picture} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                          )}
                          <input type="file" id="picture" name="picture" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                          <label htmlFor="picture" className="upload-button container" style={{cursor:"pointer", backgroundColor: 'grey', width: '100%', height: '30px', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                            <FaUpload style={{cursor:"pointer", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                          </label>
                        </div>
                        <p style={{marginTop:"20px", fontWeight:"500"}}>Upload new picture</p>
                    </div>
                  </div>
                ) : (
                  <div className="upper-profile-body-section pb-2">
                    <div className="upper-profile-body-section-info">
                      <div style={{ maxWidth: '80px', maxHeight: '80px' }}>
                        <img src={user.picture} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div className="upper-profile-section-details">
                        <span className="upper-profile-section-details-name">{user.firstname} {user.lastname}</span>
                        <span className="upper-profile-section-details-phone-adress"><FaPhoneAlt />&nbsp; +216 {user.tel}</span>
                        <span className="upper-profile-section-details-phone-adress"><FaMapMarkerAlt />&nbsp; {user.country}, {user.city}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>



          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
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
                  <div className="profile-name-section">
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">First Name</p>
                      <p>{user.firstname}</p>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">Last Name</p>
                      <p>{user.lastname}</p>
                    </div>
                  </div>
                  <div className="profile-name-section">
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">Email address</p>
                      <p>{user.email}</p>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">Phone</p>
                      <p>+216 {user.tel}</p>
                    </div>
                  </div>
                  <div className="profile-type-section">
                    <p className="upper-profile-section-details-phone-adress">Type</p>
                    <p>{user.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
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
                  <div className="profile-name-section">
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">Country</p>
                      <p>{user.country}</p>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">City</p>
                      <p>{user.city}</p>
                    </div>
                  </div>
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
      ) : (null)}
    </div>
  )
}

export default Profile;