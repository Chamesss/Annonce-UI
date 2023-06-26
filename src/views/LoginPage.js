import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import './css/LoginPage.css';
import Header from '../components/header';
import Footer from '../components/footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (welcome) {
      // Wait for 5 seconds before navigating to another page
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

    // Add your login logic here using email and password state values
    if (email === '' || password === '') {
      setError('Please enter both email and password');
    } else {
      try {
        // Make API request to login endpoint with email and password 
        const response = await fetch(`https://annonce-backend.azurewebsites.net/user/login`, {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // Check if login was successful
        const data = await response.json();
        if (data.success == true) {
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
      <div className="header">
        <Header />
      </div>
      <div class="container">
        <div className="d-flex justify-content-end align-items-center">
          <div className="mt-5" style={{ width: "400px", height: " 400px" }}>
            <h2 className="text-center mb-4">Connexion</h2>
            <Form>
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
              {error && <div className="text-danger mb-3">{error}</div>}
              {welcome && <div className="text-success mb-3">Bienvenue, rediriger..</div>}
              <Button
                color="primary"
                onClick={handleLogin}
                style={{ width: '100%' }}
                type="submit"
              >
                Login
              </Button>
            </Form>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Mot de passe oublié? <a href="/forgot-password" style={{ color: 'blue' }}>
              Cliquez ici
              </a>
            </p>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              <a href="/create-account" style={{ color: 'blue' }}>
              Créer un compte
              </a>
            </p>
          </div>
          <div class="col-lg-6 mx-5" style={{ overflow: "hidden" }}>
            <img src="http://res.cloudinary.com/dncjxhygd/image/upload/v1685627659/ugzsl8zelozm54dwrw8r.jpg" style={{ width: "100%", height: "auto", border: "none", borderRadius: "70%" }} />
          </div>
        </div>
      </div> <Footer />
    </div >
  );
};

export default LoginPage;

