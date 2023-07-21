import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';
import Header from '../components/header';
import Footer from '../components/footer';
import photo from '../images/welcome-sign.svg';

/* eslint-disable react-hooks/exhaustive-deps */

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState(false);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (welcome) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [welcome]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === '' || password === '') {
      setError('Please enter both email and password');
      setLoading(false);
      return
    } else {
      try {
        const response = await fetch(`https://annonce-backend.azurewebsites.net/user/login`, {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success === true) {
          localStorage.setItem('token', data.token);
          setLoading(false);
          setWelcome(true);
          setError('');
        } else {
          setError(data.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error('Login failed:', error.message);
        setError('Failed to login. Please try again later.');
      }
    }
  };

  const handleForgetPasswordNav = () => {
    navigate('/forgot-password');
  }

  const handleCreateAccountNav = () => {
    navigate('/create-account');
  }

  return (
    <div>
      <div>
        <Header />
      </div>
      <div class="container-form-login">
        <div className="login-form">
          <h2>Login to your account</h2>
          <p>Don't have an account? &nbsp; <span onClick={handleCreateAccountNav} className="sign-up"> Sign Up Now!</span></p>
          <div className="picture-logo-container">
            <img src="https://seeklogo.com/images/F/facebook-icon-circle-logo-09F32F61FF-seeklogo.com.png" alt="facebook logo" className="picture-logo" />
            <img src="https://seeklogo.com/images/G/google-logo-28FA7991AF-seeklogo.com.png" alt="google logo" className="picture-logo" />
          </div>
          <div className="hr-line">
            <hr className="hr-line-main" />
            <div className="hr-cut">
              <span>OR</span>
            </div>
          </div>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-form email-input"
            style={{margin:"0.8rem"}}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-form email-input"
            style={{margin:"0.8rem"}}
            required
          />
          {error && <div className="text-danger">{error}</div>}
          <button
            color="primary"
            onClick={handleLogin}
            type="submit"
            className="login-button-submit"
          > {Loading ?
            (
              <div className="spinner"></div>
            ) : welcome ? (
              <>
                Welcome, Redirecting..
              </>
            ) : (
              <>
                Login
              </>
            )
            }
          </button>
          <p>
            Forgot your password?&nbsp;<span onClick={handleForgetPasswordNav} className="sign-up">Click here</span>
          </p>
        </div>
        <div className="login-banner-container">
          <img src={photo} alt="login-banner" className="login-banner" />
        </div>
      </div> <Footer />
    </div >
  );
};

export default LoginPage;

