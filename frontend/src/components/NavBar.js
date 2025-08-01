import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png"; 

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left">
        <img src={logo} alt="Command Center" className="logo" />
      </div>
      <div className="right">
        <div className="blink-dot"></div>
        <span className="status-text">ONLINE</span>
      </div>
    </div>
  );
};

export default Navbar;
