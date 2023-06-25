import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Button } from "reactstrap";
import Product from "../../components/product";
import Spinner from '../../components/Spinner';
import { useNavigate } from "react-router-dom";

function FavoritePage(user) {
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState("");
    const [empty, setEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);


    useEffect(() => {
        fetchFavorites(user.user);
    }, [user]);

    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => {
                setMessage("");
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [message]);

    const handleProductClick = (product) => {
        navigate(`/annonce/${product._id}`);
    };

    const fetchFavorites = async (user) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8080/ad/getfavorites/${user._id}`);
            const data = await response.json();
            if (data.success === true) {
                setIsLoading(false);
                if (data.state === true) {
                    setFavorites(data.favorites);
                } else {
                    setEmpty('Pas encore des annonces favorites..')
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleDeleteFavorite = async (favoriteId) => {
        try {
            const innerResponse = await fetch(`http://localhost:8080/ad/deletefavorite/${user.user._id}/${favoriteId}`, {
                method: "DELETE",
            });
            const innerData = await innerResponse.json();
            if (innerData.success === true) {
                fetchFavorites(user.user);
                setMessage("Supprimé des favoris");
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } else {
                console.log('failed');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-4 mb-5">
            <h2>Produits favoris</h2>
            {isLoading && <div><Spinner /></div>}
            {message && (
                <p className="success text-success p-1">
                    {message}
                </p>
            )}
            {empty ? (
                <p className="d-flex justify-content-center align-items-center mt-5">
                    {empty}
                </p>
            ) : (
                <div>
                    {favorites && (
                        <div class="mt-5">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 ">
                                {favorites.map((favorite) => (
                                    <div key={favorite.id} sm="6" md="3" className="mb-4" >
                                        <div onClick={() => handleProductClick(favorite)}>
                                            <Product product={favorite} />
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-2">
                                            <Button
                                                color="danger"
                                                onClick={() => handleDeleteFavorite(favorite._id)}
                                            >
                                                Supprimer le favori
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} </div>)
            }

        </div >
    );
}

export default FavoritePage;