import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Spinner from '../../components/Spinner';
import './css/newpassword.css';

/* eslint-disable react-hooks/exhaustive-deps */

const NewPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [email, setEmail] = useState('');
  const [noemail, setNoEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingValid, setloadingValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkEmail = () => {
    if (!location.state || !location.state.email) {
      setTimeout(() => {
        setLoading(false);
        setNoEmail(true);
      }, 500);
    } else {
      setTimeout(() => {
        setEmail(location.state.email);
        setLoading(false);
      }, 500);
    }
  }

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
    checkEmail();
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
    setloadingValid(true);
    if (password.length < 6) {
      setErrorMessage('Length must be greater then 6.');
      setloadingValid(false);
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password doesnt match.');
      setloadingValid(false);
      return
    }
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
        setloadingValid(false);
        setConfirmed('Success. Redirection to login page..')
      } else {
        setloadingValid(false);
        setErrorMessage('Failed.');
      }
    } catch (error) {
      setloadingValid(false);
      console.error(error);
      setErrorMessage('Failed ' + error);
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
      <div>
        <Header />
      </div>
      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div>
          {noemail ? (
            <div className="newpassword-unauthorized">
              <p>Unauthorized Access.</p>
              <p className="newpassword-unauthorized-fallback" onClick={() => navigate('/')}>Go to home page</p>
            </div>
          ) : (
            <div className="newpassword">
              <form onSubmit={handleSubmit}>
                <div className="newpassword-image-container">
                  <img src="https://res.cloudinary.com/dncjxhygd/image/upload/v1688977530/prxma9o809jluiw3fndy.jpg" alt="open-lock" className="newpassword-image" />
                </div>
                <h2>Password reset. </h2>
                <span>Enter your new password:</span>
                <div className="newpassword-submit-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="input-form newpassword-input"
                  />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="input-form newpassword-input"
                  />
                </div>
                <div className="newpassword-submit-container">
                  <button
                    type="submit"
                    disabled={(password !== confirmPassword) || (password.length === 0)}
                    className="button newpassword-submit"
                  >{loadingValid ? (
                    <div className="spinner">
                    </div>
                  ) : (
                    <div>
                      Validate
                    </div>
                  )}
                  </button>
                  {errorMessage && <span style={{ color: 'red', marginTop: '8px' }}>{errorMessage}</span>}
                  {confirmed && <span style={{ color: 'green', marginTop: '8px' }}>{confirmed}</span>}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default NewPasswordPage;