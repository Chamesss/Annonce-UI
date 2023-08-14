import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './css/main.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Favorites from "./favorites";
import Category from '../../components/category';
import Profile from './profile';
import MyAds from "./myads";
import Spinner from "../../components/Spinner";
import { SlArrowDown } from 'react-icons/sl';
// import { AiFillEdit } from 'react-icons/ai';

/* eslint-disable react-hooks/exhaustive-deps */

function Main() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const sectionParams = new URLSearchParams(location.search);
  const [selectedOption, setSelectedOption] = useState(sectionParams.get('section') || 'profile');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
          <div className="justify-content-center align-items-center">
            <div className="justify-content-center align-items-center">
              {user && (
                <div>
                  <Profile userinfo={user} />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div>
        <Header />
        <Category />
      </div>
      <div className="profile-main">
        <div className="main-page-container">
          <div>
            <div className="main-sidebar">
              <div className={`sidebar-container ${sidebarVisible ? 'sidebar-collapse' : 'sidebar-close'}`}>
                <p style={{ cursor: "pointer" }} onClick={()=> setSidebarVisible(!sidebarVisible)}>Settings &nbsp;
                  <div className="sidebar-trigger">
                    <span className={`arrow-icon ${sidebarVisible ? 'up' : 'down'}`}><SlArrowDown /></span>
                  </div>
                </p>
                <div className="sidebar-mobile">
                  <ul>
                    <li className={`side-bar-selection ${selectedOption === 'profile' ? 'selected-option' : ''}`} onClick={() => setSelectedOption('profile')}>My Profile</li>
                    <li className={`side-bar-selection ${selectedOption === 'ads' ? 'selected-option' : ''}`} onClick={() => setSelectedOption('ads')}>My Ads</li>
                    <li className={`side-bar-selection ${selectedOption === 'favorites' ? 'selected-option' : ''}`} onClick={() => setSelectedOption('favorites')}>My Favorites</li>
                    <li className="side-bar-selection" onClick={handleLogout}>Log out</li>
                  </ul>
                </div>
              </div>
              <div className="sidebar-plain">
                <p>Settings</p>
                <ul>
                  <li className={`side-bar-selection ${selectedOption === "profile" ? "selected-option" : ""}`} onClick={() => setSelectedOption("profile")}>My Profile</li>
                  <li className={`side-bar-selection ${selectedOption === "ads" ? "selected-option" : ""}`} onClick={() => setSelectedOption("ads")}>My Ads</li>
                  <li className={`side-bar-selection ${selectedOption === "favorites" ? "selected-option" : ""}`} onClick={() => setSelectedOption("favorites")}>My Favorites</li>
                  <li className="side-bar-selection" onClick={handleLogout}>Log out</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="main-detailed-page">
            <span className="selected-option-title">
              {selectedOption === "profile"
                ? "Profile"
                : selectedOption === "ads"
                  ? "My Ads"
                  : "My Favorites"}
            </span>
            <div className="page-container">
              {isLoading && (<div><Spinner /></div>)}
              {user && selectedOption && (
                <div>
                  {renderContent()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;