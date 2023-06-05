import React from 'react';
import './css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container ">
        <div className="row">
          <div className="col-lg-3 col-lg-4">
            <h4>Annonce</h4>
            <ul className="list-unstyled">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Customer Service</h4>
            <ul className="list-unstyled">
              <li><a href="#">Help &amp; FAQs</a></li>
              <li><a href="#">Shipping &amp; Returns</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Connect with Us</h4>
            <ul className="list-unstyled">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <p>&copy; 2023 Annonce. All Rights Reserved.</p>
            </div>
            <div className="col-sm-6">
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                <li className="list-inline-item"><a href="#">Terms of Use</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;