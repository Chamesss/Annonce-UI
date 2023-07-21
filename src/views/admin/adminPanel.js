import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';

/* eslint-disable react-hooks/exhaustive-deps */

function AdminControl() {
    const [userCount, setUserCount] = useState(0);
    const [adCount, setAdCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchAdQuery, setSearchAdQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [category, setCategories] = useState([]);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [addCategoryName, setAddCategoryName] = useState('');
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [reclamations, setReclamations] = useState([]);
    const [reclamationsCount, setReclamationsCount] = useState(null);
    const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
    const [addSubcategoryName, setAddSubcategoryName] = useState('');
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
    const [editSubcategoryId, setEditSubcategoryId] = useState('');
    const [editSubcategoryName, setEditSubcategoryName] = useState('');
    const [addCategoryPictureFile, setAddCategoryPictureFile] = useState(null);
    const [editCategoryPictureFile, setEditCategoryPictureFile] = useState(null);
    const [addSubCategoryPictureFile, setAddSubCategoryPictureFile] = useState(null);
    const [editSubCategoryPictureFile, setEditSubcategoryPictureFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        verifyUser();
        fetchUsers();
        fetchAds();
        fetchCategories();
        fetchReclamations();
    }, []);

    const verifyUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch("https://annonce-backend.azurewebsites.net/verifyadmin", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status !== true) {
                    navigate("/404");
                } else {
                    setIsAdmin(true);
                }
            }
        } catch (error) {
            navigate("/404");
        }
    }

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch("https://annonce-backend.azurewebsites.net/admin/getusers", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                const { users: apiUsers, user_count: apiUserCount } = data;

                setUserCount(apiUserCount);
                setFilteredUsers(apiUsers);
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching users:', error);
        }
    };

    const fetchAds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch("https://annonce-backend.azurewebsites.net/admin/getads", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                const { ads: apiAds, ads_count: apiAdCount } = data;
                setAdCount(apiAdCount);
                setFilteredAds(apiAds);
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching ads:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://annonce-backend.azurewebsites.net/category/getall');
            const data = await response.json();

            if (data) {
                setCategories(data.category);
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching categories:', error);
        }
    };

    const fetchReclamations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/getreclamation`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setReclamations(data.reclamations);
                setReclamationsCount(data.reclamationCount);
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching reclamations:', error);
        }
    };

    const handleSearchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/getuser?search=${encodeURIComponent(searchQuery)}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setFilteredUsers(data.users);
                } else {
                    setError(data.error);
                    setFilteredUsers([]);
                }
            }
        } catch (error) {
            setError(error);
            console.error('Error searching users:', error);
        }
    };

    const handleSearchAds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/getad?search=${encodeURIComponent(searchAdQuery)}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setFilteredAds(data.ads);
                } else {
                    setError(data.error);
                    setFilteredAds([]);
                }
            }
        } catch (error) {
            setError(error);
            console.error('Error searching users:', error);
        }
    };

    const handleApproveAd = async (adId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/adapprove/${adId}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Annonce approuvée avec succès! ...")
                fetchAds();
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
            console.log('Error approving ad:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/deleteuser/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
                setMessage("Utilisateur supprimé avec succès ! ...");
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
            console.log('Error deleting user:', error);
        }
    };

    const handleBanUser = async (userId) => {
        try {
            const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/banuser/${userId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await response.json();
            if (data.success === true) {
                fetchUsers();
                setMessage("Utilisateur banni avec succès ! ...")
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }

    const handleDeleteAd = async (adId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://annonce-backend.azurewebsites.net/admin/addelete/${adId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                fetchAds();
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
            console.log('Error deleting ad:', error);
        }
    };

    const handleCategoryPictureChange = (file) => {
        setAddCategoryPictureFile(file);
    };

    const handleCategoryPictureEdit = (file) => {
        setEditCategoryPictureFile(file);
    };

    const handleSubCategoryPictureAdd = (file) => {
        setAddSubCategoryPictureFile(file);
    }

    const handleCategoryPictureChangeEdit = (file) => {
        setEditSubcategoryPictureFile(file);
    }


    const handleAddCategory = async (name, pictureFile) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('picture', pictureFile);

            const response = await fetch('https://annonce-backend.azurewebsites.net/category/add', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data) {
                setShowAddCategoryModal(false);
                setAddCategoryName('');
                fetchCategories();
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async (editCategoryId, editCategoryName, pictureFile) => {
        try {
            const formData = new FormData();
            formData.append('name', editCategoryName);
            formData.append('picture', pictureFile);

            const response = await fetch(`https://annonce-backend.azurewebsites.net/category/edit/${editCategoryId}`, {
                method: 'PATCH',
                body: formData,
            });
            const data = await response.json();

            if (data) {
                setShowEditCategoryModal(false);
                setEditCategoryId('');
                setEditCategoryName('');
                fetchCategories();
            }
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    const handleAddSubcategory = async (categoryId, addSubcategoryName, pictureFile) => {
        try {
            const formData = new FormData();
            formData.append('name', addSubcategoryName);
            formData.append('picture', pictureFile);

            const response = await fetch(
                `https://annonce-backend.azurewebsites.net/category/addsubcategory/${categoryId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();

            if (data) {
                setShowAddSubcategoryModal(false);
                fetchCategories();
                const updatedCategory = { ...selectedCategory };
                updatedCategory.subcategories.push(data.subcategory);
                setSelectedCategory(updatedCategory);
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const handleEditSubcategoryPopup = (subcategoryId) => {
        setEditSubcategoryId(subcategoryId);
        setShowEditSubcategoryModal(true);
    };

    const handleEditSubcategory = async (currentCategoryId, subcategoryId, newName, newPicture) => {
        try {
            const formData = new FormData();
            formData.append('name', newName);
            formData.append('picture', newPicture);
            const response = await fetch(`https://annonce-backend.azurewebsites.net/category/editsub/${currentCategoryId}/${subcategoryId}`, {
                method: 'PATCH',
                body: formData,
            });
            if (response.ok) {
                setShowEditSubcategoryModal(false);
                fetchCategories();
                const updatedCategory = { ...selectedCategory };
                const updatedSubcategoryIndex = updatedCategory.subcategories.findIndex(sub => sub._id === subcategoryId);
                if (updatedSubcategoryIndex !== -1) {
                    updatedCategory.subcategories[updatedSubcategoryIndex].name = newName;
                }
                setSelectedCategory(updatedCategory);
            } else {
                console.error('Failed to update subcategory');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`https://annonce-backend.azurewebsites.net/category/delete/${categoryId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data) {
                fetchCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
        try {
            const response = await fetch(
                `https://annonce-backend.azurewebsites.net/category/deletesub/${categoryId}/${subcategoryId}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await response.json();
            if (data) {
                fetchCategories();
                const updatedSubcategories = selectedCategory.subcategories.filter(
                    (subcategory) => subcategory._id !== subcategoryId
                );
                setSelectedCategory((prevSelectedCategory) => ({
                    ...prevSelectedCategory,
                    subcategories: updatedSubcategories,
                }));
            }
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    return (
        <div>
            {isAdmin && (
                <><div className="header"><Header />
                    {message && <div className="text-success mb-3">{message}</div>}
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <Tabs defaultActiveKey="user-control">


                        <Tab eventKey="user-control" title="User Control">
                            <div className="m-2">
                                <h2 style={{ color: 'black' }}>Contrôle des utilisateurs</h2>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-form"
                                        placeholder="Recherche par nom ou email" />
                                    <button onClick={handleSearchUsers} className="button mt-2">
                                        Search
                                    </button>
                                </div>
                                <p>Nombre total d'utilisateurs: {userCount}</p>
                                <Table striped hover style={{ borderColor: 'lightgray' }}>
                                    <thead className='bg-dark text-white'>
                                        <tr>
                                            <th>Prénom</th>
                                            <th>Nom</th>
                                            <th>Photo</th>
                                            <th>Address</th>
                                            <th>Telephone</th>
                                            <th>Email</th>
                                            <th>Date de création</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.firstname}</td>
                                                    <td>{user.lastname}</td>
                                                    <td style={{ maxWidth: '210px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.picture}</td>
                                                    <td>{user.address}</td>
                                                    <td>{user.tel}</td>
                                                    <td>{user.email}</td>
                                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                                    <td>{user.state ? "Active" : "Inactive"}</td>
                                                    <td className="d-flex gap-2">
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleBanUser(user._id)}
                                                        >
                                                            Bannir
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">Aucun utilisateur trouvé.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey="ad-control" title="Ad Control">
                            <div className="m-2">
                                <h2 style={{ color: 'black' }}>Contrôle des annonces</h2>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={searchAdQuery}
                                        onChange={(e) => setSearchAdQuery(e.target.value)}
                                        className="input-form"
                                        placeholder="Recherche par titre ou description..." />
                                    <button onClick={handleSearchAds} className="button mt-2">
                                        Search
                                    </button>
                                </div>
                                <p>Total Ads: {adCount}</p>
                                <Table striped bordered hover>
                                    <thead className='bg-dark text-white'>
                                        <tr>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Website</th>
                                            <th>Description</th>
                                            <th>Pictures</th>
                                            <th>Vocal</th>
                                            <th>Address</th>
                                            <th>Added Date</th>
                                            <th>State</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAds.length > 0 ? (
                                            filteredAds.map(ad => (
                                                <tr key={ad.id}><td>{ad.title}</td>
                                                    <td>{ad.price}</td>
                                                    <td>{ad.website}</td>
                                                    <td>{ad.description}</td>
                                                    <td style={{ maxWidth: '210px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.pictures}</td>
                                                    <td style={{ maxWidth: '210px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.vocal}</td>
                                                    <td>{ad.address}</td>
                                                    <td>{new Date(ad.createdAt).toLocaleString()}</td>
                                                    <td>{ad.state ? "Active" : "Inactive"}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            {ad.state === false && (
                                                                <Button
                                                                    variant="success"
                                                                    onClick={() => handleApproveAd(ad._id)}
                                                                >
                                                                    Approve
                                                                </Button>)}
                                                            <Button
                                                                variant="danger"
                                                                onClick={() => handleDeleteAd(ad._id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8">Aucune annonce trouvée.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey="category-control" title="Category Control">
                            <div className="m-2">
                                <h2 style={{ color: 'black' }}>Contrôle de catégories</h2>
                                <Button onClick={() => setShowAddCategoryModal(true)}>+ Ajouter</Button>
                                {/* Category Table */}
                                <Table striped bordered hover>
                                    <thead className='bg-dark text-white'>
                                        <tr>
                                            <th>#</th>
                                            <th>Nom</th>
                                            <th>Photo</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.map((category, index) => (
                                            <tr key={category._id}>
                                                <td>{index + 1}</td>
                                                <td>{category.name}</td>
                                                <td>{category.picture}</td>
                                                <td className="d-flex gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            setShowEditCategoryModal(true);
                                                            setEditCategoryId(category._id);
                                                            setEditCategoryName(category.name);
                                                        }}
                                                    >
                                                        Modifier
                                                    </Button>
                                                    <Button onClick={() => handleDeleteCategory(category._id)}>
                                                        Supprimer
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setShowSubcategories(true);
                                                            setEditCategoryId(category._id);
                                                        }}
                                                    >
                                                        Subcategories
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {/* Show Subcategory Modal */}
                                {showSubcategories && selectedCategory && (
                                    <Modal show={showSubcategories} onHide={() => setShowSubcategories(false)} backdrop="static" centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Subcategories</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Button onClick={() => setShowAddSubcategoryModal(true)}>+ Add</Button>
                                            <Table striped bordered hover>
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Nom</th>
                                                        <th>Photos</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedCategory.subcategories.map((subcategory, index) => (
                                                        <tr key={subcategory._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{subcategory.name}</td>
                                                            <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subcategory.picture}</td>
                                                            <td className="d-flex gap-2">
                                                                <Button onClick={() => handleDeleteSubcategory(editCategoryId, subcategory._id)}>Supprimer</Button>
                                                                <Button onClick={() => {
                                                                    handleEditSubcategoryPopup(subcategory._id);
                                                                    setEditSubcategoryName(subcategory.name);
                                                                }}>Modifier</Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowSubcategories(false)}>
                                                Fermer
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                )}

                                {/* Edit Subcategory Modal */}
                                <Modal show={showEditSubcategoryModal} onHide={() => setShowEditSubcategoryModal(false)} backdrop="static" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modifier Subcategory</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <div style={{ marginBottom: '10px' }}>
                                                <Form.Group controlId="formEditSubcategoryName">
                                                    <Form.Label>Nom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={editSubcategoryName}
                                                        onChange={(e) => setEditSubcategoryName(e.target.value)} />
                                                </Form.Group>
                                            </div>
                                            <Form.Group controlId="formEditSubcategoryPicture">
                                                <Form.Label>Photo: </Form.Label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleCategoryPictureChangeEdit(e.target.files[0])} />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowEditSubcategoryModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={() => handleEditSubcategory(editCategoryId, editSubcategoryId, editSubcategoryName, editSubCategoryPictureFile)}>
                                            Edit
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* Add Category Modal */}
                                <Modal show={showAddCategoryModal} onHide={() => setShowAddCategoryModal(false)} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Ajouter Category</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <div style={{ marginBottom: '10px' }}>
                                                <Form.Group controlId="formCategoryName">
                                                    <Form.Label>Nom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={addCategoryName}
                                                        onChange={(e) => setAddCategoryName(e.target.value)} />
                                                </Form.Group> </div>
                                            <Form.Group controlId="formCategoryPicture">
                                                <Form.Label>Photo: </Form.Label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleCategoryPictureChange(e.target.files[0])} />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowAddCategoryModal(false)}>
                                            Annuler
                                        </Button>
                                        <Button variant="primary" onClick={() => handleAddCategory(addCategoryName, addCategoryPictureFile)}>
                                            Ajputer
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* Edit Category Modal */}
                                <Modal show={showEditCategoryModal} onHide={() => setShowEditCategoryModal(false)} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modifier Category</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <div style={{ marginBottom: '10px' }}>
                                                <Form.Group controlId="formEditCategoryName">
                                                    <Form.Label>Nom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={editCategoryName}
                                                        onChange={(e) => setEditCategoryName(e.target.value)} />
                                                </Form.Group>
                                            </div>
                                            <Form.Group controlId="formEditCategoryPicture">
                                                <Form.Label>Photo: </Form.Label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleCategoryPictureEdit(e.target.files[0])} />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowEditCategoryModal(false)}>
                                            Annuler
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleEditCategory(editCategoryId, editCategoryName, editCategoryPictureFile)}
                                        >
                                            Sauvegarder
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                {/* Add Subcategory Modal */}
                                <Modal show={showAddSubcategoryModal} onHide={() => setShowAddSubcategoryModal(false)} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Ajouter Subcategory</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <div style={{ marginBottom: '10px' }}>
                                                <Form.Group controlId="formSubcategoryName">
                                                    <Form.Label>Nom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={addSubcategoryName}
                                                        onChange={(e) => setAddSubcategoryName(e.target.value)} />
                                                </Form.Group>
                                            </div>
                                            <Form.Group controlId="formSubcategoryPicture">
                                                <Form.Label>Photo: </Form.Label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleSubCategoryPictureAdd(e.target.files[0])} />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowAddSubcategoryModal(false)}>
                                            Annuler
                                        </Button>
                                        <Button variant="primary" onClick={() => handleAddSubcategory(editCategoryId, addSubcategoryName, addSubCategoryPictureFile)}>
                                            Ajouter
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </Tab>
                        <Tab eventKey="reclamations" title="Reclamations">
                            <div className="m-2" style={{ minHeight: "350px" }}>
                                <h2 style={{ color: 'black' }}>Reclamations</h2>
                                <p>Total Reclamations: {reclamationsCount}</p>
                                <Table striped bordered hover style={{ borderColor: 'lightgray' }}>
                                    <thead className='bg-dark text-white'>
                                        <tr>
                                            <th>#</th>
                                            <th>Annonces Titre</th>
                                            <th>Prénom</th>
                                            <th>Info</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reclamations.map((reclamation, index) => (
                                            <tr key={reclamation._id}>
                                                <td style={{ width: '40px' }}>{index + 1}</td>
                                                <td>{reclamation.adTitle}</td>
                                                <td>{reclamation.userName}</td>
                                                <td>{reclamation.info}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                    </Tabs>
                </div><Footer />
                </>
            )}
        </div>
    );
}

export default AdminControl;