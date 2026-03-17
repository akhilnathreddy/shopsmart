import React from 'react';
import './BrandBanner.css';

const BrandBanner = () => {
    const brands = [
        "GRAPHIC STUDIO",
        "S. SALVA",
        "GOLDEN STUDIO",
        "FURNITURE DESIGN",
        "TRAVEL LOOKBOOK"
    ];

    return (
        <div className="brand-banner">
            <div className="container brand-container">
                {brands.map((brand, index) => (
                    <div key={index} className="brand-item">
                        <div className="brand-diamond"></div>
                        <span className="brand-name">{brand}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandBanner;
