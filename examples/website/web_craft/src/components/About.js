import React from 'react';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Building Digital Excellence Since 2020</h3>
            <p>
              At WebCraft, we believe in the power of exceptional design and 
              cutting-edge technology to transform businesses. Our team of passionate 
              developers and designers work together to create digital solutions 
              that not only meet but exceed expectations.
            </p>
            <p>
              We specialize in modern web applications, mobile solutions, and 
              digital transformation strategies that help businesses thrive in 
              the digital age. Our commitment to quality and innovation has earned 
              us recognition from clients worldwide.
            </p>
            <p>
              From startups to enterprise clients, we tailor our approach to fit 
              your unique needs and objectives, ensuring that every project we 
              deliver drives real business value.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
