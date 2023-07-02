import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaUser, FaHeart, FaQuestionCircle, FaSignOutAlt, FaToolbox, FaFolderOpen, FaDoorOpen, FaUserPlus, FaBell } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import "./css/Header.css";
import SearchBar from "./searchBar";

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

  const handleMouseEnter = () => {
    setShowNavbar(true);
  };

  const handleMouseLeave = () => {
    setShowNavbar(false);
  };

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

  return (
    <header className="header-transition">
      <div className="logo-container">
        <h1
          className="logo"
          onClick={navigatehome}
        >
          Annonce
        </h1>
      </div>
      <div className="search">
        <SearchBar
        />
      </div>
      <div className="buttons-container">
        <div className="alignement-items">
          <Button
            variant="primary"
            className="create-ad-button"
            onClick={handleCreateAdClick}
            title="Create ad"
          >
            <TiPlus />
            Create Ad
          </Button>
        </div>
        <div className="profile-items">
          {isAuthenticated && (
            <>
              <div className="logos">
                <div className="heart-icon" title="My favorites" onClick={handleLinkClick}>
                  <FaHeart />
                </div>
                <div className="location-icon" title="My ads" onClick={handleMyAds}>
                  <FaFolderOpen />
                </div>
                {seen ? (
                  <div className="bell-icon" title="Notifications" onClick={handleMyNotfs}>
                    <FaBell />
                  </div>
                ) : (
                  <div className="bell-icon bell-icon-unseen" title="Notifications" onClick={handleMyNotfs}>
                    <FaBell />
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
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="profile-section">
                    <div>
                      {user.picture && (
                        <div className="profile-picture-container">
                          <img
                            src={user.picture}
                            alt={user.firstname}
                            className="profile-picture"
                            onClick={handleOpenAndClose}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      {showNavbar && (
                        <div>
                          <nav className="small-navbar">
                            <div className="head-nav-section">
                              <img src={user.picture} alt={user.firstname} className="profile-picture-container" onClick={handleNavigateProfile}/>
                              <p onClick={handleNavigateProfile}>{user.firstname}</p>
                            </div>
                            <div className="body-nav-section">
                              <p onClick={handleNavigateProfile}>
                                <FaUser /> My Profile
                              </p>
                              {isAdmin && (
                                <p href="/adminpanel">
                                  <FaToolbox /> Administration
                                </p>
                              )}
                              <p onClick={handleMyAds}>
                                <FaFolderOpen /> My Ads
                              </p>
                              <p onClick={handleLinkClick}>
                                <FaHeart /> Favorites
                              </p>
                              <p href="/help">
                                <FaQuestionCircle /> FAQs
                              </p>
                              <p style={{ color: "red" }} onClick={handleLogout}>
                                <FaSignOutAlt /> Log Out
                              </p>
                            </div>
                          </nav>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {isNotAuthenticated && (
            <>
              <button
                variant="primary"
                className="btn login-btn"
                onClick={handleLoginClick}
              ><span>Login</span>
                <div className="no-variants">
                  <FaDoorOpen />
                  <p>Login</p>
                </div>
              </button>
              <button
                variant="primary"
                className="btn login-btn"
                onClick={() => navigate("/create-account")}
              ><span>Sign Up</span>
                <div className="no-variants">
                  <FaUserPlus />
                  <p>Sign Up</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </header >
  );
}

export default Header;