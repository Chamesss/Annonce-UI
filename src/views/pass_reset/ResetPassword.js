import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (data.success === true) {
        setMessage('Reset code verified successfully.');
        navigate('/new-password', { state: { email } });
      } else {
        setError('Failed to verify reset code.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to verify reset code.');
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
              <h2 class="my-4 d-block" style={{margin:"10px"}}>Reset Code</h2>
              <p>Confirmation code has been sent to your E-mail:</p>
                <input
                  type="text"
                  placeholder="Reset Code"
                  value={code}
                  onChange={(e) => setResetCode(e.target.value)}
                  class="form-control my-3"
                />
                <button type="submit" class="btn btn-primary my-3">
                  Submit
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

