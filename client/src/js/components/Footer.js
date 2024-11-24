import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import logo from '../../html/portfolio.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex">
          <div className="flex">
          <a 
              href="https://my-portfolio-gamma-nine-22.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex"
            >
                <img 
                src={logo}
                alt="Logo" 
                />
                <span>Dev - Salif Shaikh</span>
            </a>
            </div>
          
          <div className="flex">
            <a
              href="https://github.com/salifshaikh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </a>
            <a
              href="https://linkedin.com/in/salifshaikh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;