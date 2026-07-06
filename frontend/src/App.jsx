import { useState, useEffect } from 'react'
import Silk from './Silk'
import FluidGlass from './FluidGlass'
import Lanyard from './Lanyard'
import RotatingText from './RotatingText'
import Folder from './Folder'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    loading: true,
    message: '',
  })
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [idImage, setIdImage] = useState(null)
  const [idImageReady, setIdImageReady] = useState(false)
  const [activeSkill, setActiveSkill] = useState(null)

  // Fetch ID Card image — use Vite proxy (/api) so media URLs share the same origin
  useEffect(() => {
    fetch('/api/id-card/')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          // Rewrite the absolute Django URL to a proxied relative path so
          // Three.js TextureLoader loads the image same-origin (no CORS)
          const raw = data.image_url
          const proxied = raw.replace(/^https?:\/\/[^/]+/, '')
          setIdImage(proxied)
          setIdImageReady(true)
        }
      })
      .catch((err) => console.error('Failed to fetch ID card image:', err))
  }, [])

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

  const renderSkillFolder = (title, desc, tags) => (
    <div className="skill-folder-wrapper">
      <div style={{ padding: '2rem 1rem 0 1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Folder
          size={1.7}
          color="#D4290C"
          onPaperClick={() => setActiveSkill({ title, desc, tags })}
          items={[
            /* Back Paper (Abstract lines looking like a text document) */
            <div key="1" style={{ padding: '8px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box' }}>
              <div style={{ width: '40%', height: '3px', background: '#ccc', borderRadius: '2px', marginBottom: '4px' }} />
              <div style={{ width: '80%', height: '3px', background: '#ddd', borderRadius: '2px' }} />
              <div style={{ width: '90%', height: '3px', background: '#ddd', borderRadius: '2px' }} />
              <div style={{ width: '70%', height: '3px', background: '#ddd', borderRadius: '2px' }} />
              <div style={{ width: '85%', height: '3px', background: '#ddd', borderRadius: '2px' }} />
              <div style={{ width: '60%', height: '3px', background: '#ddd', borderRadius: '2px' }} />
            </div>,
            /* Middle Paper (Grid of tags looking like a technical spec) */
            <div key="2" style={{ padding: '8px', width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '5px', fontWeight: 'bold', color: '#999', width: '100%', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tech Specs</div>
              {tags.map(t => (
                <span key={t} style={{ fontSize: '4.5px', padding: '2px 4px', backgroundColor: '#e8e8e8', color: '#555', borderRadius: '2px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{t}</span>
              ))}
            </div>,
            /* Front Paper (Cover page with the Title) */
            <div key="3" style={{ padding: '8px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width: '100%', height: '6px', background: 'var(--red)', borderRadius: '2px', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '11px', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-heading)', color: '#111', textAlign: 'center', lineHeight: 1.1 }}>{title}</h3>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '3px', justifyContent: 'center' }}>
                <div style={{ width: '15px', height: '3px', background: '#ccc', borderRadius: '1.5px' }} />
                <div style={{ width: '15px', height: '3px', background: '#ccc', borderRadius: '1.5px' }} />
              </div>
            </div>
          ]}
        />
      </div>
      {/* Animated label below the folder */}
      <div className="skill-folder-label">
        <span className="skill-folder-label-text">{title}</span>
        <span className="skill-folder-label-count">{tags.length} tools</span>
        <div className="skill-folder-label-line" />
      </div>
    </div>
  )


  return (
    <>
      {/* ===== BACKGROUND SILK ===== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Silk
          speed={5}
          scale={1}
          color="#3a383f"
          noiseIntensity={1}
          rotation={0}
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

        <section className="section" id="about" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="about-grid">
            <div className="about-content">
              <div className="section-label">About Me</div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', minHeight: '3.5rem', textTransform: 'uppercase' }}>
                <span>Who am I, A</span>
                <RotatingText
                  texts={['DEVELOPER ?', 'CREATOR ?', 'BUILDER ?']}
                  mainClassName="rotating-badge"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="word-wrapper"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={3000}
                  splitBy="characters"
                  auto
                  loop
                />
              </h2>
              <p className="hero-description" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                I&apos;m a Computer Science undergraduate who spends an unhealthy amount of time building full-stack apps and staring at terminal windows. From spinning up sleek Flutter interfaces to wrestling with Django backends and PostgreSQL databases, I love bringing ideas to life—even if it means occasionally questioning my sanity over a missing semicolon.
              </p>
              <p className="hero-description" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                But my world isn&apos;t just ones and zeros! I also have a creative side: I use Blender to sculpt 3D models (so my digital worlds look as good as they function) and I edit videos in DaVinci Resolve to make sure the final cuts are cinematic masterpieces.
              </p>
              <p className="hero-description" style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                When I finally step away from the glowing rectangle, you can usually find me cooking up a storm in the kitchen (debugging recipes is remarkably similar to debugging code) or swimming to burn off all the calories from said cooking. I&apos;m always down to collaborate on wild new projects or debate the best pizza toppings!
              </p>
            </div>
            <div className="about-3d">
              {idImageReady
                ? <Lanyard position={[0, 0.5, 20]} gravity={[0, -40, 0]} frontImage={idImage} />
                : null
              }
            </div>
          </div>
        </section>

        {/* THIN RED STRIP DIVIDER */}
        <div className="section-divider"></div>

        {/* SKILLS */}
        <section className="section" id="skills" style={{ position: 'relative' }}>
          {/* Huge background text */}
          <div className="bg-watermark">EXPERTISE</div>
          
          <div className="section-label">Skills</div>
          <h2 className="section-title">What I Work With</h2>
          <p className="section-subtitle">
            Hover over the folders to peek inside, and click any paper to open the full dossier on my technical stack, tools, and creative expertise.
          </p>
          <div className="skills-grid">
            {renderSkillFolder('Frontend', 'Building pixel-perfect, highly responsive, and high-performance user interfaces with modern frameworks. Passionate about crafting dynamic experiences that engage users from the first click, focusing on fluid animations and component-driven architecture.', ['React', 'Flutter', 'JavaScript', 'Dart', 'HTML/CSS'])}
            {renderSkillFolder('Backend', 'Designing robust APIs and secure server-side logic with reliability and scalability in mind. Focused on implementing secure authentication, real-time data processing, and optimizing server infrastructure to seamlessly handle massive traffic.', ['Django', 'DRF', 'Python', 'Node.js', 'REST'])}
            {renderSkillFolder('Database', 'Modeling normalized schemas and writing highly optimized queries for data-intensive applications. Experienced in advanced indexing, caching strategies, and managing real-time data synchronization for absolute data integrity.', ['PostgreSQL', 'SQLite', 'MySQL', 'Firebase'])}
            {renderSkillFolder('Tools & DevOps', 'Streamlining complex workflows with advanced version control, CI/CD pipelines, and modern deployment tools. Dedicated to automating repetitive tasks and containerizing environments with Docker for robust, testable codebases.', ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code'])}
            {renderSkillFolder('3D Modeling', 'Sculpting realistic 3D models and rendering immersive digital environments. Skilled in hard-surface modeling, complex texturing, and cinematic lighting to bring imaginative concepts into tangible visual assets using Blender.', ['Blender', '3D Modeling', 'Rendering'])}
            {renderSkillFolder('Video Editing', 'Delivering professional video editing, cinematic color grading, and dynamic post-production. Transforming raw footage into engaging stories with precise pacing and atmospheric sound design using DaVinci Resolve.', ['DaVinci Resolve', 'Video Editing', 'Color Grading'])}
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
        className={`backend-badge ${backendStatus.loading ? 'loading' : backendStatus.connected ? 'connected' : 'error'
          }`}
      >
        <span className={`badge-dot ${backendStatus.loading ? 'pulse' : ''}`} />
        {backendStatus.loading
          ? 'Checking…'
          : backendStatus.connected
            ? `✓ ${backendStatus.message}`
            : `✗ ${backendStatus.message}`}
      </div>
      {/* ACTIVE SKILL MODAL */}
      <AnimatePresence>
        {activeSkill && (
          <motion.div
            className="skill-modal-backdrop"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={() => setActiveSkill(null)}
          >
            <motion.div
              className="skill-modal-content"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="skill-modal-close" onClick={() => setActiveSkill(null)}>✕</button>
              <h2 className="skill-modal-title">{activeSkill.title}</h2>
              <div className="skill-modal-divider"></div>
              <p className="skill-modal-desc">{activeSkill.desc}</p>
              <div className="skill-modal-tags">
                {activeSkill.tags.map((t, i) => (
                  <motion.span 
                    key={t} 
                    className="skill-tag"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'var(--red)', color: 'var(--white)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ cursor: 'pointer' }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
