import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import "./css/forgotpasswordform.css";
import { RxReload } from 'react-icons/rx';

/* eslint-disable react-hooks/exhaustive-deps */

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [waitsubmit, setWaitSubmit] = useState(true);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoadingsubmit, setIsLoadingSubmit] = useState('');
  const [isLoadingverif, setIsLoadingVerif] = useState('');
  const [sent, setSent] = useState(false);



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
    setIsLoadingSubmit(true);
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
        setSent(true);
        setError('');
        setIsLoadingSubmit(false);
        setTimeout(() => {
          setSent(false);
          setWaitSubmit(false);
        }, 2000)
      } else {
        setIsLoadingSubmit(false);
        setMessage('');
        setError(data.error);
      }
    } catch (error) {
      console.error(error.error);
      setIsLoadingSubmit(false);
      setMessage('');
      setError('Failed to send password reset link.' + error);
    }
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const updatedDigits = [...digits];
    updatedDigits[index] = value;
    if (index < digits.length - 1 && value !== '') {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput.focus();
    }
    setDigits(updatedDigits);
  };

  const handleReturn = () => {
    setWaitSubmit(true);
    setError('');
    setMessage('');
    setDigits(['', '', '', '', '', ''])
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoadingVerif(true);
    const code = digits.join('');
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
        setIsLoadingVerif(false);
        setMessage('Reset code successfully verified.');
        setError('');
        setTimeout(() => {
          navigate('/new-password', { state: { email } });
        }, 2000);
      } else {
        setIsLoadingVerif(false);
        setMessage('');
        setError('Reset code verification failed.');
      }
    } catch (error) {
      console.error(error);
      setIsLoadingVerif(false);
      setMessage('');
      setError('Reset code verification failed.');
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="forgotpasswordform">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="forgotpasswordform-image-container">
              <img src="https://img.freepik.com/premium-vector/bronze-lock-icon-white-background-flat-design-illustration-stock-vector-graphics_668389-92.jpg" alt="forgot-banner" className="forgotpasswordform-image" />
            </div>
            <h3>Trouble logging in?</h3>
            {waitsubmit ? (
              <div>
                <span>Enter you email and we'll send</span>
                <span>you a link to get back your account.</span>
                <div className="forgotpasswordform-input-container">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control forgotpasswordform-input"
                  />
                </div>
                <div className="forgotpasswordform-button-container">
                  <button type="submit" onClick={() => handleSubmit()} className="btn btn-primary forgotpasswordform-button">
                    {isLoadingsubmit ? (
                      <div className="spinner-border spinner-border-sm"></div>
                    ) : sent ? (
                      <div className="spinner-border spinner-border-sm"></div>
                    ) : (<div>Validate</div>)}</button>
                </div>
              </div>) : (
              <div>
                <span>Password has been sent. Please check your E-mail.</span>
                <div className="forgotpasswordform-input-container">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      id={`digit-${index}`}
                      name={`digit-${index}`}
                      type="text"
                      pattern="[0-9]*"
                      value={digit}
                      autocomplete="off"
                      maxLength={1}
                      onChange={(event) => {
                        const { value } = event.target;
                        const numericValue = value.replace(/\D/g, '');
                        handleInputChange({ target: { value: numericValue } }, index);
                      }}
                      className="form-control forgotpasswordform-digit"
                    />
                  ))}
                  <div className="forgotpasswordfrom-reload-icon-container" onClick={(e) => handleSubmit(e)}>
                    {isLoadingsubmit ? (
                      <div className="spinner-border spinner-border-sm"></div>
                    ) : sent ? (
                      <span className="resend-code-msg-sent">Sent ✓</span>
                    ) : (
                      <div><RxReload /></div>
                    )}
                    {!sent && (<div><span className="resend-code-msg">Resend</span>
                      <span className="resend-code-msg">code</span></div>)}

                  </div>
                </div>
                <div className="forgotpasswordform-validate-code-container">
                  <button onClick={(e) => handleVerify(e)} className='btn btn-primary forgotpasswordform-validate-code'>
                    {isLoadingverif ? (<div className="spinner-border spinner-border-sm"></div>) : (<div>Validate</div>)}
                  </button>
                  <p className="forgotpasswordform-return" onClick={handleReturn}>Go back</p>
                </div>
              </div>
            )}
            <div className="forgotpasswordform-input-container">
              <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>
              <p style={{ color: 'green', marginTop: '8px' }}>{message}</p>
            </div>
          </div>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div >
  );
};

export default ForgotPasswordForm;

