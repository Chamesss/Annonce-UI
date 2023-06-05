import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';

const NewPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  useEffect(() => {
    if (confirmed) {
      // Wait for 5 seconds before navigating to another page
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

    try {
      // Send new password to Node.js API
      console.log(email);
      console.log(password);
      const response = await fetch(`http://localhost:8080/user/edituser/null/null`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname: null, lastname: null, email: email, oldPassword: null, newPassword: password, tel: null, type: null, uncheck: true })
      });
      const data = await response.json();
      if (data.success) {
        setErrorMessage('');
        setConfirmed('Password has been changed.. redirecting to login page')
      } else {
        setErrorMessage('Failed to reset password.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to reset password. ' + error);
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
      <div className="header h-100">
        <Header />
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <div class="container-fluid mb-5" >
          <div class="row justify-content-center">
            <div class="col-lg-4 border border-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
                <h2 class="my-4 d-block" style={{ margin: "10px" }}>Reset Password</h2>
                <div>
                  <label htmlFor="password">New Password:</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    class="form-control my-3"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    class="form-control my-3"
                  />
                </div>
                <button
                  type="submit"
                  disabled={password !== confirmPassword}
                  class="btn btn-primary my-3"
                >
                  Submit
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {confirmed && <p style={{ color: 'green' }}>{confirmed}</p>}
              </form>
            </div>
          </div>
        </div>
        <div class="my-5 container"><span class="d-block" style={{ height: "50px" }}></span></div>
      </div>

      <div>
        <Footer />
      </div>
    </div >
  );
};

export default NewPasswordPage;