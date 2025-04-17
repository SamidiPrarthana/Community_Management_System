import React, { useState } from 'react';
import '../Css/footer.css'; // Ensure this path is correct
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChevronUp, FaTimes } from 'react-icons/fa';

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleFooter = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {!isVisible && (
        <button className="footer-toggle" onClick={toggleFooter} aria-label="Show footer">
          <FaChevronUp />
        </button>
      )}

      <footer className={`footer ${isVisible ? 'visible' : 'hidden'}`}>
        <button className="footer-close" onClick={toggleFooter} aria-label="Close footer">
          <FaTimes />
        </button>

        <div className="footer-container">
          <div className="footer-grid">
            {/* Contact Information */}
            <div className="footer-section">
              <h3>Contact Us</h3>
              <ul className="contact-info">
                <li><FaPhone /> <a href="tel:+18005551234">(078) 486-0200</a></li>
                <li><FaEnvelope /> <a href="mailto:info@acms.com">info@cms.com</a></li>
                <li><FaMapMarkerAlt /> Seewali Lane, Kothalwala, Malabe, CA 94107</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/properties">Available Properties</a></li>
                <li><a href="/maintenance">Maintenance Requests</a></li>
                <li><a href="/payments">Online Payments</a></li>
                <li><a href="/amenities">Community Amenities</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/blog">Community Blog</a></li>
                <li><a href="/documents">Resident Documents</a></li>
                <li><a href="/moving-guide">Moving Guide</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h3>Legal</h3>
              <ul className="footer-links">
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/accessibility">Accessibility Statement</a></li>
                <li><a href="/fair-housing">Fair Housing</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div className="footer-bottom">
            <div className="social-links">
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>

            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} Apartment Community Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
