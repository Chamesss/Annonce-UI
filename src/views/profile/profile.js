import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaUpload } from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";
import Select from 'react-select';

//import {FaCity, FaHome, FaBuilding, FaEnvelope, FaUser } from "react-icons/fa";

// import { Spinner } from 'react-bootstrap';
import { AiFillEdit } from 'react-icons/ai';
import './css/Profile.css';

/* eslint-disable react-hooks/exhaustive-deps */

function Profile({ userinfo }) {
  const [user] = useState(userinfo);
  const [showformgeneralinfo, setShowformGeneralInfo] = useState(false);
  const [showformPersonalinformation, setShowformPersonalinformation] = useState(false);
  const [showformAddress, setShowformAddress] = useState(false);
  const [image, setPicture] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [number, setNumber] = useState(user.tel);
  const [type, setType] = useState(user.type);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(false);
  const [isLoadingThird, setIsLoadingThird] = useState(false);

  // const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  console.log(image);
  console.log(selectedLocationId);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => { setIsLoading(false); }, 500);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingSecond) {
      setTimeout(() => { setIsLoadingSecond(false); }, 500);
    }
  }, [isLoadingSecond]);

  useEffect(() => {
    if (isLoadingThird) {
      setTimeout(() => { setIsLoadingThird(false); }, 500);
    }
  }, [isLoadingThird]);

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

  const modifyPersonalInfo = () => {
    if (!showformPersonalinformation) {
      setIsLoadingSecond(true);
    }
    setShowformPersonalinformation(!showformPersonalinformation);
  }

  const modifyAddress = () => {
    if (!showformAddress) {
      setIsLoadingThird(true);
    }
    setShowformAddress(!showformAddress);
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





  const handleChangeFirstname = (e) => {
    setFirstname(e.target.value);
  };
  const handleChangeLastname = (e) => {
    setLastname(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeNumber = (e) => {
    setNumber(e.target.value);
  };
  const handleChangeType = (e) => {
    setType(e.target.value);
  };




  const fetchPlaces = async () => {
    try {
      const response = await fetch("https://annonce-backend.azurewebsites.net/location/get", {
        method: "GET",
      });
      const data = await response.json();
      const locations = data.locations;
      setLocations(locations);
      const selectedLocation = locations.find(
        (loc) =>
          loc.city === user.city
      );

      if (selectedLocation) {
        const defaultLocation = {
          id: selectedLocation._id,
          value: `${selectedLocation.admin_name}, ${selectedLocation.city}`,
          label: `${selectedLocation.admin_name}, ${selectedLocation.city}`,
        };
        setSelectedLocationId(selectedLocation._id);
        setLocation(defaultLocation);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const options = suggestions.slice(0, 8).map((location) => ({
    id: `${location._id}`,
    value: `${location.admin_name}, ${location.city}`,
    label: `${location.admin_name}, ${location.city}`,
  }));

  const handleInputChange = (value) => {
    const filteredLocations = locations.filter(
      (location) =>
        location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
        location.city.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredLocations);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocationId(location.id);
    setLocation(location);
  };



  return (
    <div className="profile-section-main">
      {user !== null ? (
        <div>

          {/* General info Section */}

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
                        <label htmlFor="picture" className="upload-button container" style={{ cursor: "pointer", backgroundColor: 'grey', width: '100%', height: '30px', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                          <FaUpload style={{ cursor: "pointer", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </label>
                      </div>
                      <p style={{ marginTop: "20px", fontWeight: "500" }}>Upload new picture</p>
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

          {/* Personal information Section */}

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
              <div className="profile-section-title">
                <div>
                  <span>Personal information</span>
                </div>
                <div>
                  <div className="button profile-edit-button" onClick={modifyPersonalInfo}><AiFillEdit /></div>
                </div>
              </div>
              {isLoadingSecond ? (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <PulseLoader color="hsl(12, 88%, 59%)" />
                </div>
              ) : (
                showformPersonalinformation ? (
                  <div>
                    <div className="profile-body-section">
                      <div className="profile-body-section-info">
                        <div className="profile-name-section">
                          <div className="profile-row-section">
                            <p className="upper-profile-section-details-phone-adress">First Name</p>
                            <input
                              type="text"
                              id="firstname"
                              placeholder="Firstname"
                              name="firstname"
                              className="input-form profile-input"
                              value={firstname}
                              onChange={handleChangeFirstname} />
                          </div>
                          <div className="profile-row-section">
                            <p className="upper-profile-section-details-phone-adress">Last Name</p>
                            <input
                              type="text"
                              id="lastname"
                              placeholder="Lastname"
                              name="Lastname"
                              className="input-form profile-input"
                              value={lastname}
                              onChange={handleChangeLastname} />
                          </div>
                        </div>
                        <div className="profile-name-section">
                          <div className="profile-row-section">
                            <p className="upper-profile-section-details-phone-adress">Email address</p>
                            <input
                              type="text"
                              id="email"
                              placeholder="Email"
                              name="email"
                              className="input-form profile-input"
                              value={email}
                              onChange={handleChangeEmail} />
                          </div>
                          <div className="profile-row-section">
                            <p className="upper-profile-section-details-phone-adress">Phone</p>
                            <div className="d-flex flex-row">
                              <input
                                type="text"
                                id="telPrefix"
                                name="telPrefix"
                                value="+216"
                                readOnly
                                style={{ width: "16%" }}
                                className="input-form phone-prefix"
                              />
                              <input
                                type="tel"
                                id="tel"
                                name="tel"
                                className="input-form phone-input profile-phone-input"
                                value={number}
                                onChange={handleChangeNumber}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="profile-type-section">
                          <p className="upper-profile-section-details-phone-adress">Type</p>
                          <select id="type" name="type" className="input-form" value={type} onChange={handleChangeType}>
                            <option value="">Account type</option>
                            <option value="Individual">Individual</option>
                            <option value="Entreprise">Entreprise</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )
              )}
            </div>
          </div>

          {/* Address Section */}

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
              <div className="profile-section-title">
                <div>
                  <span>Address</span>
                </div>
                <div>
                  <div className="button profile-edit-button" onClick={modifyAddress}><AiFillEdit /></div>
                </div>
              </div>
              {isLoadingThird ? (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <PulseLoader color="hsl(12, 88%, 59%)" />
                </div>
              ) : (
                showformAddress ? (
                  <div className="profile-row-section">
                    <p className="upper-profile-section-details-phone-adress">Change Location</p>
                    <div>
                      <Select
                        options={options}
                        value={location}
                        onChange={handleLocationSelect}
                        onInputChange={handleInputChange}
                        placeholder="Enter an address"
                        blurInputOnSelect={false}
                      />
                    </div>
                  </div>
                ) : (
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
                )
              )}
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