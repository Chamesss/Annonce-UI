import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import "./css/forgotpasswordform.css";

/* eslint-disable react-hooks/exhaustive-deps */

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      const response = await fetch("https://annonce-backend.azurewebsites.net/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status === true) {
        navigate('/');
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handlelogin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/user/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json()
      if (data.success === true) {
        setMessage('Lien de réinitialisation du mot de passe envoyé à votre adresse e-mail.');
        navigate('/reset-code', { state: { email } });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error(error.error);
      setMessage('Échec de le envoi du lien de réinitialisation du mot de passe. ' + error);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="forgotpasswordform">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="forgotpasswordform-image-container">
              <img src="https://img.freepik.com/premium-vector/bronze-lock-icon-white-background-flat-design-illustration-stock-vector-graphics_668389-92.jpg" alt="forgot-banner" className="forgotpasswordform-image" />
            </div>
            <h3>Trouble logging in?</h3>
            <span>Enter you email and we'll send</span>
            <span>you a link to get back your account.</span>
            <div className="forgotpasswordform-input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control forgotpasswordform-input"
              />
            </div>
            <div className="forgotpasswordform-button-container">
              <button type="submit" className="btn btn-primary forgotpasswordform-button">
                Validate
              </button>
              <p style={{ color: 'red', marginTop:'5px' }}>{message}</p>
            </div>
          </div>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default ForgotPasswordForm;

