import { useState, useEffect } from 'react'
import LineWaves from './LineWaves'
import FluidGlass from './FluidGlass'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    loading: true,
    message: '',
  })
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Backend health check
  useEffect(() => {
    fetch('/api/health/')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus({
          connected: data.status === 'ok',
          loading: false,
          message: data.message,
        })
      })
      .catch(() => {
        setBackendStatus({
          connected: false,
          loading: false,
          message: 'Backend offline',
        })
      })
  }, [])

  // Scroll listener for navbar shadow + active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ===== BACKGROUND WAVES ===== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.1}
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          enableMouseInteraction
          mouseInfluence={2}
        />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          Sayan Kumar <span>Roy</span>
        </div>
        <div className="nav-links">
          {['about', 'skills', 'projects', 'education', 'contact'].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className={activeSection === s ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(s)
              }}
            >
              {s}
            </a>
          ))}
        </div>
        <button
          className="nav-cta"
          onClick={() => scrollTo('contact')}
        >
          Hire Me →
        </button>
      </nav>

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-watermark">SK</div>
        <div className="sidebar-info">
          <div className="sidebar-label">Developer</div>
          <div className="sidebar-name">
            Sayan Kumar<br />Roy
          </div>
          <div className="sidebar-contacts">
            <a href="#">Guwahati, Assam, India</a>
            <a href="mailto:sayanrotor0@gmail.com">sayanrotor0@gmail.com</a>
            <a href="tel:+919900577770">+91 9900 577770</a>
            <a href="https://github.com/voidnova-code" target="_blank" rel="noreferrer">
              github.com/voidnova-code
            </a>
            <a href="https://leetcode.com/u/voidnova" target="_blank" rel="noreferrer">
              leetcode.com/u/voidnova
            </a>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        {/* HERO */}
        <section className="hero-section" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* Fluid Glass overlay — sits on top as a decorative effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'auto',
          }}>
            <FluidGlass />
          </div>

          {/* Hero text content */}
          <div className="hero-subtitle">CS Undergraduate &amp; Full-Stack Developer</div>
          <h1 className="hero-title">
            <span className="line line-building">Building</span>
            <span className="line line-scalable">Scalable</span>
            <span className="line line-systems">Systems.</span>
          </h1>
          <p className="hero-description">
            Passionate about crafting <strong>full-stack applications</strong> that are fast,
            maintainable, and production-ready. From Flutter frontends to
            Django backends and normalized databases — I build things that
            ship.
          </p>
          <div className="hero-buttons" style={{ position: 'relative', zIndex: 3 }}>
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              View Projects →
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>
              Get in Touch
            </button>
          </div>
        </section>

        {/* ===== PROJECT BAR (MARQUEE) ===== */}
        <div className="project-bar">
          <div className="marquee">
            <div className="marquee-content">
              <span>PYTHON</span> <span className="plus">+</span>
              <span>MYSQL</span> <span className="plus">+</span>
              <span>FIREBASE</span> <span className="plus">+</span>
              <span>REST APIS</span> <span className="plus">+</span>
              <span>MONGODB</span> <span className="plus">+</span>
              <span>GIT</span> <span className="plus">+</span>
              <span>MOBILE DEV</span> <span className="plus">+</span>
              <span>SYSTEM DESIGN</span> <span className="plus">+</span>
              <span>FLUTTER</span> <span className="plus">+</span>
              <span>DJANGO</span> <span className="plus">+</span>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <span>PYTHON</span> <span className="plus">+</span>
              <span>MYSQL</span> <span className="plus">+</span>
              <span>FIREBASE</span> <span className="plus">+</span>
              <span>REST APIS</span> <span className="plus">+</span>
              <span>MONGODB</span> <span className="plus">+</span>
              <span>GIT</span> <span className="plus">+</span>
              <span>MOBILE DEV</span> <span className="plus">+</span>
              <span>SYSTEM DESIGN</span> <span className="plus">+</span>
              <span>FLUTTER</span> <span className="plus">+</span>
              <span>DJANGO</span> <span className="plus">+</span>
            </div>
          </div>
        </div>

        {/* ===== ABOUT SECTION ===== */}
        <section className="section" id="about">
          <div className="section-label">About Me</div>
          <h2 className="section-title">Who I Am</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            I&apos;m a Computer Science undergraduate with a passion for building robust,
            scalable software systems. I love working across the entire stack — from
            designing intuitive mobile and web interfaces to architecting efficient
            backends and databases. I&apos;m always exploring new technologies and pushing
            myself to write cleaner, more performant code.
          </p>
        </section>

        {/* SKILLS */}
        <section className="section" id="skills">
          <div className="section-label">Skills</div>
          <h2 className="section-title">What I Work With</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <h3>Frontend</h3>
              <p>Building responsive, high-performance user interfaces with modern frameworks.</p>
              <div className="skill-tags">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Flutter</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">Dart</span>
                <span className="skill-tag">HTML/CSS</span>
              </div>
            </div>
            <div className="skill-card">
              <h3>Backend</h3>
              <p>Designing APIs and server-side logic with reliability and scalability in mind.</p>
              <div className="skill-tags">
                <span className="skill-tag">Django</span>
                <span className="skill-tag">DRF</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">REST</span>
              </div>
            </div>
            <div className="skill-card">
              <h3>Database</h3>
              <p>Modeling normalized schemas and writing efficient queries for data-intensive apps.</p>
              <div className="skill-tags">
                <span className="skill-tag">PostgreSQL</span>
                <span className="skill-tag">SQLite</span>
                <span className="skill-tag">MySQL</span>
                <span className="skill-tag">Firebase</span>
              </div>
            </div>
            <div className="skill-card">
              <h3>Tools & DevOps</h3>
              <p>Streamlining workflows with version control, CI/CD, and deployment tools.</p>
              <div className="skill-tags">
                <span className="skill-tag">Git</span>
                <span className="skill-tag">GitHub</span>
                <span className="skill-tag">Docker</span>
                <span className="skill-tag">Linux</span>
                <span className="skill-tag">VS Code</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section" id="projects">
          <div className="section-label">Projects</div>
          <h2 className="section-title">Things I&apos;ve Built</h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-card-header">
                <div className="project-card-number">01</div>
                <h3>Portfolio Website</h3>
                <p>
                  A full-stack personal portfolio built with React + Vite on the frontend
                  and Django REST Framework on the backend, connected via API proxy.
                </p>
              </div>
              <div className="project-card-footer">
                <div className="project-tech">
                  <span>React</span>
                  <span>Django</span>
                  <span>Vite</span>
                </div>
                <a href="https://github.com/voidnova-code" className="project-link" target="_blank" rel="noreferrer">
                  View →
                </a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-card-header">
                <div className="project-card-number">02</div>
                <h3>Mobile App</h3>
                <p>
                  Cross-platform mobile application built with Flutter and Dart,
                  featuring real-time data sync with Firebase backend.
                </p>
              </div>
              <div className="project-card-footer">
                <div className="project-tech">
                  <span>Flutter</span>
                  <span>Dart</span>
                  <span>Firebase</span>
                </div>
                <a href="https://github.com/voidnova-code" className="project-link" target="_blank" rel="noreferrer">
                  View →
                </a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-card-header">
                <div className="project-card-number">03</div>
                <h3>API Backend</h3>
                <p>
                  RESTful API service built with Django REST Framework, featuring
                  JWT authentication, rate limiting, and normalized PostgreSQL schema.
                </p>
              </div>
              <div className="project-card-footer">
                <div className="project-tech">
                  <span>Python</span>
                  <span>DRF</span>
                  <span>PostgreSQL</span>
                </div>
                <a href="https://github.com/voidnova-code" className="project-link" target="_blank" rel="noreferrer">
                  View →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="section" id="education">
          <div className="section-label">Education</div>
          <h2 className="section-title">Academic Background</h2>
          <div className="education-list">
            <div className="education-item">
              <div className="edu-year">2024</div>
              <div className="edu-details">
                <h3>B.Tech in Computer Science</h3>
                <p>Currently pursuing undergraduate degree with focus on software engineering, data structures, algorithms, and full-stack development.</p>
              </div>
            </div>
            <div className="education-item">
              <div className="edu-year">2022</div>
              <div className="edu-details">
                <h3>Higher Secondary (12th)</h3>
                <p>Completed higher secondary education with focus on Science (PCM) and Computer Science.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-section" id="contact">
          <div className="section-label" style={{ justifyContent: 'center' }}>Get in Touch</div>
          <h2 className="section-title">Let&apos;s Work<br />Together.</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h4>Email</h4>
              <a href="mailto:sayanrotor0@gmail.com">sayanrotor0@gmail.com</a>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h4>Phone</h4>
              <a href="tel:+919900577770">+91 9900 577770</a>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h4>Location</h4>
              <p>Guwahati, Assam, India</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <h4>GitHub</h4>
              <a href="https://github.com/voidnova-code" target="_blank" rel="noreferrer">voidnova-code</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2026 Sayan Kumar Roy. All rights reserved.</p>
          <p>Built with React + Django</p>
        </footer>
      </main>

      {/* SCROLL INDICATOR */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-circle">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* BACKEND STATUS BADGE */}
      <div
        className={`backend-badge ${
          backendStatus.loading ? 'loading' : backendStatus.connected ? 'connected' : 'error'
        }`}
      >
        <span className={`badge-dot ${backendStatus.loading ? 'pulse' : ''}`} />
        {backendStatus.loading
          ? 'Checking…'
          : backendStatus.connected
            ? `✓ ${backendStatus.message}`
            : `✗ ${backendStatus.message}`}
      </div>
    </>
  )
}

export default App
