import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaUser, FaHeart, FaQuestionCircle, FaSignOutAlt, FaToolbox, FaFolderOpen, FaDoorOpen, FaUserPlus } from "react-icons/fa";
import { VscBellDot, VscBell } from "react-icons/vsc";
import { TiPlus } from "react-icons/ti";
import "./css/Header.css";
import SearchBar from "./searchBar";

/* eslint-disable react-hooks/exhaustive-deps */

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
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
          > <div className="profile-section">
              <TiPlus className="button-icon" />
              <span>Create Ad</span>
            </div>
          </Button>
        </div>
        {isAuthenticated ? (
          <>
            <div className="logos">
              <div className="heart-icon" onClick={handleLinkClick}>
                <FaHeart />
              </div>
            </div>
            <div className="logos">
              <div className="location-icon" onClick={handleMyAds}>
                <FaFolderOpen />
              </div>
            </div>
            <div className="orginize">
              {seen ? (
                <div className="logos">
                  <div className="bell-icon" onClick={handleMyNotfs}>
                    <VscBell />
                  </div>
                </div>
              ) : (
                <div className="logos">
                  <div className="bell-icon-unseen" onClick={handleMyNotfs}>
                    <VscBellDot />
                  </div>
                </div>
              )}

              {showNotfbar && (
                <div>
                  <nav className="notification-navbar">
                    <div>
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

          </>
        ) : (
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
        {isAuthenticated && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="profile-section">
              <div className="ms-3">
                {user.picture && (
                  <div className="profile-picture-container">
                    <img
                      src={user.picture}
                      alt={user.firstname}
                      className="profile-picture"
                    />
                  </div>
                )}
              </div>
            </div>
            {showNavbar && (
              <div>
                <nav className="small-navbar">
                  <a href="/profile">
                    <FaUser /> Mon Profile
                  </a>
                  {isAdmin && (
                    <a href="/adminpanel">
                      <FaToolbox /> Administration
                    </a>
                  )}
                  <p onClick={handleMyAds}>
                    <FaFolderOpen /> Mes Annonces
                  </p>
                  <p onClick={handleLinkClick}>
                    <FaHeart /> Favoris
                  </p>
                  <a href="/help">
                    <FaQuestionCircle /> FAQs
                  </a>
                  <p style={{ color: "red" }} onClick={handleLogout}>
                    <FaSignOutAlt /> Se déconnecter
                  </p>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </header >
  );
}

export default Header;