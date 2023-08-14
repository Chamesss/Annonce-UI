import React, { useEffect, useState } from 'react';
import Product from '../../components/product';
import { Button } from "react-bootstrap";
import EditAd from './EditAd';
import Spinner from '../../components/Spinner';
import { AiFillEdit } from 'react-icons/ai';
import './css/myads.css';

/* eslint-disable react-hooks/exhaustive-deps */

function MyAds({ user }) {
    const [ads, setAds] = useState([]);
    const [message, setMessage] = useState('');
    const [editAd, setEditAd] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [editAd]);

    useEffect(() => {
        fetchAds(currentPage);
    }, []);

    const fetchAds = async (currentPage) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://annonce-backend.azurewebsites.net/ad/specific?page=${currentPage}`, {
                method: 'GET',
                headers: { id: user._id },
            });
            const data = await response.json();
            if (data.success === true) {
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
        setEditAd(ad);
    }

    const handleCancelEdit = () => {
        setEditAd(null);
    }

    return (
        <div className="">
            {message && <p className="d-flex justify-content-center align-items-center">{message}</p>}
            {isLoading && <div style={{ marginTop: "50px" }}><Spinner /></div>}

            { editAd ? (
                <div style={{padding:"10px", marginTop:"50px"}}>
                    <EditAd ad={editAd} />
                    <Button onClick={handleCancelEdit} >Retourner</Button>
                </div>
            ): ads.length > 0 && (
                <div class="myads-main">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 ">
                        {ads.map((ad) => (
                            <div className="col mb-4 d-flex flex-column justify-content-center align-items-center">
                                <div onClick={() => handleSwitchAdPage(ad)} >
                                    <Product key={ad.id} product={ad} />
                                </div>
                                <div style={{ margin: "10px" }}>
                                    <div className="button profile-edit-button" onClick={() => handleSwitchAdPage(ad)}><AiFillEdit /></div>
                                </div>
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
            )}
        </div>
    );
}

export default MyAds;