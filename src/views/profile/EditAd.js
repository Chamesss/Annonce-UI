import React, { useState, useEffect, useRef } from "react";
import { Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { Button, Modal } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";
import Select from 'react-select';

function EditAd({ ad }) {
    const [advertisement, setAdvertisement] = useState(ad);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(ad.categoryId);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(ad.subCategoryId);
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState([]);
    const [searchTerm, setSearchTerm] = useState(`${ad.country}, ${ad.city}`);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef();
    const mediaRecorderRef = useRef(null);
    const audioPlayerRef = useRef(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                window.location.href = '/profile/?section=' + encodeURIComponent('ads');
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [success]);

    useEffect(() => {
        setAdvertisement(ad);
    }, [ad]);

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
        const fetchCategories = async () => {
            try {
                const response = await axios.get("https://annonce-backend.azurewebsites.net/category/getall");
                setCategories(response.data.category);
                const foundCategory = response.data.category.find(category => category._id === ad.categoryId);
                setSubcategories(foundCategory ? foundCategory.subcategories : []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategories();
        fetchPlaces();
    }, []);

    const handleChange = (e) => {
        setAdvertisement({ ...advertisement, [e.target.name]: e.target.value });
    };

    const options = suggestions.slice(0, 8).map((location) => ({
        id: `${location._id}`,
        value: `${location.admin_name}, ${location.city}`,
        label: `${location.admin_name}, ${location.city}`,
    }));


    const fetchPlaces = async () => {
        try {
            const response = await fetch("https://annonce-backend.azurewebsites.net/location/get", {
                method: "GET",
            });
            const data = await response.json();
            const { locations: locations } = data;
            setLocations(locations);
            const selectedLocation = locations.find(
                (loc) =>
                    loc.city === ad.city
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
        setSearchTerm(value);
        // Filter the locations based on the search term
        const filteredLocations = locations.filter(
            (location) =>
                location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
                location.city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredLocations);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocationId(location.id);
        setSearchTerm(location);
        setLocation(location);
        setError('');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);

        const imagesPreview = [];
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onloadend = () => {
                imagesPreview.push(reader.result);
                if (imagesPreview.length === files.length) {
                    setSelectedImages(imagesPreview);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    };
    const handleRecord = async () => {
        if (!recording) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const chunks = [];

                const mediaRecorder = new MediaRecorder(mediaStream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                });

                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    setAudioBlob(audioBlob);
                });

                mediaRecorder.start();
                setRecording(true);
            } catch (error) {
                console.error('Error recording audio:', error);
            }
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleAudioChange = (event) => {
        const file = event.target.files[0];
        setAudioBlob(file);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory("");
        const selectedCategory = categories.find(category => category._id === e.target.value);
        setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedSubcategory) {
            setError("Please select a subcategory");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", advertisement.title);
            formData.append("price", advertisement.price);
            formData.append("description", advertisement.description);
            formData.append("category", selectedCategory);
            formData.append("subcategory", selectedSubcategory);
            formData.append("pictures", newImages);
            formData.append("vocal", advertisement.vocal);

            const response = await axios.patch(
                `https://annonce-backend.azurewebsites.net/ad/editad/${ad._id}/${selectedLocationId}`,
                formData
            );
            const data = response.data;
            if (data.success) {
                setSuccess(true);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            setError("An error occurred while updating the advertisement");
        }
    };

    const handleShowModal = () => {
        setShowDeleteModal(true);
    };

    const handleHideModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteAd = async () => {
        try {
            const response = await axios.delete(
                `https://annonce-backend.azurewebsites.net/ad/delete/${ad._id}`
            );
            const data = response.data;
            if (data.success) {
                setShowDeleteModal(false);
                setDeleted(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="row">
                <h2 className="text-center mb-4">Modifier l'Annonce</h2>
                <Form onSubmit={handleSubmit}>
                    {selectedImages && selectedImages.length > 0 ? (
                        <div className="mb-4 d-flex flex-row justify-content-center align-items-center">
                            {selectedImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="Selected"
                                    className="img-thumbnail"
                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-4 d-flex flex-row justify-content-center align-items-center">
                            {ad.pictures.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="Selected"
                                    className="img-thumbnail"
                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                />
                            ))}
                        </div>
                    )}
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="pictures">Upload Photos:</Label>
                                <Input
                                    type="file"
                                    name="pictures"
                                    id="pictures"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <small className="form-text text-muted">
                                    Vous pouvez sélectionner plusieurs images
                                </small>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="title">Titre:</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={advertisement.title}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="price">Prix:</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    id="price"
                                    value={advertisement.price}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Row>
                            <Col>
                                <Label for="description">Description:</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    value={advertisement.description}
                                    onChange={handleChange}
                                    style={{ height: "200px" }}
                                />
                            </Col>
                            <Col>
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
                            </Col>
                        </Row>
                    </FormGroup>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="category">Category</Label>
                                <Input
                                    type="select"
                                    name="category"
                                    id="category"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select category</option>
                                    {categories && (
                                        <>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="subcategory">Subcategory</Label>
                                <Input
                                    type="select"
                                    name="subcategory"
                                    id="subcategory"
                                    value={selectedSubcategory}
                                    onChange={handleSubcategoryChange}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Select Subcategory</option>
                                    {subcategories.map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Row>
                            <Col>
                                <Button onClick={handleRecord}>{recording ? 'Stop Recording' : 'Start Recording'}</Button>
                                <Input type="file" accept="audio/*" onChange={handleAudioChange} />
                            </Col>
                            <Col>{audioBlob ? (
                                <div>
                                    <audio ref={audioPlayerRef} src={URL.createObjectURL(audioBlob)} controls />
                                </div>
                            ) : (
                                <div>
                                    <audio ref={audioPlayerRef} src={ad.vocal} controls />
                                </div>
                            )}
                            </Col>
                        </Row>
                    </FormGroup>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                        <div className="alert alert-success">
                            Annonce mise à jour avec succès!
                        </div>
                    )}
                    {deleted && (
                        <div className="alert alert-success">
                            Annonce supprimée avec succès!
                        </div>
                    )}
                    <div className="text-center p-5 d-flex flex-row justify-content-between align-items-center">
                        <Button type="submit" variant="primary">
                            Sauvegarder
                        </Button>{" "}
                        <Button variant="danger" onClick={handleShowModal}>
                            Supprimer l'annonce
                        </Button>
                    </div>
                </Form>
            </div>
            <Modal show={showDeleteModal} onHide={handleHideModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Suppression l'annonce</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHideModal}>
                        Retourner
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAd}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditAd;