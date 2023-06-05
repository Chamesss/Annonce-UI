import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import './css/CreateAccountPage.css';
import { FaUpload } from "react-icons/fa";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from 'react-router-dom';


const CreateAccountPage = () => {
  const [file, setFile] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [locations, setLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    tel: '',
    email: '',
    password: '',
    type: 'individual',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchToken();
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (message) {
        // Wait for 5 seconds before navigating to another page
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
        const response = await fetch('http://localhost:8080/protected', {
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

  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8080/location/get", {
        method: "GET",
      });
      const data = await response.json();
      const { locations: locations } = data;
      setLocation(locations);
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // Filter the locations based on the search term
    const filteredLocations = locations.filter(
      (location) =>
        location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
        location.city.toLowerCase().includes(value.toLowerCase())
    );
    const limitedSuggestions = filteredLocations.slice(0, 6);
    setSuggestions(limitedSuggestions);
  };

  const handleLocationSelect = (event, locationId, city, country) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedLocationId(locationId);
    setError('');
    let place = country + ', ' + city;
    setSearchTerm(place);
    setSuggestions([]);
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
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
  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      setError("Please select a valid location");
      return
    }
    try {
      const data = new FormData();
      data.append('firstname', formData.firstname);
      data.append('lastname', formData.lastname);
      data.append('tel', formData.tel);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('type', formData.type);
      data.append('file', file);
      console.log('aaa', formData);
      const response = await fetch(`http://localhost:8080/user/register/${selectedLocationId}`, {
        method: "POST",
        body: data
      });
      const innerData = await response.json();
      if (innerData.status === true) {
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
      <div className="header">
        <Header />
      </div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 mt-1">
            <h2 className="mb-4">Create Account:</h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="profile-picture border border-2 rounded-circle shadow-lg p-3 mb-1 bg-white rounded" style={{ width: '150px', height: '150px', position: 'relative', overflow: 'hidden' }}>
                    {selectedImage ? (
                      <img src={selectedImage} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                    )}
                    <input type="file" id="picture" name="picture" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <label htmlFor="picture" className="upload-button container" style={{ backgroundColor: 'grey', width: '100%', height: '30px', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                      <FaUpload style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstname" className="form-label">First Name:</label>
                  <input type="text" id="firstname" name="firstname" className="form-control" value={formData.firstname} onChange={handleChange} required />
                  <div className="invalid-feedback">Please enter your first name.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastname" className="form-label">Last Name:</label>
                  <input type="text" id="lastname" name="lastname" className="form-control" value={formData.lastname} onChange={handleChange} required />
                  <div className="invalid-feedback">Please enter your last name.</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="tel" className="form-label">Telephone:</label>
                  <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        id="telPrefix"
                                        name="telPrefix"
                                        value="+216"
                                        readOnly // Make the prefix input field read-only
                                        style={{ width: '70px' }} // Adjust the width as needed
                                        class="form-control"
                                    />
                                    <input
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        onChange={handleChange}
                                        class="form-control"
                                        required
                                    />
                                </div>
                  <div className="invalid-feedback">Please enter a valid telephone number.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                  <div className="invalid-feedback">Please enter a password.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="type" className="form-label">Account Type:</label>
                  <select id="type" name="type" className="form-select" value={formData.type} onChange={handleChange} required>
                    <option value="">Select account type</option>
                    <option value="individual">Individual</option>
                    <option value="entreprise">Entreprise</option>
                  </select>
                  <div className="invalid-feedback">Please select an account type.</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="location" className="form-label">Location:</label>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Enter an address"
                  />
                  {suggestions.length > 0 && (
                    <ul>
                      {suggestions.map((location, index) => (
                        <li
                          key={index}
                          onClick={(event) => handleLocationSelect(event, location._id, location.city, location.admin_name)}
                          style={{ cursor: 'pointer' }}
                        >
                          {location.admin_name}, {location.city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {message && <div className="text-success mb-3">{message}</div>}
              <div id="errorMessageContainer" className="text-danger my-3"></div>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </form>
          </div>
          <div className="col-lg-6">
            <img src="https://res.cloudinary.com/dncjxhygd/image/upload/v1685622911/igo8dhxcvtsfbc1ofpfd.jpg" style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </div>
      <div class="mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default CreateAccountPage;