import React from 'react';
import './css/SideNav.css';

const SideNav = (props) => {
  const { closeSideNav } = props;

  return (
    <div className="sidenav">
      <button className="close-btn" onClick={closeSideNav}>Close</button>
      <a href="/profile">Profile</a>
      <a href="/favorites">Favorites</a>
      <a href="/inbox">Inbox</a>
      <a href="/help">Help</a>
    </div>
  );
};

export default SideNav;