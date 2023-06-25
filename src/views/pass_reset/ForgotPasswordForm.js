import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/protected", {
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
      const response = await fetch('http://localhost:8080/user/reset', {
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
      <div class="d-flex justify-content-center align-items-center my-5">
        <div class="container-fluid" >
          <div class="row justify-content-center">
            <div class="col-lg-4 border border-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
                <h2 class="my-4 d-block" style={{ margin: "10px" }}>Mot de passe oublié:</h2>
                <p>Entrer votre E-mail:</p>
                <input
                  type="email"
                  placeholder="Email"
                  style={{ marginBottom: '10px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control my-3"
                />
                <button type="submit" class="btn btn-primary my-3">
                  Valider
                </button>
              </form>
              <p style={{ color: 'red' }}>{message}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="my-5 container"><span class="d-block" style={{ height: "50px" }}></span></div>
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default ForgotPasswordForm;

