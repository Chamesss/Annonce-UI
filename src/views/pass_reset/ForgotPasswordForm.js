import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Categories from '../../components/category';
import Footer from '../../components/footer';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

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
      console.log(data);
      if (data.success === true) {
        setMessage('Password reset link sent to your email.');
        navigate('/reset-code', { state: { email } });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error(error.error);
      setMessage('Failed to send password reset link. '+ error);
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
            <div class="col-lg-4 border border-4" style={{ borderRadius:"20px"}}>
              <form onSubmit={handleSubmit}>
                <h2 class="my-4 d-block" style={{margin:"10px"}}>Forgot Password:</h2>
                <p>Enter your E-mail:</p>
                <input
                  type="email"
                  placeholder="Email"
                  style={{ marginBottom: '10px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control my-3"
                />
                <button type="submit" class="btn btn-primary my-3">
                  Submit
                </button>
              </form>
              <p style={{ color: 'red' }}>{message}</p>
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

export default ForgotPasswordForm;

