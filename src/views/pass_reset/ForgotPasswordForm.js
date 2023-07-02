import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';

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
      <div className="header h-100">
        <Header />
      </div>
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="container-fluid" >
          <div className="row justify-content-center">
            <div className="col-lg-4 border border-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
                <h2 className="my-4 d-block" style={{ margin: "10px" }}>Mot de passe oublié:</h2>
                <p>Entrer votre E-mail:</p>
                <input
                  type="email"
                  placeholder="Email"
                  style={{ marginBottom: '10px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control my-3"
                />
                <button type="submit" className="btn btn-primary my-3">
                  Valider
                </button>
              </form>
              <p style={{ color: 'red' }}>{message}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 container"><span className="d-block" style={{ height: "50px" }}></span></div>
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default ForgotPasswordForm;

