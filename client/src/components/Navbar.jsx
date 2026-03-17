import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="header animate-fade-in">
            {/* Top Row: Logo & Main Links */}
            <div className="container header-top">
                <div className="header-left">
                    <button className="hamburger-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </div>

                <div className="header-center">
                    <a href="/" className="logo">SHOPSMART</a>
                </div>

                <div className="header-right">
                    <nav className="top-nav">
                        <a href="#about">About Us</a>
                        <a href="#blog">Blog</a>
                        <a href="#faq">FAQ</a>
                    </nav>
                    <div className="user-actions">
                        <button className="icon-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </button>
                        <button className="icon-link cart-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <span className="cart-badge">0</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Search & Categories */}
            <div className="container header-bottom">
                <div className="search-container">
                    <span className="search-category-label">Clothing</span>
                    <input type="text" placeholder="Search..." className="search-input" />
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                <nav className="category-nav">
                    <a href="#clothing" className="active">Clothing <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                    <a href="#new">New Arrivals</a>
                    <a href="#sales">Sales</a>
                    <a href="#men">Men</a>
                    <a href="#women">Women</a>
                    <a href="#kids">Kid's</a>
                    <a href="#brand">Brand</a>
                </nav>

                {/* Empty div for flex balance if needed, or we just center the nav */}
                <div className="header-bottom-spacer"></div>
            </div>
        </header>
    );
};

export default Navbar;
