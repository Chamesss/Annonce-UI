import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaUser, FaHeart, FaQuestionCircle, FaSignOutAlt, FaToolbox, FaFolderOpen } from "react-icons/fa";
import { VscBellDot, VscBell } from "react-icons/vsc";
import { TiPlus } from "react-icons/ti";
import "./css/Header.css";
import SearchBar from "./searchBar";

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
        const response = await fetch("http://localhost:8080/user/getuser", {
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
      const response = await fetch(`http://localhost:8080/getnotifications/`, {
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
      const response = await fetch('http://localhost:8080/getnotifications/seen', {
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
          style={{ cursor: 'pointer', fontFamily: 'Helvetica', color: "#D85A60", fontWeight: "560", fontSize: "30px" }}
        >
          Annonce
        </h1>
      </div>
      <div className="search">
        <SearchBar
        />
      </div>
      <div className="buttons-container">
        <Button
          variant="primary"
          className="btn btn-primary create-ad-button"
          onClick={handleCreateAdClick}
        >
          <TiPlus className="button-icon" />
          <span>Publier Annonce</span>
        </Button>
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
            <Button
              variant="primary"
              className="login-btn"
              onClick={handleLoginClick}
            >
              Connexion
            </Button>
            <Button
              variant="primary"
              className="login-btn"
              onClick={() => navigate("/create-account")}
            >
              S'inscrire
            </Button>
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
                  <a href="#" onClick={handleMyAds}>
                    <FaFolderOpen /> Mes Annonces
                  </a>
                  <a href="#" onClick={handleLinkClick}>
                    <FaHeart /> Favoris
                  </a>
                  <a href="/help">
                    <FaQuestionCircle /> FAQs
                  </a>
                  <a href="#" style={{ color: "red" }} onClick={handleLogout}>
                    <FaSignOutAlt /> Se déconnecter
                  </a>
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