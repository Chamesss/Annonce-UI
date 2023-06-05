import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    useEffect(() => {
        verifyUser();
        fetchUsers();
        fetchAds();
        fetchCategories();
        fetchReclamations();
    }, []);

    const verifyUser = async () => {
        try {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch("http://localhost:8080/verifyadmin", {
                        method: "GET",
                        headers: {Authorization: `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (data.status !== true){
                        navigate("/404");
                    }
                }
            } catch (error) {

            }
        } catch (error) {

        }
    }

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch("http://localhost:8080/admin/getusers", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                const { users: apiUsers, user_count: apiUserCount } = data;
                console.log(data);
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
                const response = await fetch("http://localhost:8080/admin/getads", {
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
            const response = await fetch('http://localhost:8080/category/getall');
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
                const response = await fetch(`http://localhost:8080/admin/getreclamation`, {
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
                const response = await fetch(`http://localhost:8080/admin/getuser?search=${encodeURIComponent(searchQuery)}`, {
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
                const response = await fetch(`http://localhost:8080/admin/getad?search=${encodeURIComponent(searchAdQuery)}`, {
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
            const response = await fetch(`http://localhost:8080/admin/adapprove/${adId}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Ad approved successfully! ...")
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
            const response = await fetch(`http://localhost:8080/admin/deleteuser/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
                setMessage("User deleted successfully ! ...");
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
            const response = await fetch(`http://localhost:8080/admin/banuser/${userId}`, {
                method: 'POST',
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            })
            const data = await response.json();
            if (data.success == true) {
                fetchUsers();
                setMessage("user banned successfully ! ...")
            } else  {
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
            const response = await fetch(`http://localhost:8080/admin/addelete/${adId}`, {
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

            const response = await fetch('http://localhost:8080/category/add', {
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

            const response = await fetch(`http://localhost:8080/category/edit/${editCategoryId}`, {
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
                `http://localhost:8080/category/addsubcategory/${categoryId}`,
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
            const response = await fetch(`http://localhost:8080/category/editsub/${currentCategoryId}/${subcategoryId}`, {
                method: 'PATCH',
                body: formData,
            });
            if (response.ok) {
                setShowEditSubcategoryModal(false);
                fetchCategories();
                console.log('Subcategory updated successfully');
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
            const response = await fetch(`http://localhost:8080/category/delete/${categoryId}`, {
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
                `http://localhost:8080/category/deletesub/${categoryId}/${subcategoryId}`,
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
            <div className="header"><Header />
            {message && <div className="text-success mb-3">{message}</div>}
                {error && <div className="text-danger mb-3">{error}</div>}
                <Tabs defaultActiveKey="user-control">

                
                    <Tab eventKey="user-control" title="User Control">
                        <div className="m-2">
                            <h2 style={{ color: 'black' }}>User Control</h2>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-control"
                                    placeholder="Search by name or email"
                                />
                                <button onClick={handleSearchUsers} className="btn btn-primary mt-2">
                                    Search
                                </button>
                            </div>
                            <p>Total Users: {userCount}</p>
                            <Table striped hover style={{ borderColor: 'lightgray' }}>
                                <thead className='bg-dark text-white'>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Picture</th>
                                        <th>Address</th>
                                        <th>Tel</th>
                                        <th>Email</th>
                                        <th>Creation Date</th>
                                        <th>State</th>
                                        <th>Action</th>
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
                                                        Delete
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
                                            <td colSpan="7">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="ad-control" title="Ad Control">
                        <div className="m-2">
                            <h2 style={{ color: 'black' }}>Ad Control</h2>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={searchAdQuery}
                                    onChange={(e) => setSearchAdQuery(e.target.value)}
                                    className="form-control"
                                    placeholder="Search by title or description..."
                                />
                                <button onClick={handleSearchAds} className="btn btn-primary mt-2">
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
                                            <td colSpan="8">No ads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="category-control" title="Category Control">
                        <div className="m-2">
                            <h2 style={{ color: 'black' }}>Category Control</h2>
                            <Button onClick={() => setShowAddCategoryModal(true)}>+ Add</Button>
                            {/* Category Table */}
                            <Table striped bordered hover>
                                <thead className='bg-dark text-white'>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Picture</th>
                                        <th>Action</th>
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
                                                    Modify
                                                </Button>
                                                <Button onClick={() => handleDeleteCategory(category._id)}>
                                                    Delete
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
                                                    <th>Name</th>
                                                    <th>Picture</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCategory.subcategories.map((subcategory, index) => (
                                                    <tr key={subcategory._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{subcategory.name}</td>
                                                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subcategory.picture}</td>
                                                        <td className="d-flex gap-2">
                                                            <Button onClick={() => handleDeleteSubcategory(editCategoryId, subcategory._id)}>Delete</Button>
                                                            <Button onClick={() => {
                                                                handleEditSubcategoryPopup(subcategory._id);
                                                                setEditSubcategoryName(subcategory.name)
                                                            }}>Edit</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowSubcategories(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}

                            {/* Edit Subcategory Modal */}
                            <Modal show={showEditSubcategoryModal} onHide={() => setShowEditSubcategoryModal(false)} backdrop="static" centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Subcategory</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Form.Group controlId="formEditSubcategoryName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editSubcategoryName}
                                                    onChange={(e) => setEditSubcategoryName(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <Form.Group controlId="formEditSubcategoryPicture">
                                            <Form.Label>Picture : </Form.Label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleCategoryPictureChangeEdit(e.target.files[0])}
                                            />
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
                                    <Modal.Title>Add Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Form.Group controlId="formCategoryName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={addCategoryName}
                                                    onChange={(e) => setAddCategoryName(e.target.value)}
                                                />
                                            </Form.Group> </div>
                                        <Form.Group controlId="formCategoryPicture">
                                            <Form.Label>Picture : </Form.Label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleCategoryPictureChange(e.target.files[0])}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowAddCategoryModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={() => handleAddCategory(addCategoryName, addCategoryPictureFile)}>
                                        Add
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Edit Category Modal */}
                            <Modal show={showEditCategoryModal} onHide={() => setShowEditCategoryModal(false)} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Form.Group controlId="formEditCategoryName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editCategoryName}
                                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <Form.Group controlId="formEditCategoryPicture">
                                            <Form.Label>Picture : </Form.Label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleCategoryPictureEdit(e.target.files[0])}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowEditCategoryModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            handleEditCategory(editCategoryId, editCategoryName, editCategoryPictureFile)
                                        }
                                    >
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {/* Add Subcategory Modal */}
                            <Modal show={showAddSubcategoryModal} onHide={() => setShowAddSubcategoryModal(false)}  centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add Subcategory</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Form.Group controlId="formSubcategoryName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={addSubcategoryName}
                                                    onChange={(e) => setAddSubcategoryName(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <Form.Group controlId="formSubcategoryPicture">
                                            <Form.Label>Picture : </Form.Label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleSubCategoryPictureAdd(e.target.files[0])}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowAddSubcategoryModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={() => handleAddSubcategory(editCategoryId, addSubcategoryName, addSubCategoryPictureFile)}>
                                        Add
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </Tab>
                    <Tab eventKey="reclamations" title="Reclamations">
                        <div className="m-2" style={{minHeight:"350px"}}>
                            <h2 style={{ color: 'black' }}>Reclamations</h2>
                            <p>Total Reclamations: {reclamationsCount}</p>
                            <Table striped bordered hover style={{ borderColor: 'lightgray' }}>
                                <thead className='bg-dark text-white'>
                                    <tr>
                                        <th>#</th>
                                        <th>Ad Title</th>
                                        <th>Username</th>
                                        <th>Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map over your reclamations data and render each row */}
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
            </div ><Footer />
        </div>
    );
}

export default AdminControl;