import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import './css/Profile.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Favorites from "./favorites";
import Category from '../../components/category';
import Profile from './profile';
import EditProfile from "./EditProfile";
import MyAds from "./myads";

function Main() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("profile");
  const [starteditprofile, setStartEditProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const sectionParams = new URLSearchParams(location.search);
    const keyword = sectionParams.get('section');
    console.log("bisbis", keyword);

    if (keyword) {
      setSelectedOption(keyword);
    } else {
      setSelectedOption("profile");
    }
  }, []);


  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  const handleSwitchProfile = () => {
    setStartEditProfile(!starteditprofile);
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/protected', {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (data.status) {
          const innerResponse = await fetch(`http://localhost:8080/user/getuserdetails`, {
            method: "GET",
            headers: { id: data.userId }
          });
          const innerData = await innerResponse.json();
          if (innerData.status === true) {
            setUser(innerData.user);
            setIsLoading(false);
            console.log('marhaba')
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
            <div className="content">
              <h1 class="mx-5p-5" ></h1>
              <MyAds user={user} />
            </div>
          </div>
        );
      case "favorites":
        return (
          <div className="container d-flex justify-content-center align-items-center">
            <div className="content p-5">
              <h1 class="mx-5"></h1>
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
                    <Button onClick={() => handleSwitchProfile()}>Edit Profile</Button>
                  </div>
                </div>

              ) : (null)}

              </div>
            ) : (<div className="container justify-content-center align-items-center py-5">{user !== null ? (
              <div>
                <EditProfile userinfo={user} />
                <div className="d-flex justify-content-center pl-5">
                  <Button onClick={() => handleSwitchProfile()}>Retour</Button>
                </div>
              </div>

            ) : (null)}

            </div>)}
          </div>
        );
    }
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <Header />
      <div className="header">
        <Category />
      </div>
      <div className="profile-page">
        <div className="sidebar position-fixed " style={{ color: "black", backgroundColor: "rgba(180, 180, 180, 0.5)", height: "150%", top:"20vh" }}>
          <ul >
            <li className="nav-item" style={{ backgroundColor: "rgba(128, 128, 128, 0)" }} onClick={() => setSelectedOption("profile")}>My Profile</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="nav-item" style={{ backgroundColor: "rgba(128, 128, 128, 0)" }} onClick={() => setSelectedOption("ads")}>My Ads</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="nav-item" style={{ backgroundColor: "rgba(128, 128, 128, 0)" }} onClick={() => setSelectedOption("favorites")}>Favorites</li>
            <hr style={{ width: "90%" }}></hr>
            <li className="nav-item" style={{ backgroundColor: "rgba(128, 128, 128, 0)" }} onClick={handleLogout}>Logout</li>
          </ul>
        </div>
        <div className="content" style={{ display: "flex", minHeight: "350px" }}>
          {renderContent()}
        </div>
      </div>
      <div class="position-relative z-index-2">
        <Footer />
      </div>
    </div>
  );
}

export default Main;