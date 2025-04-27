import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../Css/home.css';
import Navbar from "../Page/NavBar";
import Footer from "../Page/Footer";
import { FaChevronUp } from 'react-icons/fa';

function Home() {
    const videoUrl = 'https://videocdn.cdnpk.net/videos/cab497db-a0a2-4794-9f50-7216519a863c/horizontal/previews/videvo_watermarked/large.mp4';
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);

    const handleVideoError = () => {
        setVideoError(true);
    };

    const toggleFooter = () => {
        setFooterVisible(!footerVisible);
    };

    useEffect(() => {
        const handleScroll = () => {
            const isTop = window.scrollY < 50;
            setScrolled(!isTop);
            if (isTop) setFooterVisible(true);
            else setFooterVisible(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`home-page ${scrolled ? 'scrolled' : ''}`}>
            <Navbar />

            <div className="video-background-container">
                {videoError ? (
                    <div className="video-error">
                        <p>Video playback failed. Please try again later.</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="background-video"
                        onError={handleVideoError}
                    />
                )}

                <div className="video-overlay"></div>

                <div className="video-content">
                    <h1>Welcome to Your Apartment Community</h1>
                    <p>Experience modern living at its finest</p>
                    <Link to="/productList" className="cta-button">
                        View Available Properties
                    </Link>
                </div>
            </div>

            <div className="content-below-video">
                <h2>Why Choose Our Community?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Premium Amenities</h3>
                        <p>Enjoy our state-of-the-art facilities including pool, gym, and community lounge</p>
                    </div>
                    <div className="feature-card">
                        <h3>24/7 Support</h3>
                        <p>Our management team is always available to assist you</p>
                    </div>
                    <div className="feature-card">
                        <h3>Prime Location</h3>
                        <p>Centrally located with easy access to transportation and shopping</p>
                    </div>
                </div>
            </div>

            {!footerVisible && (
                <button className="footer-toggle" onClick={toggleFooter} aria-label="Show footer">
                    <FaChevronUp />
                </button>
            )}

            <Footer visible={footerVisible} onClose={() => setFooterVisible(false)} />
        </div>
    );
}

export default Home;
