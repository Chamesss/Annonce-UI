import React, { useEffect, useState } from 'react';
import Product from '../../components/product';
import { Button } from "react-bootstrap";
import EditAd from './EditAd';
import Spinner from '../../components/Spinner';

function MyAds({ user }) {
    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editAd, setEditAd] = useState(null); // State to handle rendering EditAd component
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);

    useEffect(() => {
        // Fetch ads based on user._id
        fetchAds(currentPage);
    }, []);

    // Function to fetch ads by user ID
    const fetchAds = async (currentPage) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/specific?page=${currentPage}`, {
                method: 'GET',
                headers: { id: user._id },
            });
            const data = await response.json();
            if (data.success = true){
                setIsLoading(false);
                if (data.state) {
                    setTotalPages(data.totalPages);
                    setAds(data.ads);
                } else {
                    setMessage('Aucune annonce pour le moment...');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    function handlePageChange(pageNumber) {
        setAds([]);
        setCurrentPage(pageNumber);
        fetchAds(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleSwitchAdPage = (ad) => {
        setEditAd(ad); // Set the selected ad in state to render EditAd component
    }

    const handleCancelEdit = () => {
        setEditAd(null); // Clear the selected ad in state to hide EditAd component
    }

    return (
        <div className="container mx-4 mb-5">
            <h2>Mes Annonces</h2>
            {message && <p className="d-flex justify-content-center align-items-center mt-5">{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading && <div><Spinner /></div>}
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
                    <div className='d-flex justify-content-center align-items-center'>
                    {totalPages > 1 && (
                        Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))
                    )}
                    </div>
                </div>
            ) : editAd ? ( 
                <div>
                    <EditAd ad={editAd} />
                    <Button onClick={handleCancelEdit} >Retourner</Button>
                </div>
            ) : (
                <div></div>
            )}

        </div>
    );
}

export default MyAds;