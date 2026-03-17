import React from 'react';
import './FeaturedBlocks.css';

const FeaturedBlocks = () => {
    return (
        <section className="featured-section animate-fade-in">
            <div className="container featured-container">
                {/* Block 1: Editorial Shot 1 */}
                <div className="featured-block">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                        alt="Fashion Editorial Model"
                        className="featured-image"
                    />
                </div>

                {/* Block 2: Editorial Shot 2 */}
                <div className="featured-block">
                    <img
                        src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop"
                        alt="Street Fashion Style"
                        className="featured-image"
                    />
                </div>

                {/* Block 3: Text CTA */}
                <div className="featured-block text-block">
                    <h3 className="featured-title">Models wearing<br />full outfits</h3>
                    <button className="pill-btn featured-btn">Explore now</button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedBlocks;
