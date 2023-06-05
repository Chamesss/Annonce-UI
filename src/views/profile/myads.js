import React, { useEffect, useState } from 'react';
import Product from '../../components/product';
import { Button } from "react-bootstrap";
import EditAd from './EditAd';

function MyAds({ user }) {
    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editAd, setEditAd] = useState(null); // State to handle rendering EditAd component

    useEffect(() => {
        // Fetch ads based on user._id
        fetchAds(user._id);
    }, [user._id]);

    // Function to fetch ads by user ID
    const fetchAds = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/ad/get`, {
                method: 'GET',
                headers: { authorization: `Bearer ${token}`, searchquery: '', categoryid: '', subcategoryid: '', locationid: '' },
            });
            const data = await response.json();
            setAds(data.ads);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSwitchAdPage = (ad) => {
        setEditAd(ad); // Set the selected ad in state to render EditAd component
    }

    const handleCancelEdit = () => {
        setEditAd(null); // Clear the selected ad in state to hide EditAd component
    }

    return (
        <div className="container mx-5">
            <h2 >My ads</h2>
            {ads && !editAd ? ( // Render the ads if available and EditAd component is not active
                <div class="mt-5">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 ">
                        {ads.map((ad) => (
                            <div className="col mb-4 d-flex flex-column justify-content-center align-items-center">
                                <div onClick={() => handleSwitchAdPage(ad)} >
                                    <Product key={ad.id} product={ad} />
                                </div>
                                <Button onClick={() => handleSwitchAdPage(ad)}>Edit Ad</Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : editAd ? ( // Render EditAd component if an ad is selected
                <div>
                    <EditAd ad={editAd} />
                    <Button onClick={handleCancelEdit} >Cancel</Button>
                </div>
            ) : (
                <div></div>
            )}
            {message && <p className="">{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default MyAds;