import React, { useState, useEffect, useRef } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Button, Modal } from 'react-bootstrap';
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EditProfile({ userinfo }) {
    const [user, setUser] = useState(userinfo);
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [locations, setLocation] = useState([]);
    const [searchTerm, setSearchTerm] = useState(`${userinfo.country}, ${userinfo.city}`);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [image, setPicture] = useState();
    const [password, setPassword] = useState();
    const [showdeletemodal, setShowDeleteModel] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef();

    useEffect(() => {
        fetchPlaces();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (deleted) {
            // Wait for 5 seconds before navigating to another page
            const timeout = setTimeout(() => {
                navigate('/');
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [deleted]);

    useEffect(() => {
        if (success) {
            // Wait for 5 seconds before navigating to another page
            const timeout = setTimeout(() => {
                window.location.reload()
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [success]);



    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

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
        let place = country + ', ' + city;
        setSearchTerm(place);
        setSuggestions([]);
    };


    const handleConfirmPasswordChange = (e) => {
        setNewPasswordConfirm(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation checks
        if (user.oldPassword == null) {
            setError("Please enter password");

            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (user.newPassword != null && user.newPassword != ' ' && user.newPassword.length > 0) {
            console.log('ahawa', user.newPassword)
            if (!user.newPassword || user.newPassword.length < 6) {
                setError("Invalid password length (minimum 6 characters)");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            if (user.newPassword !== newPasswordConfirm) {
                setError("New passwords do not match");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }



        // Make API call to update user profile
        try {
            const formData = new FormData();
            formData.append("firstname", user.firstname);
            formData.append("lastname", user.lastname);
            formData.append("email", user.email);
            formData.append("oldPassword", user.oldPassword);
            formData.append("newPassword", user.newPassword);
            formData.append("tel", user.tel);
            formData.append("type", user.type);
            formData.append("uncheck", false);
            formData.append("file", image);
            console.log('file', image)

            const response = await fetch(`http://localhost:8080/user/edituser/${user._id}/${selectedLocationId}`, {
                method: "PATCH",
                body: formData,
            });
            const data = await response.json();
            if (data.success == true) {
                setSuccess(true);
            } else {
                console.log(data.error);
                setError(data.error);
            }
        } catch (error) {
            setError("An error occurred while updating profile");
        }
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
            const response = await fetch(`http://localhost:8080/user/deleteuser/${user._id}`, {
                method: "DELETE",
                headers: {password: password}
            });
            const data = await response.json();
            if (data.status === true) {
                localStorage.removeItem("token");
                setDeleted(true);
            } else {
                if (data.status === false) {
                    setError(data.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="row">
                <h2 className="text-center mb-4">Edit Profile</h2>
                <Form>


                    {/* Profile Picture */}
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <FormGroup>
                                <Label htmlFor="namepicture"></Label>
                                <div className="profile-picture border border-2 rounded-circle shadow-lg p-3 mb-1 bg-white rounded" style={{ width: '150px', height: '150px', position: 'relative', overflow: 'hidden' }}>
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <img src={user.picture} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
                                    )}
                                    <input type="file" id="picture" name="picture" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    <label htmlFor="picture" className="upload-button container" style={{ backgroundColor: 'grey', width: '100%', height: '30px', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                                        <FaUpload style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                    </label>
                                </div>
                            </FormGroup>
                        </div>
                    </div>

                    {/* First Name and Last Name */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="firstname">First Name:</Label>
                                <Input type="text" id="firstname" name="firstname" value={user.firstname} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="lastname">Last Name:</Label>
                                <Input type="text" id="lastname" name="lastname" value={user.lastname} onChange={handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    {/* Email and Type */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="email">Email:</Label>
                                <Input type="email" id="email" name="email" value={user.email} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="type">Type:</Label>
                                <Input type="select" id="type" name="type" value={user.type} onChange={handleChange}>
                                    <option value="">Select Type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Entreprise">Entreprise</option>
                                </Input>
                            </FormGroup>
                        </div>
                    </div>

                    {/* Location and Telephone */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <div ref={inputRef}>
                                    <Label htmlFor="location">Location:</Label>
                                    <Input
                                        type="text"
                                        defaultValue={user.country}
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        placeholder="Enter an address"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul>
                                            {suggestions.map((location, index) => (
                                                <li
                                                    key={index}
                                                    onClick={(event) =>
                                                        handleLocationSelect(
                                                            event,
                                                            location._id,
                                                            location.city,
                                                            location.admin_name
                                                        )
                                                    }
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {location.admin_name}, {location.city}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="tel">Telephone:</Label>
                                <div className="d-flex align-items-center">
                                    <Input
                                        type="text"
                                        id="telPrefix"
                                        name="telPrefix"
                                        value="+216"
                                        readOnly // Make the prefix input field read-only
                                        style={{ width: '70px' }} // Adjust the width as needed
                                    />
                                    <Input
                                        type="tel"
                                        id="telNumber"
                                        name="telNumber"
                                        value={user.tel}
                                        onChange={handleChange}
                                    />
                                </div>
                            </FormGroup>
                        </div>
                    </div>

                    {/* Old Password */}
                    <div className="row">
                        <div className="col-md-12">
                            <FormGroup>
                                <Label htmlFor="oldPassword">Old Password:</Label>
                                <Input type="password" id="oldPassword" name="oldPassword" onChange={handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    {/* New Password and Confirm New Password */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="newPassword">New Password:</Label>
                                <Input type="password" id="newPassword" name="newPassword" value={user.newPassword} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="confirmNewPassword">Confirm New Password:</Label>
                                <Input type="password" id="confirmNewPassword" name="confirmNewPassword" value={newPasswordConfirm} onChange={handleConfirmPasswordChange} />
                            </FormGroup>
                        </div>
                    </div>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button class="btn btn-primary" type="primary" variant="primary" onClick={handleSubmit}>
                            Save Profile
                        </button>
                        <button class="btn btn-danger" type="delete" variant="danger" onClick={handleShowModal}>
                            Delete Profile
                        </button>
                    </div>
                    {success && <div className="text-success mb-3">Profile updated successfully</div>}
                    {deleted && <div className="text-success mb-3">Profile deleted successfully.. See you soon..</div>}
                </Form>
            </div>
            {showdeletemodal && (
                <Modal show={showdeletemodal} onHide={handleHideModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete your profile?</p>
                        <p>Enter password to confirm</p>
                        <input 
                        type="password"
                        id="Password" 
                        name="Password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHideModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={(e) => handleDeleteUser(e,password) }>
                            Yes, Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default EditProfile;