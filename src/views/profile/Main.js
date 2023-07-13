import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import './css/main.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Favorites from "./favorites";
import Category from '../../components/category';
import Profile from './profile';
import EditProfile from "./EditProfile";
import MyAds from "./myads";
import Spinner from "../../components/Spinner";

/* eslint-disable react-hooks/exhaustive-deps */

function Main() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [starteditprofile, setStartEditProfile] = useState(false);
  const location = useLocation();
  const sectionParams = new URLSearchParams(location.search);
  const [selectedOption, setSelectedOption] = useState(sectionParams.get('section'));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const sectionParams = new URLSearchParams(location.search);
    const keyword = sectionParams.get('section');


    if (user) {
      if (keyword) {
        setSelectedOption(keyword);
      } else {
        setSelectedOption("profile");
      }
    }
  }, [user]);


  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  const handleSwitchProfile = () => {
    setStartEditProfile(!starteditprofile);
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://annonce-backend.azurewebsites.net/protected', {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (data.status) {
          const innerResponse = await fetch(`https://annonce-backend.azurewebsites.net/user/getuserdetails`, {
            method: "GET",
            headers: { id: data.userId }
          });
          const innerData = await innerResponse.json();
          if (innerData.status === true) {
            setUser(innerData.user);
            setIsLoading(false);
          } else {
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case "ads":
        return (
          <div className="container d-flex justify-content-center align-items-center">
            <div className="content p-5">
              <MyAds user={user} />
            </div>
          </div>
        );
      case "favorites":
        return (
          <div className="container d-flex justify-content-center align-items-center">
            <div className="content p-5">
              {user !== null ? (<Favorites user={user} />) : (null)}
            </div>
          </div>
        );
      case "profile":
      default:
        return (
          <div className="container justify-content-center align-items-center">
            {starteditprofile === false ? (
              <div className="container justify-content-center align-items-center py-5">{user !== null ? (
                <div>
                  <Profile userinfo={user} />
                  <div className="d-flex justify-content-center pl-5">
                    <Button onClick={() => handleSwitchProfile()}>Editer le profil</Button>
                  </div>
                </div>

              ) : (null)}

              </div>
            ) : (<div className="container justify-content-center align-items-center py-5">{user !== null ? (
              <div>
                <EditProfile userinfo={user} />
                <div className="d-flex justify-content-center pl-5">
                  <Button onClick={() => handleSwitchProfile()}>Retourner</Button>
                </div>
              </div>

            ) : (null)}

            </div>)}
          </div>
        );
    }
  };


  return (
    <div>

      <div>

      </div>
      <div className="main-page-container">
        <div className="header-container-main">
          <Header />
          <Category />
        </div>
        <div className="main-sidebar">
          <ul>
            <li className="" onClick={() => setSelectedOption("profile")}>Mon Profile</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="" onClick={() => setSelectedOption("ads")}>Mes Annonces</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="" onClick={() => setSelectedOption("favorites")}>Mes Favoris</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="" onClick={handleLogout}>Se déconnecter</li>
          </ul>
        </div>
        <div className="page-container">
          {isLoading && (<div className="content"><Spinner /></div>)}
          {user && selectedOption && (
            <div className="content">
              {renderContent()}
            </div>
          )}
        </div>
      </div>
      <div class="position-relative z-index-2">
        <Footer />
      </div>
    </div>
  );
}

export default Main;