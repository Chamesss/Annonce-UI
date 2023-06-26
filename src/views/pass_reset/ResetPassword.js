import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';

const ResetCodeForm = () => {
  const [code, setResetCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (data.success === true) {
        setMessage('Code de réinitialisation vérifié avec succès.');
        navigate('/new-password', { state: { email } });
      } else {
        setError('Échec de la vérification du code de réinitialisation.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Échec de la vérification du code de réinitialisation.');
    }
  };

  return (
    <div>
      <div className="header h-100">
        <Header />
      </div>
      <div class="d-flex justify-content-center align-items-center my-5 h-100">
        <div class="container-fluid" >
          <div class="row justify-content-center">
            <div class="col-lg-4 border border-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
              <h2 class="my-4 d-block" style={{margin:"10px"}}>Code de réinitialisation</h2>
              <p>Le code de confirmation a été envoyé à votre adresse e-mail:</p>
                <input
                  type="text"
                  placeholder="Reset Code"
                  value={code}
                  onChange={(e) => setResetCode(e.target.value)}
                  class="form-control my-3"
                />
                <button type="submit" class="btn btn-primary my-3">
                  Valider
                </button>
              </form>
              {message && <p style={{ color: 'green' }}>{message}</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </div>
      </div>
      <div class="my-5 container"><span class="d-block" style={{height:"50px"}}></span></div>
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default ResetCodeForm;

