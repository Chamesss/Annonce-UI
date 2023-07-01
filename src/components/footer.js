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
              <li><p>À propos de nous</p></li>
              <li><p>Carrières</p></li>
              <li><p>Press</p></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Customer Service</h4>
            <ul className="list-unstyled">
              <li><p>Aide &amp; FAQs</p></li>
              <li><p>Expédition &amp; Retours</p></li>
              <li><p>Contactez-nous</p></li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-4">
            <h4>Connectez avec nous</h4>
            <ul className="list-unstyled">
              <li><p>Facebook</p></li>
              <li><p>Twitter</p></li>
              <li><p>Instagram</p></li>
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
                <li className="list-inline-item"><p>Politique de confidentialité</p></li>
                <li className="list-inline-item"><p>Conditions d'utilisation</p></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;