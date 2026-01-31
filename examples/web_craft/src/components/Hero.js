import React from 'react';

const Hero = () => {
  const scrollToAbout = () => {
    document.getElementById('about').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Welcome to WebCraft</h1>
        <p>We create stunning digital experiences that bring your vision to life</p>
        <button 
          className="cta-button" 
          onClick={scrollToAbout}
        >
          Learn More
        </button>
      </div>
    </section>
  );
};

export default Hero;
