import React, { useState, useEffect, useRef } from "react";
import { Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { Button, Modal } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";

function EditAd({ ad }) {
    const [advertisement, setAdvertisement] = useState(ad);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(ad.category);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(ad.subcategory);
    const [locations, setLocation] = useState([]);
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
                const response = await axios.get("http://localhost:8080/category/getall");
                setCategories(response.data.category);
                const foundCategory = response.data.category.find(category => category._id === ad.category);
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
                `http://localhost:8080/ad/editad/${ad._id}/${selectedLocationId}`,
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
                `http://localhost:8080/ad/delete/${ad._id}`
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
                <h2 className="text-center mb-4">Edit Advertisement</h2>
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
                                <Label for="pictures">Upload Pictures</Label>
                                <Input
                                    type="file"
                                    name="pictures"
                                    id="pictures"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <small className="form-text text-muted">
                                    You can select multiple images
                                </small>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="title">Title</Label>
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
                                <Label for="price">Price</Label>
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
                                <Label for="description">Description</Label>
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
                                <div ref={inputRef}>
                                    <Label htmlFor="location">Location:</Label>
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
                                    <option value="">Select a category</option>
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
                                    <option value="">Select a subcategory</option>
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
                            Ad updated successfully!
                        </div>
                    )}
                    {deleted && (
                        <div className="alert alert-success">
                            Ad Deleted successfully!
                        </div>
                    )}
                    <div className="text-center p-5 d-flex flex-row justify-content-between align-items-center">
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>{" "}
                        <Button variant="danger" onClick={handleShowModal}>
                            Delete Advertisement
                        </Button>
                    </div>
                </Form>
            </div>
            <Modal show={showDeleteModal} onHide={handleHideModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Advertisement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this advertisement?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHideModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAd}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditAd;