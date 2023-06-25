import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import ForgotPasswordForm from './views/pass_reset/ForgotPasswordForm';
import ResetCodeForm from './views/pass_reset/ResetPassword';
import NewPasswordPage from './views/pass_reset/NewPassword';
import CreateAccountPage from './views/CreateAccount';
import MainProfile from './views/profile/Main';
import AdminControl from './views/admin/adminPanel';
import CreateAdPage from './views/CreateAd';
import P404 from './views/404'; 
import SearchPage from './views/search/SearchPage';
import AdDetails from './views/addetails/AdDetails';
import UserDetailsPage from './views/userdetails/UserDetails';


const App = () => {
  return (
    <Router>
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-code" element={<ResetCodeForm />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/profile" element={<MainProfile  />} />
          <Route path="/adminpanel" element={<AdminControl />} />
          <Route path="/create-ad" element={<CreateAdPage />} />
          <Route path="/404" element={<P404 />} />
          <Route path="/annonce/:productId" element={<AdDetails /> } />
          <Route path="/user/:userId" element={<UserDetailsPage /> } />
          <Route path="search" element={<SearchPage /> } />
          {/* Add more routes for other pages/components as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

