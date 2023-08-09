import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Button, Modal } from 'react-bootstrap';
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import './css/Profile.css';

/* eslint-disable react-hooks/exhaustive-deps */

function EditProfile({ userinfo }) {
    const [user, setUser] = useState(userinfo);
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [image, setPicture] = useState();
    const [password, setPassword] = useState();
    const [showdeletemodal, setShowDeleteModel] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, []);

    useEffect(() => {
        if (deleted) {
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
            const timeout = setTimeout(() => {
                window.location.reload()
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [success]);

    const options = suggestions.slice(0, 8).map((location) => ({
        id: `${location._id}`,
        value: `${location.admin_name}, ${location.city}`,
        label: `${location.admin_name}, ${location.city}`,
    }));



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
            const response = await fetch("https://annonce-backend.azurewebsites.net/location/get", {
                method: "GET",
            });
            const data = await response.json();
            const locations = data;
            setLocations(locations);
            const selectedLocation = locations.find(
                (loc) =>
                    loc.city === userinfo.city
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
        setError('');
    };


    const handleConfirmPasswordChange = (e) => {
        setNewPasswordConfirm(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user.oldPassword == null) {
            setError("Veuillez entrer le mot de passe");

            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (user.newPassword !== null && user.newPassword !== ' ' && user.newPassword.length > 0) {
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


            const response = await fetch(`https://annonce-backend.azurewebsites.net/user/edituser/${user._id}/${selectedLocationId}`, {
                method: "PATCH",
                body: formData,
            });
            const data = await response.json();
            if (data.success === true) {
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
                <h2 className="text-center mb-4">Editer le profil</h2>
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
                                <Label htmlFor="firstname">Prénom:</Label>
                                <Input type="text" id="firstname" name="firstname" value={user.firstname} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="lastname">Nom:</Label>
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
                                    <option value="Individual">Individuelle</option>
                                    <option value="Entreprise">Entreprise</option>
                                </Input>
                            </FormGroup>
                        </div>
                    </div>

                    {/* Location and Telephone */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <div>
                                    <Label htmlFor="location">Location:</Label>
                                    <Select
                                        options={options}
                                        value={location}
                                        onChange={handleLocationSelect}
                                        onInputChange={handleInputChange}
                                        placeholder="Enter an address"
                                        blurInputOnSelect={false}
                                    />
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
                                <Label htmlFor="oldPassword">Mot de passe:</Label>
                                <Input type="password" id="oldPassword" name="oldPassword" onChange={handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    {/* New Password and Confirm New Password */}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="newPassword">Nouveau mot de passe:</Label>
                                <Input type="password" id="newPassword" name="newPassword" value={user.newPassword} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label htmlFor="confirmNewPassword">Confirmez Nouveau mot de passe:</Label>
                                <Input type="password" id="confirmNewPassword" name="confirmNewPassword" value={newPasswordConfirm} onChange={handleConfirmPasswordChange} />
                            </FormGroup>
                        </div>
                    </div>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button class="button" type="primary" variant="primary" onClick={handleSubmit}>
                            Enregistrer le profil
                        </button>
                        <button class="btn btn-danger" type="delete" variant="danger" onClick={handleShowModal}>
                            Supprimer le profil
                        </button>
                    </div>
                    {success && <div className="text-success mb-3">Mise à jour du profil réussie</div>}
                    {deleted && <div className="text-success mb-3">Profil supprimé avec succès.. À bientôt !..</div>}
                </Form >
            </div >
            {showdeletemodal && (
                <Modal show={showdeletemodal} onHide={handleHideModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Êtes-vous sûr de vouloir supprimer votre profil?</p>
                        <p>Entrez le mot de passe pour confirmer</p>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            className="input-form"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHideModal}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={(e) => handleDeleteUser(e, password)}>
                            Oui, Supprimé
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
            }
        </div >
    );
}

export default EditProfile;