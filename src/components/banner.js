import React from 'react';
import './css/Banner.css';
import banner from './banner.png';

function Banner() {

  return (
    <div className="banner">
      <div className="banner-text">
        <div>
          <p>Unleash trading potential </p>
          <p>within our esteemed </p>
          <p>marketplace community.</p>
          <p>&nbsp;</p>
          <button className="banner-create-ad" onClick={() => { window.location.href = '/create-ad'; }}>Start creating your ads today!</button>
        </div>
      </div>
      <div className="banner-img-container">
        <img src={banner} alt="test" className="banner-img" />
      </div>
    </div>
  );
}

export default Banner;