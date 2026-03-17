import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card animate-fade-in">
            <div className="product-image-wrapper">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-category">{product.category}</div>
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-bottom">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
