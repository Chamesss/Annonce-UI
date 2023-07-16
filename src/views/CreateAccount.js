import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Spinner } from 'react-bootstrap';
import './css/CreateAccountPage.css';
import { FaUpload } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

/* eslint-disable react-hooks/exhaustive-deps */

const CreateAccountPage = () => {
  const [file, setFile] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [locations, setLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordconfirm, setPasswordConfirm] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    tel: '',
    email: '',
    password: '',
    type: 'Individual',
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchToken();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        navigate('/login');
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [message]);

  const fetchToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('https://annonce-backend.azurewebsites.net/protected', {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json();
        if (data.status !== true) {
          localStorage.removeItem('token');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/location/get');
      const data = await response.json();
      setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (value) => {
    const filteredLocations = locations.filter(
      (location) =>
        location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
        location.city.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredLocations);
  };

  const options = suggestions.slice(0, 8).map((location) => ({
    id: `${location._id}`,
    value: `${location.admin_name}, ${location.city}`,
    label: `${location.admin_name}, ${location.city}`,
  }));

  const handleLocationSelect = (location) => {
    setSelectedLocationId(location.id);
    setLocation(location);
    setError('');
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    console.log("asba");
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.firstname.length < 3) {
      setError('Firstname must be longer than 3 characters');
      return
    }
    if (formData.lastname.length < 3) {
      setError('Lastname must be longer than 3 characters');
      return
    }
    if (!(/^\d{8}$/.test(formData.tel))) {
      setError('Tel must be 8 digits');
      return
    }
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      setError('Email must be in valid email format');
      return
    }
    if (formData.password !== passwordconfirm || formData.password.length < 5) {
      setError("Passwords doesnt match");
      return
    }
    if (!selectedLocationId) {
      setError("Please select a valid location");
      return
    }
    setIsLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('firstname', formData.firstname);
      data.append('lastname', formData.lastname);
      data.append('tel', formData.tel);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('type', formData.type);
      data.append('file', file);
      const response = await fetch(`https://annonce-backend.azurewebsites.net/user/register/${selectedLocationId}`, {
        method: "POST",
        body: data
      });
      const innerData = await response.json();
      if (innerData.status === true) {
        setIsLoading(false);
        setError('');
        setMessage("Account successfully created. Redirecting to login page ...")
      } else {
        const errorMessage = innerData.message || 'An error occurred.';
        const errorMessageContainer = document.getElementById('errorMessageContainer');
        errorMessageContainer.textContent = errorMessage;
      }
    } catch (error) {
      console.error('Failed to create account:', error.message);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="create-account-container">
        <div className="create-account-form">
          <div className="create-account">
            <p className="create-account-title">Create an account and join </p>
            <p className="create-account-title">our community  now!</p> 
            <div>
              <div>
                <div className="picture-container">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Profile" onClick={() => { document.getElementById('picture').click() }} className="inner-picture" />
                  ) : (
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" onClick={() => { document.getElementById('picture').click() }} className="inner-picture" />
                  )}
                  <input type="file" id="picture" name="picture" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  <FaUpload onClick={() => { document.getElementById('picture').click() }} className="upload-icon-create-account" />
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className="single-row">
                  <input type="text" id="firstname" placeholder="Firstname" name="firstname" className="form-control input-design fisrtname-input" value={formData.firstname} onChange={handleChange} required />
                  <input type="text" id="lastname" placeholder="Lastname" name="lastname" className="form-control input-design lastname-input" value={formData.lastname} onChange={handleChange} required />
                </div>
              </div>
              <div className="phone-number">
                <input
                  type="text"
                  id="telPrefix"
                  name="telPrefix"
                  value="+216"
                  readOnly
                  className="form-control phone-prefix"
                />
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  onChange={handleChange}
                  className="form-control phone-input"
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <input type="email" id="email" placeholder="Email" name="email" className="form-control input-design" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="single-row">
                <input type="password" id="password" placeholder="Password" name="password" className="form-control input-design password-input" value={formData.password} onChange={handleChange} required />
                <input type="password" id="passwordConfirm" placeholder="Confirm password" name="passwordConfirm" className="form-control input-design confirm-password-input" value={passwordconfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
              </div>
              <div>
                <select id="type" name="type" className="form-control input-design" value={formData.type} onChange={handleChange} required>
                  <option value="">Account type</option>
                  <option value="Individual">Individual</option>
                  <option value="Entreprise">Entreprise</option>
                </select>
              </div>
              <div>
                <div>
                  <Select
                    options={options}
                    value={location}
                    onChange={handleLocationSelect}
                    onInputChange={handleInputChange}
                    placeholder="Enter an address"
                    blurInputOnSelect={false}
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderRadius: "25px",
                        boxShadow: " 0 0 5px rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgb(202, 202, 202)",
                        marginTop: " 15px",
                      }),
                      '@media (max-width: 768px)': {
                        control: (provided) => ({
                          ...provided,
                          fontSize: "0.89rem",
                          height: " 30px",
                        }),
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {message && <div className="text-success mb-3">{message}</div>}
            {error && <div className="text-danger mb-3">{error}</div>}
            {isLoading && (
              <div>
                <Spinner animation="border" role="status">
                  <span>Loading...</span>
                </Spinner>
              </div>
            )}
            <div id="errorMessageContainer" className="text-danger"></div>
            <button type="submit" onClick={handleSubmit} className="button create-account-button">Create</button>
          </div>
        </div>
        <div className="create-account-banner-container">
          <img src="https://res.cloudinary.com/dncjxhygd/image/upload/v1688674159/o4jzvclhvb09qfzxyso2.png" alt="create-account-banner" className="create-account-banner" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateAccountPage;