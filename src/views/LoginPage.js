import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import './css/LoginPage.css';
import Header from '../components/header';
import Footer from '../components/footer';

/* eslint-disable react-hooks/exhaustive-deps */

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState(false);

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
    if (email === '' || password === '') {
      setError('Please enter both email and password');
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
          setWelcome(true);
          setError('');
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Login failed:', error.message);
        setError('Failed to login. Please try again later.');
      }
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div class="container-form-login">
        <div className="login-form">
          <h5>Login to your account</h5>
          <p>Don't have an account? <span className="sign-up">Sign Up Now!</span></p>
          <div className="picture-logo-container">
            <img src="https://seeklogo.com/images/F/facebook-icon-circle-logo-09F32F61FF-seeklogo.com.png" className="picture-logo"/>
            <img src="https://seeklogo.com/images/G/google-logo-28FA7991AF-seeklogo.com.png" className="picture-logo" />
          </div>
          <div className="hr-line">
            <hr className="hr-line-main" />
            <div className="hr-cut">
              <span>OR</span>
            </div>
          </div>
          <form>
            <formgroup>
              <label for="email"></label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control email-input"
                required
              />
            </formgroup>
            <formgroup>
              <label for="password"></label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control email-input"
                required
              />
            </formgroup>
            {error && <div className="text-danger mb-3">{error}</div>}
            {welcome && <div className="text-success mb-3">Bienvenue, rediriger..</div>}
          </form>
          <button
            color="primary"
            onClick={handleLogin}
            type="submit"
            className="btn btn-primary login-button-submit"
          >
            Login
          </button>
          <p>
            Mot de passe oublié? <span className="sign-up">
              Cliquez ici
            </span>
          </p>
        </div>
      </div> <Footer />
    </div >
  );
};

export default LoginPage;

