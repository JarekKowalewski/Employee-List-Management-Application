import React from "react";
import "./Footer.scss";
import { AiFillFacebook, AiFillGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";

export const Footer = () => {
  return (
    <footer className="footer dark:bg-slate-800">
      <div className="social-media">
        <a href="https://www.facebook.com/jarek.kowalewski.3/"><AiFillFacebook className="footer-icons"/></a>
        <a href="https://www.linkedin.com/in/jaroslawkowalewski/"><AiFillLinkedin className="footer-icons"/></a> 
        <a href="https://www.instagram.com/j_yesterday/"><AiOutlineInstagram className="footer-icons"/></a> 
        <a href="https://github.com/JarekKowalewski"><AiFillGithub className="footer-icons github-ico"/></a> 
      </div>
      <div className="footer-text">© Warsaw, Poland</div>
    </footer>
  );
};
