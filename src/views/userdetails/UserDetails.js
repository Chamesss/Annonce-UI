import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Category from '../../components/category';
import Footer from '../../components/footer';
import ProductList from '../../components/productList';
import { FaChevronLeft } from 'react-icons/fa';
import { FaMapMarkerAlt, FaCity, FaPhoneAlt, FaHome, FaBuilding } from "react-icons/fa";
import Spinner from '../../components/Spinner';

/* eslint-disable react-hooks/exhaustive-deps */

const UserDetailsPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
        fetchAds();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('https://annonce-backend.azurewebsites.net/user/getuserdetails', {
                method: "GET",
                headers: { id: userId },
            })
            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchAds = async () => {
        try {
            const response = await fetch('https://annonce-backend.azurewebsites.net/ad/specific?Page=1', {
                method: "GET",
                headers: { id: userId },
            })
            const data = await response.json();
            setAds(data.ads);
        } catch (error) {
            console.log(error);
        }
    }

    const handleGoBack = () => {
        navigate(-1);
    };


    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <Category />
            <div className="p-3" onClick={handleGoBack} style={{ transform: "translateY(50%)" }}>
                <FaChevronLeft className="carousel-arrow" />
            </div>
            {user && (
                <div class="container d-flex justify-content-center align-items-center py-5">
                    <div class="row justify-content-center ">
                        <div class=" profile-picture border border-2 rounded-circle shadow-lg p-3 mb-1 bg-white rounded" style={{ width: '150px', height: '150px' }}>
                            <img src={user.picture} alt="Profile" class="rounded-circle" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div class="text-center pt-2 fs-5" >
                            <span class="badge badge-pill bg-secondary">{user.firstname} {user.lastname}</span>
                        </div>
                        <div class="px-4 py-1">
                            <hr class="my-4" style={{ borderWidth: '4px', fontWeight: 'bold' }} />
                            <div class="col-lg-8">
                                <div>
                                    {user.type === "individual" ? (
                                        <div><p><FaHome /><strong> Type: </strong>Individuelle</p></div>
                                    ) : (<div><p><FaBuilding /><strong> Type: </strong>Entreprise</p></div>)}
                                    <p><FaPhoneAlt /><strong> Telephone:</strong> +216 {user.tel}</p>
                                    <p><FaMapMarkerAlt /><strong> Région:</strong> {user.country} </p>
                                    <p><FaCity /><strong> Ville:</strong> {user.city}</p>
                                    <p><FaMapMarkerAlt /><strong> Rejoint à:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div class="d-flex justify-content-center align-items-center">
                <hr class="my-4" style={{ width: '90%', borderWidth: '4px', fontWeight: 'bold' }} />
            </div>
            {user && (
                <div class="container pb-5">
                    <h3 style={{ color: "#D85A60" }}>Autre Annonces de <strong>{user.firstname}</strong>:</h3>
                </div>
            )}
            <div>
                {ads.length > 0 ? (
                    <div>
                        <ProductList products={ads} />
                    </div>
                ) : (
                    <div><Spinner /></div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserDetailsPage;