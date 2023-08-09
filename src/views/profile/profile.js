import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaUpload } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineX } from "react-icons/hi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import PulseLoader from "react-spinners/PulseLoader";
import Select from 'react-select';
import { AiFillEdit } from 'react-icons/ai';
import './css/Profile.css';

/* eslint-disable react-hooks/exhaustive-deps */

function Profile({ userinfo }) {
  const [user, setUser] = useState(userinfo);
  const [showformgeneralinfo, setShowformGeneralInfo] = useState(false);
  const [showformPersonalinformation, setShowformPersonalinformation] = useState(false);
  const [showformSecurity, setShowformSecurity] = useState(false);
  const [showformAddress, setShowformAddress] = useState(false);
  const [showdeletemodal, setShowDeleteModel] = useState(false);
  const [image, setPicture] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [number, setNumber] = useState(user.tel);
  const [type, setType] = useState(user.type);
  const [password, setPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(false);
  const [isLoadingThird, setIsLoadingThird] = useState(false);
  const [isLoadingForth, setIsLoadingForth] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  const [error, setError] = useState('');
  const [sentEmail, setSent] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => { setPasswordVisible(!passwordVisible); };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [error]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (deleted) {
      setTimeout(() => { navigate('/'); }, 2500);
    }
  }, [deleted]);

  const handleSendVerification = async (userid, email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://annonce-backend.azurewebsites.net/user/send/${email}/${userid}`, {
        method: "GET"
      })
      const data = await response.json();
      if (data.status === true) {
        setSent(true);
      }
    } catch (error) {
      console.log(error);
    }

  }

  const modifyGeneralInfo = () => {
    if (!showformgeneralinfo) {
      setIsLoading(true);
      const formsToHide = [setShowformAddress, setShowformPersonalinformation, setShowformSecurity];
      formsToHide.forEach(formSetter => formSetter(false));
      setIsLoading(false);
    } else {
      setSelectedImage('');
      setPicture();
    }
    setShowformGeneralInfo(!showformgeneralinfo);
  }

  const modifyPersonalInfo = () => {
    if (!showformPersonalinformation) {
      setIsLoadingSecond(true);
      const formsToHide = [setShowformGeneralInfo, setShowformAddress, setShowformSecurity];
      formsToHide.forEach(formSetter => formSetter(false));
      setIsLoadingSecond(false);
    } else {
      const userValues = [user.firstname, user.lastname, user.email, user.tel, user.type];
      const inputSetters = [setFirstname, setLastname, setEmail, setNumber, setType];
      inputSetters.forEach((clean, index) => clean(userValues[index]));
    }
    setShowformPersonalinformation(!showformPersonalinformation);
  }

  const modifySecurity = () => {
    if (!showformSecurity) {
      setIsLoadingThird(true);
      const formsToHide = [setShowformGeneralInfo, setShowformPersonalinformation, setShowformAddress];
      formsToHide.forEach(show => show(false));
      setSecurityChecked(true);
      setIsLoadingThird(false);
    } else {
      const PasswordCleaner = [setPassword, setNewPassword, setConfirmPassword];
      PasswordCleaner.forEach(clean => clean(''));
      setSecurityChecked(false);
    }
    setShowformSecurity(!showformSecurity);
  }

  const modifyAddress = () => {
    if (!showformAddress) {
      setIsLoadingForth(true);
      const formsToHide = [setShowformGeneralInfo, setShowformPersonalinformation, setShowformSecurity];
      formsToHide.forEach(formSetter => formSetter(false));
      setIsLoadingForth(false);
    } else {
      defineLocation(locations);
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

  const fetchPlaces = async () => {
    try {
      const response = await fetch("https://annonce-backend.azurewebsites.net/location/get", {
        method: "GET",
      });
      const data = await response.json();
      const locations = data.locations;
      setLocations(locations);
      defineLocation(locations);
    } catch (error) {
      console.log(error);
    }
  }

  const defineLocation = (locations) => {
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

  const handleShowModal = (event) => {
    event.preventDefault();
    setShowDeleteModel(true);
  };
  const handleHideModal = () => {
    setShowDeleteModel(false);
  };

  const handleDeleteUser = async (event, password) => {
    setShowDeleteModel(false);
    event.preventDefault();
    try {
      const response = await fetch(`https://annonce-backend.azurewebsites.net/user/deleteuser/${user._id}`, {
        method: "DELETE",
        headers: { password: password }
      });
      const data = await response.json();
      if (data.status === true) {
        localStorage.removeItem("token");
        setDeleted(true);
      } else {
        if (data.status === false) {
          console.log('an error has happened');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (showformgeneralinfo) {
        setIsLoading(true);
      }
      if (showformPersonalinformation) {
        setIsLoadingSecond(true);
      }
      if (showformSecurity) {
        setIsLoadingThird(true);
      }
      if (showformAddress) {
        setIsLoadingForth(true);
      }
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("oldPassword", password);
      formData.append("newPassword", newpassword);
      formData.append("tel", number);
      formData.append("type", type);
      if (securityChecked) {
        if (password == null) {
          setError("Veuillez entrer le mot de passe");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (newpassword !== null && newpassword !== ' ' && newpassword.length > 0) {
          if (!newpassword || newpassword.length < 6) {
            setError("Invalid password length (minimum 6 characters)");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (newpassword !== confirmpassword) {
            setError("New passwords do not match");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
        formData.append("uncheck", true);
      } else {
        formData.append("uncheck", false);
      }
      formData.append("file", image);
      const response = await fetch(`https://annonce-backend.azurewebsites.net/user/edituser/${user._id}/${selectedLocationId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();
      if (data.success === true) {
        try {
          const innerResponse = await fetch(`https://annonce-backend.azurewebsites.net/user/getuserdetails`, {
            method: "GET",
            headers: { id: user._id }
          });
          const innerData = await innerResponse.json();
          if (innerData.status === true) {
            setUser(innerData.user);
          }
        } catch (error) {
          console.log(error);
        }
        const formsToHide = [setShowformGeneralInfo, setShowformAddress, setShowformPersonalinformation, setShowformSecurity,
          setIsLoading, setIsLoadingSecond, setIsLoadingThird, setIsLoadingForth];
        formsToHide.forEach(formSetter => formSetter(false));
      } else {
        const formsToHide = [setShowformGeneralInfo, setShowformAddress, setShowformPersonalinformation, setShowformSecurity,
          setIsLoading, setIsLoadingSecond, setIsLoadingThird, setIsLoadingForth];
        formsToHide.forEach(formSetter => formSetter(false));
        setError("An error occurred while updating profile, please come back later");
      }
    } catch (error) {
      const formsToHide = [setShowformGeneralInfo, setShowformAddress, setShowformPersonalinformation, setShowformSecurity,
        setIsLoading, setIsLoadingSecond, setIsLoadingThird, setIsLoadingForth];
      formsToHide.forEach(formSetter => formSetter(false));
      setError("An error occurred while updating profile, please come back later");
    }
  };

  return (
    <div className="profile-section-main">
      {user && (
        <div>

          {/* General info Section */}

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
              <div className="profile-section-title">
                <div>
                  <span>General information</span>
                </div>
                {isLoading ? (
                  null
                ) : (
                  showformgeneralinfo ? (
                    <div className="d-flex flex-row gap-2">
                      <div>
                        <div className="button profile-cancel-button" onClick={modifyGeneralInfo}><HiOutlineX /></div>
                      </div>
                      <div>
                        <div className="button profile-confirm-button" onClick={(event) => handleSubmit(event)}><IoMdCheckmark /></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="button profile-edit-button" onClick={modifyGeneralInfo}><AiFillEdit /></div>
                    </div>
                  )
                )}

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
                {isLoadingSecond ? (
                  null
                ) : (
                  showformPersonalinformation ? (
                    <div className="d-flex flex-row gap-2">
                      <div>
                        <div className="button profile-cancel-button" onClick={modifyPersonalInfo}><HiOutlineX /></div>
                      </div>
                      <div>
                        <div className="button profile-confirm-button" onClick={(event) => handleSubmit(event)}><IoMdCheckmark /></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="button profile-edit-button" onClick={modifyPersonalInfo}><AiFillEdit /></div>
                    </div>
                  ))}
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
                              onChange={(e) => setFirstname(e.target.value)} />
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
                              onChange={(e) => setLastname(e.target.value)} />
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
                              onChange={(e) => setNumber(e.target.value)} />
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
                                onChange={(e) => setNumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="profile-type-section">
                          <p className="upper-profile-section-details-phone-adress">Type</p>
                          <select id="type" name="type" className="input-form" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Account type</option>
                            <option value="Individual">Individual</option>
                            <option value="entreprise">Entreprise</option>
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

          {/* Security Section */}

          <div className="profile-body-section-main">
            <div style={{ padding: "5px" }}>
              <div className="profile-section-title">
                <div>
                  <span>Security</span>
                </div>
                {isLoadingThird ? (
                  null
                ) : (
                  showformSecurity ? (
                    <div className="d-flex flex-row gap-2">
                      <div>
                        <div className="button profile-cancel-button" onClick={modifySecurity}><HiOutlineX /></div>
                      </div>
                      <div>
                        <div className="button profile-confirm-button" onClick={(event) => handleSubmit(event)}><IoMdCheckmark /></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="button profile-edit-button" onClick={modifySecurity}><AiFillEdit /></div>
                    </div>
                  )
                )}
              </div>
              {isLoadingThird ? (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <PulseLoader color="hsl(12, 88%, 59%)" />
                </div>
              ) : (
                showformSecurity ? (
                  <div>
                    <div className="profile-name-section d-flex row-reverse">
                      <div className="profile-row-section second-section">
                        <p className="upper-profile-section-details-phone-adress">Account Status</p>
                        {user.state ? (
                          <>
                            <p>Active</p>
                          </>
                        ) : (
                          <>
                            <p>Not Active ( {sentEmail ? (
                              <span className="upper-profile-section-details-phone-adress d-inline"> Confirmation link has been sent! </span>
                            ) : (
                              <span className="upper-profile-section-details-phone-adress profile-link-confirm-account" onClick={() => handleSendVerification(user._id, user.email)}> Request a confirmation link </span>
                            )})</p>

                          </>
                        )}
                      </div>
                      <div className="profile-row-section first-section">
                        <p className="upper-profile-section-details-phone-adress">Old Password</p>
                        <div className="input-container d-flex flex-row justify-content-start align-items-center">
                          <input
                            className="profile-password-input"
                            type={passwordVisible ? 'text' : 'password'}
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <span
                            className="eye-icon"
                            style={{ cursor: "pointer" }}
                            onClick={togglePasswordVisibility}
                          >
                            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">New Password</p>
                    </div>
                    <div className="input-container d-flex flex-row justify-content-start align-items-center">
                      <input
                        className="profile-password-input"
                        type={passwordVisible ? 'text' : 'password'}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        className="eye-icon"
                        style={{ cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                      </span>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress">Confirm New Password</p>
                    </div>
                    <div className="input-container d-flex flex-row justify-content-start align-items-center">
                      <input
                        className="profile-password-input"
                        type={passwordVisible ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className="eye-icon"
                        style={{ cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                      </span>
                    </div>
                    <div className="profile-row-section">
                      <p className="upper-profile-section-details-phone-adress profile-delete-account mt-4" onClick={handleShowModal}>Delete Account</p>
                    </div>
                  </div>
                ) : (
                  <div className="profile-body-section">
                    <div className="profile-body-section-info">
                      <div className="profile-name-section">
                        <div className="profile-row-section">
                          <p className="upper-profile-section-details-phone-adress">Password</p>
                          <p>******</p>
                        </div>
                        <div className="profile-row-section">
                          <p className="upper-profile-section-details-phone-adress">Account Status</p>
                          {user.state ? (
                            <>
                              <p>Active</p>
                            </>
                          ) : (
                            <>
                              <p>Not Active</p>
                            </>
                          )}
                        </div>
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
                {isLoadingForth ? (
                  null
                ) : (
                  showformAddress ? (
                    <div className="d-flex flex-row gap-2">
                      <div>
                        <div className="button profile-cancel-button" onClick={modifyAddress}><HiOutlineX /></div>
                      </div>
                      <div>
                        <div className="button profile-confirm-button" onClick={(event) => handleSubmit(event)}><IoMdCheckmark /></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="button profile-edit-button" onClick={modifyAddress}><AiFillEdit /></div>
                    </div>
                  )
                )}
              </div>
              {isLoadingForth ? (
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
          {error && (<p className="d-flex justify-content-center text-danger" style={{ marginTop: "10px" }}>{error}</p>)}

          {/* Delete Account Modal */}

          {showdeletemodal && (
            <Modal show={showdeletemodal} onHide={handleHideModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete your profile?</p>
                <p>Enter the password to confirm.</p>
                <div className="input-container d-flex flex-row justify-content-start align-items-center">
                  <input
                    className="profile-password-input"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="eye-icon"
                    style={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                  </span>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleHideModal}>
                  Annuler
                </Button>
                <Button variant="danger" onClick={(e) => handleDeleteUser(e, password)}>
                  Yes, delete
                </Button>
              </Modal.Footer>
            </Modal>
          )}

        </div>
      )}
    </div >
  )
}

export default Profile;