import React from 'react';
import './css/Banner.css';

function Banner() {
  const backgroundImageUrl = 'https://res.cloudinary.com/dncjxhygd/image/upload/v1686790778/r6piov5aatvxdsta43y0.png';

  return (
    <div className="banner" style={{ backgroundImage: `url(${backgroundImageUrl})`, width:'80%'}}>
      <div className="banner-text">
      </div>
    </div>
  );
}

export default Banner;