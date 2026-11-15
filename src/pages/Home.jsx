
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get("/hotels");
        setHotels(Array.isArray(response.data) ? response.data.slice(0, 3) : []);
      } catch (error) {
        console.error("Failed to load hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-tag">WELCOME TO STAYNEST</span>

          <h1>
            Discover Your
            <br />
            <span>Perfect Stay</span>
          </h1>

          <p>
            Experience comfort, luxury and unforgettable moments.
            Find the perfect hotel for your next journey.
          </p>

          <div className="hero-buttons">
            <Link to="/hotels" className="hero-primary-btn">
              Explore Hotels →
            </Link>

            <Link to="/favourites" className="hero-secondary-btn">
              ♥ My Favourites
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>500+</h3>
              <span>Happy Guests</span>
            </div>
            <div>
              <h3>100+</h3>
              <span>Premium Hotels</span>
            </div>
            <div>
              <h3>4.9/5</h3>
              <span>Guest Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="home-intro">
        <span className="section-label">DISCOVER STAYNEST</span>
        <h2>Your Journey Begins With The Perfect Stay</h2>
        <p>
          Whether you are travelling for business or relaxation,
          discover handpicked hotels that make every moment special.
        </p>
      </section>

      {/* FEATURED HOTELS */}
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">HANDPICKED FOR YOU</span>
            <h2>Featured Hotels</h2>
            <p>Explore some of our popular stays.</p>
          </div>

          <Link to="/hotels" className="view-all-link">
            View All Hotels →
          </Link>
        </div>

        {loading ? (
          <p className="home-message">Loading hotels...</p>
        ) : hotels.length === 0 ? (
          <p className="home-message">No hotels available right now.</p>
        ) : (
          <div className="featured-grid">
            {hotels.map((hotel) => (
              <div className="featured-card" key={hotel.id}>
                <div className="featured-image">
                  <img
                    src={
                      hotel.image ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900"
                    }
                    alt={hotel.name || "Hotel"}
                  />
                  <span className="featured-badge">POPULAR STAY</span>
                </div>

                <div className="featured-info">
                  <div className="featured-title-row">
                    <h3>{hotel.name}</h3>
                    <span className="hotel-rating">
                      ★ {hotel.rating || "4.5"}
                    </span>
                  </div>

                  <p className="featured-location">
                    📍 {hotel.location || "Beautiful Destination"}
                  </p>

                  <div className="featured-bottom">
                    <div className="featured-price">
                      <strong>₹{hotel.price}</strong>
                      <span>/ night</span>
                    </div>

                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="featured-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* OFFERS SECTION */}
      <section className="offers-section">
        <div className="offer-content">
          <span className="section-label">SPECIAL OFFERS</span>
          <h2>Make Your Next Trip More Special</h2>
          <p>
            Discover beautiful destinations, comfortable rooms
            and memorable experiences at amazing prices.
          </p>
          <Link to="/hotels" className="offer-btn">
            Find Your Stay →
          </Link>
        </div>

        <div className="offer-image">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000"
            alt="Luxury hotel swimming pool"
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="why-heading">
          <span className="section-label">WHY STAYNEST</span>
          <h2>Why Choose Us?</h2>
          <p>Everything you need for a comfortable journey.</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🏨</div>
            <h3>Premium Hotels</h3>
            <p>
              Discover carefully selected hotels for a wonderful stay.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">💰</div>
            <h3>Best Prices</h3>
            <p>
              Find comfortable accommodation within your budget.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">🔒</div>
            <h3>Secure Booking</h3>
            <p>
              Enjoy a simple and reliable hotel booking experience.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">🎧</div>
            <h3>Customer Support</h3>
            <p>
              Get assistance whenever you need help with your stay.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="home-cta">
        <h2>Ready For Your Next Adventure?</h2>
        <p>
          Your perfect stay is just a few clicks away.
          Start exploring today!
        </p>
        <Link to="/hotels" className="cta-btn">
          Book Your Stay →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>🏨 StayNest</h2>
            <p>
              Find your perfect stay and make every journey memorable.
            </p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/favourites">Favourites</Link>
            <Link to="/mybookings">My Bookings</Link>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/hotels">Popular Hotels</Link>
            <Link to="/search">Search Hotels</Link>
            <Link to="/favourites">Saved Hotels</Link>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <p>📧 support@staynest.com</p>
            <p>📍 India</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 StayNest. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;
