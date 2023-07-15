import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const NotFoundPage = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div style={{ padding: "200px 50px 100px 50px" }}>
        <h1>404 - Page not found</h1>
        <a href='/' style={{padding:"20px 0px 0px 0px"}}>Return to home page</a>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;