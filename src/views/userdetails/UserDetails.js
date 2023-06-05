import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header';
import Category from '../../components/category';
import Footer from '../../components/footer';
import ProductList from '../../components/productList';
import { FaMapMarkerAlt, FaCity, FaPhoneAlt, FaHome, FaBuilding, FaUser } from "react-icons/fa";

const UserDetailsPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);

    useEffect(() => {
        fetchUserDetails();
        console.log('pzdd');
        fetchAds();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/getuserdetails', {
                method: "GET",
                headers: { id: userId },
            })
            const data = await response.json();
            setUser(data.user);
            console.log('hehehe')
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchAds = async () => {
        try {
            const response = await fetch('http://localhost:8080/ad/specific', {
                method: "GET",
                headers: { id: userId },
            })
            const data = await response.json();
            setAds(data.ad);
        } catch (error) {
            console.log(error);
        }
    }



    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <Category />
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
                                    <div><p><FaHome /><strong> Type: </strong>Individual</p></div>
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
            <div class="d-flex justify-content-center align-items-center">
                <hr class="my-4" style={{ width: '90%', borderWidth: '4px', fontWeight: 'bold' }} />
            </div>
            <div class="container pb-5">
                <h3 style={{ color: "#D85A60" }}>Autre Annonces de <strong>{user.firstname}</strong>:</h3>
            </div>
            <div >
                {ads.length > 0 ? (
                    <div>
                        <ProductList products={ads} />
                    </div>
                ) : (
                    <p>No products available</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserDetailsPage;