import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Smartphone, Palette, Brain, Workflow, TrendingUp } from "lucide-react";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Services data
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Premium websites and web applications built with cutting-edge technologies",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: Smartphone,
      title: "Mobile Applications",
      description: "Native and cross-platform mobile solutions for iOS and Android",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, intuitive interfaces that deliver exceptional user experiences",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: Brain,
      title: "AI Integration",
      description: "Intelligent automation and AI-powered features for modern applications",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      icon: Workflow,
      title: "Business Automation",
      description: "Streamlined workflows and automated processes to scale your operations",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      icon: TrendingUp,
      title: "Digital Consulting",
      description: "Strategic guidance to transform your digital presence and drive growth",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    }
  ];

  // Featured Projects data
  const featuredProjects = [
    {
      title: "Talent Axiss",
      description: "Revolutionary recruitment platform connecting top talent with leading companies through AI-powered matching and seamless hiring workflows",
      tech: ["React", "Next.js", "AI/ML", "PostgreSQL"],
      impact: "10,000+ successful placements",
      url: "https://talent-axiss.vercel.app/",
      category: "Platform"
    },
    {
      title: "London Holidays",
      description: "Premium travel booking experience with curated destinations, luxury accommodations, and personalized itinerary planning",
      tech: ["React", "TypeScript", "Stripe", "Maps API"],
      impact: "£2M+ bookings processed",
      url: "https://london-holidays.vercel.app/",
      category: "E-Commerce"
    },
    {
      title: "Khoj Cafe",
      description: "Modern café management system with digital menu, online ordering, and real-time kitchen integration for seamless operations",
      tech: ["React", "Node.js", "MongoDB", "Socket.io"],
      impact: "500+ daily orders",
      url: "https://khoj-cafe.vercel.app/",
      category: "Food Tech"
    },
    {
      title: "Plenora Service",
      description: "Enterprise service management platform streamlining business operations with automation, analytics, and team collaboration",
      tech: ["Next.js", "GraphQL", "AWS", "Redis"],
      impact: "95% efficiency increase",
      url: "https://plenora-service.vercel.app/",
      category: "SaaS"
    },
    {
      title: "Event Kitchen",
      description: "Complete event planning solution with vendor management, guest coordination, and live event tracking for memorable experiences",
      tech: ["React", "Firebase", "Stripe", "Cloud Functions"],
      impact: "1,000+ events managed",
      url: "https://event-kitchen.vercel.app/",
      category: "Events"
    }
  ];

  // Leadership quote with word-by-word animation
  const philosophyQuote = "Great businesses are built where vision, technology, and execution meet.";
  const quoteWords = philosophyQuote.split(" ");

  // Testimonials data
  const testimonials = [
    {
      quote: "Mohammed's strategic vision and technical expertise transformed our entire digital infrastructure. A true innovator.",
      author: "Sarah Chen",
      role: "CEO, TechCorp",
      company: "Fortune 500"
    },
    {
      quote: "Working with Mohammed and NARRS was a game-changer. The results exceeded all expectations.",
      author: "James Rodriguez",
      role: "Founder, StartupX",
      company: "Series A"
    },
    {
      quote: "Exceptional leadership and execution. Mohammed brings both vision and the ability to deliver at scale.",
      author: "Emily Watson",
      role: "CTO, InnovateLabs",
      company: "Enterprise"
    },
    {
      quote: "A rare combination of business acumen and technical brilliance. Mohammed is building the future.",
      author: "Michael Chang",
      role: "VP Engineering, CloudScale",
      company: "Tech Leader"
    }
  ];

  return (
    <div className="ceo-portfolio">
      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Background Typography */}
        <div className="hero-bg-text">RAEES</div>

        <div className="hero-container">
          {/* Left Side */}
          <div className="hero-left">
            <motion.div
              className="hero-label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              FOUNDER & COO
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="hero-title-line">MOHAMMED</div>
              <div className="hero-title-line">RAEES</div>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Building innovative digital experiences, strategic business
              solutions, and future-focused technology ventures through NARRS.
            </motion.p>

            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                className="hero-btn primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Explore Journey</span>
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                className="hero-btn secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Ventures</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
          >
            <div className="hero-image">
              <img
                src="/mohammed raees img.png"
                alt="Mohammed Raees"
                className="hero-portrait"
              />
              <div className="hero-image-glow"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-container">
          <motion.div
            className="about-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="about-title">Leading Through Vision & Innovation</h2>
          </motion.div>

          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="about-paragraph">
                Mohammed Raees is the <strong>Founder and Chief Operating Officer of NARRS</strong>, 
                focused on creating impactful digital solutions that combine strategy, design, and technology.
              </p>
              <p className="about-paragraph">
                His mission is to help businesses establish powerful digital identities while building 
                innovative products that drive long-term growth. With a deep understanding of both technology 
                and business strategy, Mohammed bridges the gap between vision and execution.
              </p>
              <p className="about-paragraph">
                Through NARRS, he's transforming how companies approach digital transformation, 
                bringing cutting-edge solutions in web development, mobile applications, AI integration, 
                and business automation to ambitious organizations worldwide.
              </p>
            </motion.div>

            <motion.div
              className="about-experience"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="experience-item">
                <div className="experience-year">2024</div>
                <div className="experience-details">
                  <h3 className="experience-title">Started Technology Journey</h3>
                  <p className="experience-desc">Began exploring full-stack development and modern technologies</p>
                </div>
              </div>

              <div className="experience-item">
                <div className="experience-year">2025</div>
                <div className="experience-details">
                  <h3 className="experience-title">Expanded Solutions</h3>
                  <p className="experience-desc">Web & mobile development, AI integration expertise</p>
                </div>
              </div>

              <div className="experience-item active">
                <div className="experience-year">2026</div>
                <div className="experience-details">
                  <h3 className="experience-title">Founded NARRS</h3>
                  <p className="experience-desc">Building the future of digital innovation</p>
                </div>
              </div>

              <div className="experience-item">
                <div className="experience-year">Future</div>
                <div className="experience-details">
                  <h3 className="experience-title">Global Vision</h3>
                  <p className="experience-desc">Scaling impact across industries worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">
        <div className="services-container">
          <motion.div
            className="services-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="services-label">WHAT I OFFER</div>
            <h2 className="services-title">Premium Services</h2>
            <p className="services-subtitle">
              Comprehensive digital solutions tailored to elevate your business
            </p>
          </motion.div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-panel"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <div className="service-gradient" style={{ background: service.gradient }}></div>
                <div className="service-content">
                  <div className="service-icon-wrapper">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <motion.div
                    className="service-arrow"
                    whileHover={{ x: 8 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="projects-section">
        <div className="projects-container">
          <motion.div
            className="projects-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="projects-label">SELECTED WORK</div>
            <h2 className="projects-title">Featured Projects</h2>
            <p className="projects-subtitle">
              Building exceptional digital experiences that drive real business results
            </p>
          </motion.div>

          <div className="projects-showcase">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="project-item"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-150px" }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-wrapper"
                >
                  <div className="project-visual">
                    <div className="project-number-large">{String(index + 1).padStart(2, '0')}</div>
                    <div className="project-category-tag">{project.category}</div>
                  </div>

                  <div className="project-content">
                    <motion.h3 
                      className="project-title"
                      whileHover={{ x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.title}
                      <motion.span 
                        className="project-arrow"
                        whileHover={{ x: 10, y: -10 }}
                      >
                        <ArrowRight size={32} strokeWidth={2} />
                      </motion.span>
                    </motion.h3>

                    <p className="project-description">{project.description}</p>

                    <div className="project-meta">
                      <div className="project-tech-list">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="tech-item">{tech}</span>
                        ))}
                      </div>

                      <div className="project-impact-badge">
                        <span className="impact-icon">⚡</span>
                        <span className="impact-text">{project.impact}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP PHILOSOPHY SECTION */}
      <section className="philosophy-section">
        <div className="philosophy-container">
          <motion.div
            className="philosophy-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="philosophy-label">LEADERSHIP PHILOSOPHY</div>
            <div className="philosophy-quote">
              {quoteWords.map((word, index) => (
                <motion.span
                  key={index}
                  className="philosophy-word"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="philosophy-author"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: quoteWords.length * 0.1 }}
              viewport={{ once: true }}
            >
              — Mohammed Raees
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className="skills-section">
        <div className="skills-container">
          <motion.div
            className="skills-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="skills-label">EXPERTISE</div>
            <h2 className="skills-title">Core Competencies</h2>
          </motion.div>

          <div className="skills-grid">
            {[
              "React",
              "React Native",
              "JavaScript",
              "Python",
              "AI & Machine Learning",
              "Business Strategy",
              "Leadership",
              "Operations",
              "Node.js",
              "UI/UX Design",
              "Cloud Architecture",
              "Digital Transformation"
            ].map((skill, index) => (
              <motion.div
                key={index}
                className="skill-badge"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  rotateX: 10,
                  y: -8,
                }}
              >
                <div className="skill-shine"></div>
                {skill}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NARRS COMPANY SECTION */}
      <section className="narrs-section">
        <div className="narrs-container">
          <motion.div
            className="narrs-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="narrs-badge">NARRS</div>
            <h2 className="narrs-title">Building The Future With NARRS</h2>
            <p className="narrs-description">
              NARRS is a technology and innovation company dedicated to transforming businesses 
              through cutting-edge digital solutions. We combine strategic thinking, premium design, 
              and advanced technology to create products that drive real business growth.
            </p>

            <div className="narrs-grid">
              <motion.div
                className="narrs-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <h3 className="narrs-card-title">Mission</h3>
                <p className="narrs-card-text">
                  Empower businesses with innovative digital solutions that drive growth, 
                  efficiency, and competitive advantage in the modern marketplace.
                </p>
              </motion.div>

              <motion.div
                className="narrs-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <h3 className="narrs-card-title">Vision</h3>
                <p className="narrs-card-text">
                  To be the leading force in digital transformation, setting new standards 
                  for innovation, quality, and business impact across industries.
                </p>
              </motion.div>

              <motion.div
                className="narrs-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <h3 className="narrs-card-title">Approach</h3>
                <p className="narrs-card-text">
                  Strategic planning meets flawless execution. We combine business strategy, 
                  premium design, and cutting-edge technology to deliver exceptional results.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <motion.div
            className="testimonials-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="testimonials-label">TESTIMONIALS</div>
            <h2 className="testimonials-title">Trusted By Leaders</h2>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-name">{testimonial.author}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                  <div className="testimonial-company">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <div className="contact-container">
          <motion.div
            className="contact-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="contact-title">Let's Build Something Exceptional</h2>
            <p className="contact-subtitle">
              Whether you're launching a startup, scaling a company, or creating your next 
              digital product, let's make it extraordinary.
            </p>

            <motion.div
              className="contact-cta-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="contact-btn primary"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Schedule Meeting</span>
                <ArrowRight size={24} />
              </motion.button>

              <motion.button
                className="contact-btn secondary"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Contact Me</span>
              </motion.button>
            </motion.div>

            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">hello@narrs.co</div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Location</div>
                <div className="contact-info-value">Global</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <h3 className="footer-name">MOHAMMED RAEES</h3>
              <p className="footer-title">Founder & COO</p>
              <p className="footer-company">NARRS</p>
            </div>

            <div className="footer-links">
              <div className="footer-link-group">
                <h4 className="footer-link-title">Connect</h4>
                <a href="https://www.linkedin.com/in/mohammed-raees-9937b634a/" className="footer-link">LinkedIn</a>
                <a href="#" className="footer-link">GitHub</a>
                <a href="#" className="footer-link">Instagram</a>
                <a href="#" className="footer-link">Email</a>
              </div>

              <div className="footer-link-group">
                <h4 className="footer-link-title">Services</h4>
                <a href="#" className="footer-link">Web Development</a>
                <a href="#" className="footer-link">Mobile Apps</a>
                <a href="#" className="footer-link">AI Integration</a>
                <a href="#" className="footer-link">Consulting</a>
              </div>

              <div className="footer-link-group">
                <h4 className="footer-link-title">Company</h4>
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Projects</a>
                <a href="#" className="footer-link">NARRS</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 Mohammed Raees. All rights reserved.
            </p>
            <p className="footer-credit">
              Crafted with precision & innovation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Remove StatCard component - no longer needed
