// src/components/LandingPage/LandingPage.jsx

import React, { useState, useEffect } from 'react';
// 👇 1. Import useNavigate and useSearchParams
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeIcon, UsersIcon, TrophyIcon, StarIcon, UserIcon, ShieldIcon, SearchIcon, MessageIcon, ChartIcon, CheckIcon, CloseIcon, MenuIcon } from '../Shared/Icons';
// import './LandingPage.css';
import './styles/LandingPage.css';
import './styles/HeroSection.css';
import './styles/HeroSection.css';



export function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  // Check for logout success message
  useEffect(() => {
    const logoutParam = searchParams.get('logout');
    if (logoutParam === 'success') {
      setLogoutSuccess(true);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setLogoutSuccess(false);
      }, 5000);
    }
  }, [searchParams]);

  const stats = [
    { label: 'Active Listings', value: '500+', icon: <HomeIcon size={24} /> },
    { label: 'Happy Students', value: '2,000+', icon: <UsersIcon size={24} /> },
    { label: 'Universities', value: '50+', icon: <TrophyIcon size={24} /> },
    { label: 'Average Rating', value: '4.8', icon: <StarIcon size={24} fill="#FFD700" color="#FFD700" /> },
  ];

  const features = [
    { icon: <ShieldIcon size={24} />, title: 'Verified Properties', description: 'Every listing is verified and inspected for safety and quality standards', colorClass: 'feature-icon-blue' },
    { icon: <SearchIcon size={24} />, title: 'Smart Search', description: 'Advanced filters help you find exactly what you need near your campus', colorClass: 'feature-icon-purple' },
    { icon: <MessageIcon size={24} />, title: 'Direct Communication', description: 'Message landlords directly through our secure platform', colorClass: 'feature-icon-green' },
    { icon: <ChartIcon size={24} />, title: 'Best Prices', description: 'Compare prices and find the best deals for student housing', colorClass: 'feature-icon-yellow' },
  ];

   const howItWorks = [
    { step: '1', title: 'Create Your Profile', description: 'Sign up as a student and tell us what you\'re looking for' },
    { step: '2', title: 'Search & Filter', description: 'Browse verified listings with our advanced search filters' },
    { step: '3', title: 'Connect & Visit', description: 'Message landlords and schedule property viewings' },
    { step: '4', title: 'Move In', description: 'Complete your booking and move into your new home' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Computer Science Student', university: 'State University', text: 'Found my perfect room within a week! The platform is so easy to use.', rating: 5 },
    { name: 'Michael Chen', role: 'Engineering Student', university: 'Tech Institute', text: 'Great selection of affordable housing near campus. Saved me so much time!', rating: 5 },
    { name: 'Emma Davis', role: 'Medical Student', university: 'Medical College', text: 'The landlords are responsive and professional. Highly recommend!', rating: 5 },
  ];

  const goToLogin = () => {
    setMobileMenuOpen(false); 
    navigate('/login');
  };

  const goToRegister = () => {
    setMobileMenuOpen(false);
    navigate('/login?tab=register'); 
  };

  return (
    <div className="landing-page">
      {/* Logout Success Message */}
      {logoutSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: '#10b981',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          <CheckIcon size={20} />
          <span>You have been successfully logged out!</span>
        </div>
      )}

      {/* --- Navigation --- */}
      <nav className="main-nav">
        <div className="container nav-container">
          <div className="nav-logo">
            <div className="nav-logo-icon"><HomeIcon size={24} /></div>
            <span>BoardingHouseFinder</span>
          </div>

          {/* Desktop Nav */}
          <div className="nav-links-desktop">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            {/*  5. Use the handler */}
            <button className="button button-secondary" onClick={goToLogin}>Log In</button>
            <button className="button button-primary" onClick={goToRegister}>Sign Up Free</button>
          </div>

          {/* Mobile Menu Button */}
          <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="nav-mobile-menu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
             {/* 5. Use the handler */}
            <button className="button button-secondary button-full-width" onClick={goToLogin}>Log In</button>
            <button className="button button-primary button-full-width" onClick={goToLogin}>Sign Up Free</button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="hero-landing-section">
        <div className="container hero-landing-container">
          <div className="hero-landing-content">
            <span className="badge hero-landing-badge">Trusted by 2,000+ Students</span>
            <h1>Find Your Perfect Student Housing</h1>
            <p className="hero-landing-subtitle">
              Discover safe, affordable, and verified boarding houses near your university. Your perfect student home is just a click away.
            </p>

            {/* Quick Search */}
            <div className="card hero-landing-search-card">
              <div className="card-content">
                 {/* 5. Use the handler */}
                <form className="hero-landing-search-form" onSubmit={(e) => { e.preventDefault(); goToLogin(); }}>
                   <div className="hero-landing-input-wrapper">
                    <input type="text" placeholder="Enter your university or location" className="input input-with-icon input-large" />
                   </div>
                  <button type="submit" className="button button-primary button-large">
                    <span className="icon"></span> Search
                  </button>
                </form>
              </div>
            </div>

            <div className="hero-landing-buttons">
               {/* 5. Use the handler */}
              <button className="button button-primary button-large" onClick={goToLogin}>
                Get Started Free →
              </button>
              <button className="button button-secondary button-large" onClick={goToLogin}>
                I'm a Landlord
              </button>
            </div>
          </div>

          <div className="hero-landing-image-container">
            <div className="hero-landing-image-wrapper">
              <img
                 src="https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                 alt="Modern student housing"
                 className="hero-landing-image"
               />
              <div className="hero-landing-image-overlay"></div>
              <div className="hero-landing-image-card">
                 <div className="card">
                   <div className="card-content image-card-content">
                      <div>
                        <p className="text-muted small-text">Starting from</p>
                        <p className="image-card-price">₱300/month</p>
                      </div>
                      <div className="image-card-rating">
                        <span className="icon"><StarIcon size={16} fill="#FFD700" color="#FFD700" /></span> 4.8
                      </div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="hero-landing-float-stat">
               <div className="float-stat-icon green"><CheckIcon size={20} /></div>
               <div>
                 <p className="text-muted small-text">Verified</p>
                 <p className="float-stat-value">100%</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="stats-section">
        <div className="container stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="features-section">
         <div className="container">
           <div className="section-header">
             <span className="badge section-badge">Why Choose Us</span>
             <h2>Everything You Need</h2>
             <p className="section-subtitle">
               We've built the perfect platform to help students find their ideal housing
             </p>
           </div>
           <div className="features-grid">
             {features.map((feature, index) => (
               <div key={index} className="card feature-card">
                 <div className="card-content feature-card-content">
                   <div className={`feature-icon-wrapper ${feature.colorClass}`}>
                     <span className="icon">{feature.icon}</span>
                   </div>
                   <h3>{feature.title}</h3>
                   <p className="feature-description">{feature.description}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="badge section-badge">Simple Process</span>
            <h2>How It Works</h2>
            <p className="section-subtitle">Find your perfect student housing in just 4 easy steps</p>
          </div>
          <div className="how-it-works-grid">
            {howItWorks.map((item, index) => (
              <div key={index} className="how-it-works-item">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                 {index < howItWorks.length - 1 && <div className="how-it-works-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
       <section id="testimonials" className="testimonials-section">
         <div className="container">
           <div className="section-header">
             <span className="badge section-badge">Testimonials</span>
             <h2>What Students Say</h2>
             <p className="section-subtitle">Join thousands of happy students who found their perfect home</p>
           </div>
           <div className="testimonials-grid">
             {testimonials.map((testimonial, index) => (
               <div key={index} className="card testimonial-card">
                 <div className="card-content">
                   <div className="testimonial-rating">
                     {[...Array(testimonial.rating)].map((_, i) => (
                       <span key={i} className="icon rating-star"><StarIcon size={16} fill="#FFD700" color="#FFD700" /></span>
                     ))}
                   </div>
                   <p className="testimonial-text">"{testimonial.text}"</p>
                   <div className="testimonial-author">
                     <div className="avatar testimonial-avatar"><UserIcon size={24} /></div>
                     <div>
                       <p className="testimonial-name">{testimonial.name}</p>
                       <p className="testimonial-role">{testimonial.role}</p>
                       <p className="testimonial-university">{testimonial.university}</p>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

      {/* --- CTA Section --- */}
      <section className="cta-section">
        <div className="container cta-container">
          <h2>Ready to Find Your Perfect Home?</h2>
          <p className="cta-subtitle">
            Join BoardingFinder today and discover verified student housing near your campus
          </p>
          <div className="cta-buttons">
             {/* 👇 5. Use the handler */}
            <button className="button button-cta-primary" onClick={goToLogin}>
              Get Started Free →
            </button>
            <button className="button button-cta-secondary" onClick={goToLogin}>
              List Your Property
            </button>
          </div>
          <p className="cta-footer-text">
            No credit card required • Free to browse • Instant access
          </p>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                 <div className="nav-logo-icon"><HomeIcon size={24} /></div>
                 <span>BoardingHouseFinder</span>
              </div>
              <p>Making student housing search safe, comfortable, and affordable since 2025.</p>
            </div>
            <div className="footer-col">
              <h4>For Students</h4>
              <ul>
                <li><a href="#">Browse Listings</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Safety Tips</a></li>
                <li><a href="#">Student Resources</a></li>
              </ul>
            </div>
            <div className="footer-col">
               <h4>For Landlords</h4>
               <ul>
                 <li><a href="#">List Your Property</a></li>
                 <li><a href="#">Pricing</a></li>
                 <li><a href="#">Support</a></li>
               </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BoardingFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}