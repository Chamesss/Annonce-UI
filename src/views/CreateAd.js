import React, { useState, useEffect, useRef } from 'react';
import { Container, Tab, Tabs, Form, Button, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FaUser, FaHeart, FaQuestionCircle, FaSignOutAlt, FaBell } from "react-icons/fa";
import Header from '../components/header';
import Footer from '../components/footer';
import './css/Create-ad.css';
import { useNavigate } from 'react-router-dom';

const CreateAdPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [vocal, setVocal] = useState(null);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [token, setToken] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioPlayerRef = useRef(null);
    const Navigate = useNavigate();

    useEffect(() => {
        controlToken();
        // Fetch categories from API
        fetchCategories();
        // Fetch locations from API
        fetchLocations();
    }, []);

    const controlToken = async () => {
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/protected/`, {
                method:"GET",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json();
            if (data.status !== true){
                Navigate('/login');
            }
            setToken(token);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/category/getall');
            const data = await response.json();
            setCategories(data.category);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:8080/location/get');
            const data = await response.json();
            setLocations(data.locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleTabSelect = (selectedTab) => {
        setActiveTab(selectedTab);
        const newProgress = (selectedTab / 5) * 100; // Assuming there are 4 tabs (0, 1, 2, 3)
        setProgress(newProgress);
    };

    const handlePictureSelect = (e) => {
        const files = Array.from(e.target.files);
        setPictures(files);
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
                    setVocal(audioBlob);
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

    const handleFormSubmit = async (e) => {
        setProgress(100);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('website', website);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        if (subCategoryId) {
            formData.append('subCategoryId', subCategoryId);
        }
        formData.append('audio', vocal);
        pictures.forEach((picture) => {
            formData.append('picture', picture);
        });
        
        try {
            const response = await fetch(`http://localhost:8080/ad/create/${selectedLocationId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.status === true){
                console.log('ad successfully created');
                Navigate('/');
            }
            else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }

        // Reset form
        // setTitle('');
        // setPrice('');
        // setWebsite('');
        // setDescription('');
        // setPictures([]);
        // setCategoryId('');
        // setSubCategoryId(null);
        // setVocal(null);
        // setLocations('');

        // Go back to the first tab
        setActiveTab(0);
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        // Filter the locations based on the search term
        const filteredLocations = locations.filter(
            (location) =>
                location.admin_name.toLowerCase().includes(value.toLowerCase()) ||
                location.city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredLocations);
    };

    const handleLocationSelect = (event, locationId, city, country) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedLocationId(locationId);
        let place = country + ', ' + city;
        setSearchTerm(place);
        setSuggestions([]);
    };

    const renderPictures = () => {
        return pictures.map((picture, index) => (
            <img key={index} src={URL.createObjectURL(picture)} alt={`Picture ${index + 1}`} />
        ));
    };

    return (
        <div>
            <div class="header"><Header />
                <ProgressBar now={progress} label={`${progress}%`} />
                <div class="container">
                    <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="createAdTabs">
                        <Tab eventKey={0}>
                            <Form>
                                <h5 class="title">Choisir une catégorie:</h5>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Form.Group controlId="categoryId" className="mr-3">
                                        <div class="drop">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={categoryId}
                                                onChange={(e) => setCategoryId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </div>
                                    </Form.Group>
                                    <Form.Group controlId="subCategoryId" className="ml-3">
                                        <div class="drop">
                                            <Form.Label>Subcategory</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={subCategoryId}
                                                onChange={(e) => setSubCategoryId(e.target.value)}
                                            >
                                                <option value="">Select subcategory</option>
                                                {categories.find((category) => category._id === categoryId)?.subcategories.map(
                                                    (subcategory) => (
                                                        <option key={subcategory._id} value={subcategory._id}>
                                                            <span className="subcategory-icon">
                                                                <FontAwesomeIcon icon={faChevronDown} />
                                                            </span>
                                                            {subcategory.name}
                                                        </option>
                                                    )
                                                )}
                                            </Form.Control>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(0)}>
                                            Precedant
                                        </Button></div>
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(1)}>
                                            Next
                                        </Button></div>
                                </div>
                            </Form>
                        </Tab>
                        <Tab eventKey={1}>
                            <Form>
                                <h5 class="title">Infos générales:</h5>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="website">
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter website"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description (at least 15 characters)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        minLength={15}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between box">
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(0)}>
                                            Precedant
                                        </Button></div>
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(2)}>
                                            Next
                                        </Button></div>
                                </div>
                            </Form>
                        </Tab>
                        <Tab eventKey={2}>
                            <Form>
                                <h5 class="title">Photos:</h5>
                                <Form.Group controlId="pictures">
                                    <Form.Label>Upload Pictures</Form.Label>
                                    <Form.Control type="file" multiple onChange={handlePictureSelect} />
                                </Form.Group>
                                <div className="uploaded-pictures">
                                    {renderPictures()}
                                </div>
                                <div className="d-flex justify-content-between box">
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(1)}>
                                            Precedant
                                        </Button></div>
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(3)}>
                                            Next
                                        </Button></div>
                                </div>
                            </Form>
                        </Tab>
                        <Tab eventKey={3}>
                            <Form>
                                <h5 class="title">Enregistrement audio: </h5>
                                <Form.Group controlId="audio">
                                    <Form.Label>Record Audio (optional)</Form.Label>
                                    <div>
                                        <Button onClick={handleRecord}>{recording ? 'Stop Recording' : 'Start Recording'}</Button>
                                    </div>
                                    {audioBlob && (
                                        <div>
                                            <input type="file" accept="audio/*" onChange={handleAudioChange} />
                                            <audio ref={audioPlayerRef} src={URL.createObjectURL(audioBlob)} controls />
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between box">
                                        <div className="drop">
                                            <Button variant="primary" onClick={() => handleTabSelect(2)}>
                                                Precedant
                                            </Button></div>
                                        <div className="drop">
                                            <Button variant="primary" onClick={() => handleTabSelect(4)}>
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </Form.Group>
                            </Form>
                        </Tab>
                        <Tab eventKey={4}>
                            <Form>
                                <Form.Group controlId="location">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        placeholder="Enter an address"
                                    />
                                    {searchTerm.length > 1 && suggestions.length > 0 && (
                                        <ul>
                                            {suggestions.slice(0, 6).map((location) => (
                                                <li
                                                    key={location._id}
                                                    onClick={(event) => handleLocationSelect(event, location._id, location.city, location.admin_name)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {location.admin_name}, {location.city}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Form.Group>
                                <div className="d-flex justify-content-between box">
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleTabSelect(3)}>
                                            Precedant
                                        </Button></div>
                                    <div className="drop">
                                        <Button variant="primary" onClick={() => handleFormSubmit()}>
                                            Valider
                                        </Button></div>
                                </div>
                            </Form>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default CreateAdPage;