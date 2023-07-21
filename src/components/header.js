import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaQuestionCircle, FaBars, FaSignOutAlt, FaToolbox, FaFolderOpen, FaTimes } from "react-icons/fa";
import { AiFillHeart } from 'react-icons/ai';
import { TiPlus } from "react-icons/ti";
import { IoNotifications } from "react-icons/io5"
import "./css/Header.css";
import SearchBar from "./searchBar";
import Category from "./category";

/* eslint-disable react-hooks/exhaustive-deps */

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showNotfbar, setShowNotfBar] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);



  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("https://annonce-backend.azurewebsites.net/user/getuser", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.status === true) {
          setUser(data.user);
          setisAdmin(data.user.isAdmin);
          fetchNotifications(token);
          setIsAuthenticated(true);
        } else {
          setIsNotAuthenticated(true);
        }
      } else {
        setIsNotAuthenticated(true);
      }
    } catch (error) {
      setIsNotAuthenticated(true);
      console.error("Error fetching user:", error);
    }
  };

  const fetchNotifications = async (token) => {
    try {
      const response = await fetch(`https://annonce-backend.azurewebsites.net/getnotifications/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotifications(data.notifications);
      setSeen(data.notifications[0].isRead);
    } catch (error) {
      console.error(error);
    }
  }

  const updateNotifications = async (token) => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/getnotifications/seen', {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === true) {
        setSeen(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const navigatehome = () => {
    navigate("/");
  }

  const handleOpenAndClose = () => {
    setShowNavbar(!showNavbar);
  }

  const handleNavigateProfile = () => {
    navigate('/profile');
  }

  const handleCreateAdClick = () => {
    isAuthenticated ? navigate("/create-ad") : navigate("/login");
  };

  const handleMyAds = () => {
    navigate('/profile/?section=' + encodeURIComponent('ads'), { replace: true });
    window.location.reload();
  };

  const handleMyNotfs = () => {
    const token = localStorage.getItem("token");
    fetchNotifications(token);
    updateNotifications(token);
    setShowNotfBar(!showNotfbar);
  };

  const handleLinkClick = () => {
    navigate('/profile/?section=' + encodeURIComponent('favorites'), { replace: true });
    window.location.reload();
  }

  const handleLoginClick = () => {
    navigate("/login");
  };

  function handleLogout() {
    localStorage.removeItem('token');
    setIsNotAuthenticated(true);
    navigate('/login');
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };



  return (
    <div>
      <header className="header-section">
        <div className="header-container">
          <section className="header-logo-container">
            <img src="https://res.cloudinary.com/dncjxhygd/image/upload/v1689206621/vxetssx12gs7bkaumvbe.png" alt="logo" className="header-logo-logo" />
            <span
              className="header-logo"
              onClick={navigatehome}
            >
              Annonce
            </span>
          </section>
          <div className="header-search">
            <SearchBar />
          </div>
          <div className="header-alignement-items">
            <button
              variant="primary"
              className="create-ad-button"
              onClick={handleCreateAdClick}
              title="Create ad"
            >
              <div className="header-create-ad-inner">
                <TiPlus />
                <span>&nbsp;Create Ad</span>
              </div>
            </button>
          </div>
          <div className="buttons-container">
            <div className="profile-items">
              {isAuthenticated && (
                <div className="header-isAuth">
                  <div className="logos">
                    <div className="profile-icons heart-icon" title="My favorites" onClick={handleLinkClick}>
                      <AiFillHeart />
                    </div>
                    <div className="profile-section">
                      {seen ? (
                        <div className="profile-icons bell-icon" title="Notifications" onClick={handleMyNotfs}>
                          <IoNotifications />
                        </div>
                      ) : (
                        <div className="profile-icons bell-icon bell-icon-unseen" title="Notifications" onClick={handleMyNotfs}>
                          <IoNotifications />
                        </div>
                      )}
                      {showNotfbar && (
                        <div>
                          <nav className="notification-navbar">
                            <div className="notification-dropdown active">
                              {notifications.map((notification) => (
                                <div className="notification-container"
                                  key={notification._id}
                                >
                                  {notification.message}
                                </div>
                              ))}
                            </div>
                          </nav>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="header-isAuth-bars">
                    <div className="profile-section">
                      <div>
                        {user.picture ? (
                          <div className="profile-picture-container">
                            <img
                              src={user.picture}
                              alt={user.firstname}
                              className="profile-picture"
                              onClick={handleOpenAndClose}
                            />
                          </div>
                        ) : (
                          <div className="profile-picture-container">
                            <img
                              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                              alt="blank"
                              className="profile-picture"
                              onClick={handleOpenAndClose}
                            />
                          </div>
                        )}
                      </div>
                      {showNavbar && (
                        <div className="fade-in fade-out">
                          <nav className="small-navbar fade-out">
                            <div className="head-nav-section">
                              <div>
                                {user.picture ? (
                                  <img src={user.picture} alt={user.firstname} className="profile-picture-container" onClick={handleNavigateProfile} />
                                ) : (
                                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="blank-pic" className="profile-picture-container" onClick={handleNavigateProfile} />
                                )}
                              </div>
                              <span onClick={handleNavigateProfile}>{user.firstname}</span>
                            </div>
                            <hr />
                            <div className="body-nav-section">
                              <p onClick={handleNavigateProfile}>
                                <FaUser />&nbsp;My Profile
                              </p>
                              {isAdmin && (
                                <p onClick={() => navigate("/adminpanel")}>
                                  <FaToolbox />&nbsp;Administration
                                </p>
                              )}
                              <p onClick={handleMyAds}>
                                <FaFolderOpen />&nbsp;My Ads
                              </p>
                              <p onClick={handleLinkClick}>
                                <AiFillHeart />&nbsp;Favorites
                              </p>
                              <p href="/help">
                                <FaQuestionCircle />&nbsp;FAQs
                              </p>
                              <p style={{ color: "red" }} onClick={handleLogout}>
                                <FaSignOutAlt />&nbsp;Log Out
                              </p>
                            </div>
                          </nav>
                        </div>
                      )}
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              )}
              {isNotAuthenticated && (
                <>
                  <button className="sidebar-bars" onClick={toggleSidebar}>
                    <FaBars />
                  </button>
                  {sidebarVisible && <div><div className="overlay" onClick={toggleSidebar}></div>
                    <div className={`sidebar ${sidebarVisible ? '' : 'visible'}`}>
                      <div className="sidebar-menu">
                        <h2>Menu</h2>
                        <div onClick={toggleSidebar} className="sidebar-icon"><FaTimes /></div>
                      </div>
                      <ul >
                        <li onClick={() => navigate("/login")}>Login</li>
                        <li onClick={() => navigate("/create-account")}>Sign Up</li>
                        <li onClick={() => navigate("/404")}>Contact</li>
                      </ul>
                    </div>
                  </div>
                  }
                  <button
                    variant="primary"
                    className="login-btn"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                  <button
                    variant="primary"
                    className="signup-btn"
                    onClick={() => navigate("/create-account")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div >
        <div className="category-position">
          <Category />
        </div>
      </header >
    </div >
  );
}

export default Header;