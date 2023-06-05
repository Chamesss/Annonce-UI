import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Button } from "reactstrap";
import Product from "../../components/product";
import { Toast } from 'react-bootstrap';

function FavoritePage(user) {
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState("");
    const [empty, setEmpty] = useState(false);


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

    const fetchFavorites = async (user) => {
        try {
            const response = await fetch(`http://localhost:8080/ad/getfavorites/${user._id}`);
            const data = await response.json();
            if (data.success === true) {
                if (data.state === true) {
                    setFavorites(data.favorites);
                } else {
                    setEmpty('No favorites ads yet..')
                }
            }
        } catch (error) {
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
                console.log('deleted sucess');
                fetchFavorites(user.user);
                setMessage("Deleted from favorites");

            } else {
                console.log('failed');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-5">
            <h2>Favorite Products</h2>
            {message && (
                <div className="success text-success p-1">
                    {message}
                </div>
            )}
            {empty ? (
                <div className="p-5">
                    {empty}
                </div>
            ) : (
                <div>
                    {favorites && (
                        <Row>
                            {favorites.map((favorite) => (
                                <Col key={favorite.id} sm="6" md="3" className="mb-4">
                                    <Product product={favorite} />
                                    <Button
                                        color="danger"
                                        onClick={() => handleDeleteFavorite(favorite._id)}
                                    >
                                        Delete Favorite
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    )} </div>)}

        </div>
    );
}

export default FavoritePage;