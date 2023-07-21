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
    console.log(code);
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
              <img src="https://res.cloudinary.com/dncjxhygd/image/upload/v1688978975/mmpcxubplgf43paw0tus.jpg" alt="forgot-banner" className="forgotpasswordform-image" />
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
                    className="input-form forgotpasswordform-input"
                  />
                </div>
                <div className="forgotpasswordform-button-container">
                  <button type="submit" onClick={() => handleSubmit()} className="button">
                    {isLoadingsubmit ? (
                      <div className="spinner"></div>
                    ) : sent ? (
                      <div className="spinner"></div>
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
                      className="input-form forgotpasswordform-digit"
                    />
                  ))}
                  <div className="forgotpasswordfrom-reload-icon-container" onClick={(e) => handleSubmit(e)}>
                    {isLoadingsubmit ? (
                      <div className="spinner"></div>
                    ) : sent ? (
                      <span className="resend-code-msg-sent">&nbsp; Sent ✓</span>
                    ) : (
                      <div><RxReload /></div>
                    )}
                    {!sent && (<div><span className="resend-code-msg">Resend</span>
                      <span className="resend-code-msg">code</span></div>)}

                  </div>
                </div>
                <div className="forgotpasswordform-validate-code-container">
                  <button onClick={(e) => handleVerify(e)} className="button forgotpasswordform-validate-code">
                    {isLoadingverif ? (<div className="spinner"></div>) : (<div>Validate</div>)}
                  </button>
                  <p className="forgotpasswordform-return" onClick={handleReturn}>Go back</p>
                </div>
              </div>
            )}
            <div className="forgotpasswordform-input-container">
              <span style={{ color: 'red', marginTop: '8px' }}>{error}</span>
              <span style={{ color: 'green', marginTop: '8px' }}>{message}</span>
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

