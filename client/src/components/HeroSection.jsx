import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero-section animate-fade-in">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Unleash Your Style<br />
                        Shop the Latest<br />
                        Trends
                    </h1>
                    <p className="hero-description">
                        Discover the latest trends & express your style effortlessly.
                        Shop exclusive collections with premium designs, just for you!
                    </p>

                    <div className="hero-buttons">
                        <button className="pill-btn">Shop Now</button>
                        <button className="icon-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <h3 className="stats-title">25 Million+</h3>
                        <p className="stats-desc">
                            Real reviews from our happy customers! See what fashion lovers are saying about our quality, style, and service.
                        </p>
                        <div className="avatar-group">
                            <img src="https://i.pravatar.cc/150?img=1" alt="User 1" className="avatar" />
                            <img src="https://i.pravatar.cc/150?img=2" alt="User 2" className="avatar" />
                            <img src="https://i.pravatar.cc/150?img=3" alt="User 3" className="avatar" />
                            <img src="https://i.pravatar.cc/150?img=4" alt="User 4" className="avatar" />
                        </div>
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
                        alt="Fashion Model Editorial"
                        className="hero-image"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
