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
              <li><a href="#">À propos de nous</a></li>
              <li><a href="#">Carrières</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Customer Service</h4>
            <ul className="list-unstyled">
              <li><a href="#">Aide &amp; FAQs</a></li>
              <li><a href="#">Expédition &amp; Retours</a></li>
              <li><a href="#">Contactez-nous</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Connectez avec nous</h4>
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
              <p>&copy; 2023 Annonce. Tous les droits sont réservés.</p>
            </div>
            <div className="col-sm-6">
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#">Politique de confidentialité</a></li>
                <li className="list-inline-item"><a href="#">Conditions d'utilisation</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;