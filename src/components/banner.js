import React from 'react';
import './css/Banner.css';

function Banner() {
  const backgroundImageUrl = 'https://res.cloudinary.com/dncjxhygd/image/upload/v1685048308/knp2bq8jj9wxnnrbbhg0.jpg';

  return (
    <div className="banner" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="banner-text">
      </div>
    </div>
  );
}

export default Banner;