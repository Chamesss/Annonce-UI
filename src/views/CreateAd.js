import React, { useState, useEffect, useRef } from 'react';
import { Tab, Tabs, Form, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import Header from '../components/header';
import Footer from '../components/footer';
import './css/Create-ad.css';
import { useNavigate } from 'react-router-dom';

/* eslint-disable react-hooks/exhaustive-deps */


const CreateAdPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [vocal, setVocal] = useState(null);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [location, setLocation] = useState('');
    const [token, setToken] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioPlayerRef = useRef(null);
    const Navigate = useNavigate();

    const [errorcategory, setErrorCategory] = useState('');
    const [errorinfo, setInfoError] = useState('');
    const [errorpicture, setPicturesError] = useState('');
    const [errorlocation, setLocationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorsuccess, setErrorSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);


    useEffect(() => {
        controlToken();
        fetchCategories();
        fetchLocations();
    }, []);

    const options = suggestions.slice(0, 8).map((location) => ({
        id: `${location._id}`,
        value: `${location.admin_name}, ${location.city}`,
        label: `${location.admin_name}, ${location.city}`,
    }));

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                Navigate('/');
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [success]);

    const controlToken = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://annonce-backend.azurewebsites.net/protected/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json();
            if (data.status !== true) {
                Navigate('/login');
            }
            setToken(token);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://annonce-backend.azurewebsites.net/category/getall');
            const data = await response.json();
            setCategories(data.category);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleGoBack = () => {
        Navigate(-1);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('https://annonce-backend.azurewebsites.net/location/get');
            const data = await response.json();
            setLocations(data.locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleTabSelect = (selectedTab) => {
        if (selectedTab === 1 && (categoryId === '' || subCategoryId === '')) {
            setErrorCategory("Please select a category and subcategory for your ad.");
            return;
        }

        setErrorCategory('');

        if (selectedTab === 2) {
            if (title === '') {
                setInfoError("Please enter a title");
                return;
            }
            if (price === '') {
                setInfoError("Please enter a price");
                return;
            }
            if (description.length < 15) {
                setInfoError("Description must be at least 15 characters");
                return;
            }
            setInfoError("");
        }

        if (selectedTab === 3) {
            if (pictures.length === 0) {
                setPicturesError("Please add at least one picture");
                return;
            }
            setPicturesError("");
        }


        setActiveTab(selectedTab);
        const newProgress = (selectedTab / 5) * 100;
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

        if (selectedLocationId === '') {
            setLocationError("Please select a valid location");
            return
        } else {
            setLocationError("");
        }
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
            setIsLoading(true);
            const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/create/${selectedLocationId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.status === true) {
                setIsLoading(false);
                setSuccess("Successful.. Redirecting to home page");
            }
            else {
                setErrorSuccess(data.message);
            }
        } catch (error) {
            setErrorSuccess(error.message);
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

    const handleLocationSelect = (location) => {
        setSelectedLocationId(location.id);
        setLocation(location);
        setLocationError('');
    };

    const renderPictures = () => {
        return pictures.map((picture, index) => (
            <img key={index} src={URL.createObjectURL(picture)} alt={`${index + 1}`} />
        ));
    };

    return (
        <div>
            <div className="header"><Header />
                <ProgressBar now={progress} label={`${progress}%`} className="my-4" />
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="createAdTabs" className="my-4">
                    <Tab eventKey={0}>
                        <Form>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="container d-flex justify-content-center ">
                                    <div className="col-lg-4 border border-4 p-4" style={{ borderRadius: "20px" }}>
                                        <h2 className="mb-5 mt-4">Choisir une catégorie:</h2>
                                        <div className="mb-3">
                                            <Form.Group controlId="categoryId">
                                                <div className="drop">
                                                    <Form.Label>Category</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={categoryId}
                                                        onChange={(e) => setCategoryId(e.target.value)}
                                                        required
                                                    >
                                                        <option value=''>Select category</option>
                                                        {categories.map((category) => (
                                                            <option key={category._id} value={category._id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Group controlId="subCategoryId">
                                                <div className="drop">
                                                    <Form.Label>Subcategory</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={subCategoryId}
                                                        onChange={(e) => setSubCategoryId(e.target.value)}
                                                    >
                                                        <option value=''>Select subcategory</option>
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
                                        <p className="mx-3 text-danger">{errorcategory}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="mx-3">
                                                <Button variant="primary" onClick={() => handleGoBack()}>
                                                    Retourner
                                                </Button>
                                            </div>
                                            <div className="mx-3">
                                                <Button variant="primary" onClick={() => handleTabSelect(1)}>
                                                    Suivant
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab>
                    <Tab eventKey={1}>
                        <Form>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="container d-flex justify-content-center">
                                    <div className="col-lg-4 border border-4 p-4" style={{ borderRadius: "20px" }}>
                                        <h2 className="mb-5 mt-4">Infos générales:</h2>
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
                                            <Form.Label>Prix</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="website">
                                            <Form.Label>Website (optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter website"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="description">
                                            <Form.Label>Description:</Form.Label>
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
                                        <p className="mx-3 text-danger">{errorinfo}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleTabSelect(0)}>
                                                Retourner
                                                </Button></div>
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleTabSelect(2)}>
                                                    Suivant
                                                </Button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab>
                    <Tab eventKey={2}>
                        <Form>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="container d-flex justify-content-center">
                                    <div className="col-lg-4 border border-4 p-4" style={{ borderRadius: "20px" }}>
                                        <h2 className="mb-5 mt-4">Photos:</h2>
                                        <Form.Group controlId="pictures">
                                            <Form.Label>Upload Photos</Form.Label>
                                            <Form.Control type="file" multiple onChange={handlePictureSelect} />
                                        </Form.Group>
                                        <div className="uploaded-pictures">
                                            {renderPictures()}
                                        </div>
                                        <p className="mx-3 text-danger">{errorpicture}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleTabSelect(1)}>
                                                    Retourner
                                                </Button></div>
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleTabSelect(3)}>
                                                    Suivant
                                                </Button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab>
                    <Tab eventKey={3}>
                        <Form>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="container d-flex justify-content-center">
                                    <div className="col-lg-4 border border-4 p-4" style={{ borderRadius: "20px" }}>
                                        <h2 className="mb-5 mt-4">Enregistrement audio: </h2>
                                        <Form.Group controlId="audio">
                                            <Form.Label>Record Audio (optionnel)</Form.Label>
                                            <div>
                                                <Button onClick={handleRecord}>{recording ? 'Stop Recording' : 'Start Recording'}</Button>
                                            </div>
                                            <div>
                                                <input type="file" className="form-control" accept="audio/*" onChange={handleAudioChange} />
                                                {audioBlob && (
                                                    <audio ref={audioPlayerRef} src={URL.createObjectURL(audioBlob)} controls />
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="drop">
                                                    <Button variant="primary" onClick={() => handleTabSelect(2)}>
                                                        Retourner
                                                    </Button></div>
                                                <div className="drop">
                                                    <Button variant="primary" onClick={() => handleTabSelect(4)}>
                                                        Suivant
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab>
                    <Tab eventKey={4}>
                        <Form>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="container d-flex justify-content-center">
                                    <div className="col-lg-4 border border-4 p-4" style={{ borderRadius: "20px" }}>
                                        <h2 className="mb-5 mt-4">Location select: </h2>
                                        <Form.Group controlId="location">
                                            <Form.Label>Location</Form.Label>
                                            <Select
                                                options={options}
                                                value={location}
                                                onChange={handleLocationSelect}
                                                onInputChange={handleInputChange}
                                                placeholder="Enter an address"
                                                blurInputOnSelect={false}
                                            />
                                        </Form.Group>
                                        <p className="mx-3 text-danger">{errorlocation}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleTabSelect(3)}>
                                                    Retourner
                                                </Button></div>
                                            <div className="drop">
                                                <Button variant="primary" onClick={() => handleFormSubmit()}>
                                                    Suivant
                                                </Button></div>
                                        </div>
                                        {isLoading && (
                                            <div className="loading-block">
                                                <Spinner animation="border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </div>
                                        )}
                                        <p className="mx-3 text-danger">{errorsuccess}</p>
                                        <p className="mx-3 text-success">{success}</p>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab>
                </Tabs>
            </div>
            <Footer />
        </div >
    );
};

export default CreateAdPage;