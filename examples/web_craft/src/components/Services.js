import React from 'react';

const Services = () => {
  const services = [
    {
      icon: '🚀',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Node.js, and cloud platforms for scalability and performance.'
    },
    {
      icon: '📱',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android devices.'
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces designed to enhance user engagement and drive conversions through thoughtful design.'
    },
    {
      icon: '🔧',
      title: 'Consulting',
      description: 'Strategic technology consulting to help you make informed decisions about your digital transformation journey.'
    },
    {
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and migration services to optimize your applications for performance and cost efficiency.'
    },
    {
      icon: '🔒',
      title: 'Security & Maintenance',
      description: 'Ongoing support, security monitoring, and maintenance services to keep your applications running smoothly and securely.'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
