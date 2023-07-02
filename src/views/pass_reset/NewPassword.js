import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';

/* eslint-disable react-hooks/exhaustive-deps */

const NewPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

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

  useEffect(() => {
    if (confirmed) {
      const timeout = setTimeout(() => {
        navigate('/login');
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [confirmed]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://annonce-backend.azurewebsites.net/user/edituser/null/null`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname: null, lastname: null, email: email, oldPassword: null, newPassword: password, tel: null, type: null, uncheck: true })
      });
      const data = await response.json();
      if (data.success) {
        setErrorMessage('');
        setConfirmed('Le mot de passe a été changé.. redirection vers la page de connexion..')
      } else {
        setErrorMessage('Échec de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Échec de la réinitialisation du mot de passe. ' + error);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div>
      <div className="header h-100">
        <Header />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="container-fluid mb-5" >
          <div className="row justify-content-center">
            <div className="col-lg-4 border border-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
                <h2 className="my-4 d-block" style={{ margin: "10px" }}>Réinitialiser le mot de passe</h2>
                <div>
                  <label htmlFor="password">Nouveau mot de passe:</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-control my-3"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe:</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="form-control my-3"
                  />
                </div>
                <button
                  type="submit"
                  disabled={password !== confirmPassword}
                  className="btn btn-primary my-3"
                >
                  Valider
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {confirmed && <p style={{ color: 'green' }}>{confirmed}</p>}
              </form>
            </div>
          </div>
        </div>
        <div className="my-5 container"><span className="d-block" style={{ height: "50px" }}></span></div>
      </div>

      <div>
        <Footer />
      </div>
    </div >
  );
};

export default NewPasswordPage;