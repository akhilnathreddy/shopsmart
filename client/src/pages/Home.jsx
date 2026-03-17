import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedBlocks from '../components/FeaturedBlocks';
import BrandBanner from '../components/BrandBanner';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            <HeroSection />
            <FeaturedBlocks />
            <BrandBanner />

            <section id="products" className="products-section">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', margin: '60px 0 40px' }}>Latest Arrivals</h2>

                    {loading ? (
                        <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading premium products...</p>
                        </div>
                    ) : (
                        <div className="products-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '30px',
                            marginBottom: '80px'
                        }}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
