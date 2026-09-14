"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load the 3D scene so First Paint isn't blocked
const SceneCanvas = dynamic(() => import("../components/scene/SceneCanvas"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#06080d]" />,
});

// Custom Cursor component (matches old site behavior)
function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');

    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', moveCursor);
    animate();

    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>
    </>
  );
}

// Navigation
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">NM<span>.</span></div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

// Project Card Component
function ProjectCard({
  num, name, desc, tech, link, featured = false
}: {
  num: string, name: string, desc: string, tech: string[], link: string, featured?: boolean
}) {
  return (
    <div className={`project-card ${featured ? 'featured' : ''}`}>
      <div className="project-num">{num}</div>
      <h3 className="project-name">{name}</h3>
      <p className="project-desc">{desc}</p>
      <div className="project-tech">
        {tech.map((t, i) => <span key={i} className="tech-chip">{t}</span>)}
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
        View Code
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </a>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Intersection Observer for scroll reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <main className="page-content">
      <CustomCursor />
      <Nav />
      <SceneCanvas />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow-blue"></div>
        <div className="hero-content">
          <div className="hero-tag">Available for opportunities · India · UAE</div>
          <h1 className="hero-title">
            Numan<br />
            <span className="accent">Maldar</span>
          </h1>
          <p className="hero-desc">
            CS Graduate from NIT Goa. Data Engineer & Full Stack Developer with real-world industry experience — building pipelines, shipping models, and integrating generative AI.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="mailto:numanmaldar74@gmail.com" className="btn-secondary">Get In Touch</a>
            <a href="https://drive.google.com/file/d/1r_fbwLtXVCs8N66FBUkBDICp-JfD4MAQ/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-outline-signal">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">8.02</div>
            <div className="stat-label">CGPA / NIT Goa</div>
          </div>
          <div className="stat">
            <div className="stat-num">3rd</div>
            <div className="stat-label">National Rank · TATHYA</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section section-alt">
        <div className="section-header reveal">
          <span className="section-num">01</span>
          <h2 className="section-title">About</h2>
          <div className="section-line"></div>
        </div>
        <div className="about-grid reveal">
          <div className="about-text">
            <p>I'm a <strong>B.Tech Computer Science graduate</strong> from National Institute of Technology Goa (CGPA: 8.02), currently based in Dubai. I bridge the gap between data engineering and product development — comfortable building ML pipelines in Databricks and shipping full-stack web applications.</p>
            <p>Working in the industry gave me hands-on experience with real-world data — messy, large-scale, and high-stakes. I built regression models for freight rate prediction, automated vessel data scraping, and contributed to generative AI pipelines using LLaMA and ElevenLabs.</p>
            <p>Outside of code, I captained the <strong>NIT Goa Football Team</strong> at the Inter-NIT Tournament and won 1st place at a national rap competition — which probably explains why I care about rhythm in everything I build.</p>
          </div>
          <div className="skills-grid">
            <div>
              <div className="skill-group-label">Languages & Cloud</div>
              <div className="skill-tags">
                <span className="tag">Python</span>
                <span className="tag">TypeScript</span>
                <span className="tag">C++</span>
                <span className="tag">SQL</span>
                <span className="tag">GCP</span>
                <span className="tag">Databricks</span>
              </div>
            </div>
            <div>
              <div className="skill-group-label">Frameworks & Libraries</div>
              <div className="skill-tags">
                <span className="tag">Next.js</span>
                <span className="tag">FastAPI</span>
                <span className="tag">React</span>
                <span className="tag">scikit-learn</span>
                <span className="tag">Three.js</span>
                <span className="tag">Pydantic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="section-header reveal">
          <span className="section-num">02</span>
          <h2 className="section-title">Experience</h2>
          <div className="section-line"></div>
        </div>
        <div className="exp-list reveal-stagger">
          <div className="exp-card">
            <div className="exp-top">
              <h3 className="exp-company">DP World Dubai</h3>
              <span className="exp-period">May 2025 - July 2025</span>
            </div>
            <div className="exp-role">Data Analyst Intern</div>
            <ul className="exp-bullets">
              <li>Developed Databricks pipelines with PySpark for freight rate forecasting.</li>
              <li>Scraped large vessel data using Playwright/Selenium for supply chain analytics.</li>
              <li>Integrated generative AI tools (LLaMA, ElevenLabs) to automate communication workflows.</li>

            </ul>
          </div>

          <div className="exp-card">
            <div className="exp-top">
              <h3 className="exp-company">NIT Goa Research</h3>
              <span className="exp-period">Aug 2025 - May 2026</span>
            </div>
            <div className="exp-role">Undergraduate Researcher</div>
            <ul className="exp-bullets">
              <li>Designed and implemented a 'Cluster-First Route Second' heuristic algorithm in Python for the CVRP (Capacitated Vehicle Routing Problem).</li>
              <li>Demonstrated 12% reduction in fleet travel distance over standard greedy algorithms on benchmark datasets.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section section-alt">
        <div className="section-header reveal">
          <span className="section-num">03</span>
          <h2 className="section-title">Selected Work</h2>
          <div className="section-line"></div>
        </div>
        <div className="projects-grid reveal-stagger">
          <ProjectCard
            num="01"
            name="Manifest — Freight Ledger"
            desc="Full-stack logistics application for logging and visualizing ocean freight rates across global routes. Uses Pydantic for strong typing and SQLite for the backend store."
            tech={['Next.js', 'TypeScript', 'FastAPI', 'Tailwind', 'SQLAlchemy']}
            link="https://github.com/numanmaldar/manifest-freight-ledger"
            featured={true}
          />
          <ProjectCard
            num="02"
            name="AI Support Triage Pipeline"
            desc="End-to-end LLM pipeline over 73K+ Twitter threads. Implements intent classification (80.7% accuracy), retrieval-grounded generation, and an automated LLM-as-judge eval."
            tech={['Python', 'Gemini API', 'scikit-learn', 'sentence-transformers']}
            link="https://github.com/numanmaldar/support-triage-pipeline"
          />
          <ProjectCard
            num="03"
            name="Tree Crown Counter"
            desc="Computer vision system for environmental data analysis. Identifies and counts tree crowns from remote sensing imagery using image processing algorithms."
            tech={['Python', 'OpenCV', 'Numpy', 'Data Analysis']}
            link="https://github.com/numanmaldar/tree-crown-counter"
          />
          <ProjectCard
            num="04"
            name="Linux IOCTL LED Driver"
            desc="A C-based character device driver (kernel module) for Linux that simulates a virtual LED via custom ioctl commands, demonstrating kernel-space execution."
            tech={['C', 'Linux Kernel', 'Ioctl']}
            link="https://github.com/numanmaldar/linux-ioctl-led-driver"
          />
          <ProjectCard
            num="05"
            name="InternPer"
            desc="Django-based internship aggregator that scrapes opportunities using Selenium and stores them in a MySQL database for students to search and track."
            tech={['Django', 'Selenium', 'MySQL', 'BeautifulSoup']}
            link="https://github.com/numanmaldar/InterPer"
          />
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <section id="contact" className="contact-section">
        <h2 className="contact-big">Let's <span className="accent">Connect</span></h2>
        <p className="contact-sub">Currently open for full-time software engineering and data roles.</p>
        <div className="contact-links">
          <a href="mailto:numanmaldar74@gmail.com" className="contact-link">Email</a>
          <a href="https://linkedin.com/in/numan-maldar" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
          <a href="https://github.com/numanmaldar" target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
          <a href="https://wa.me/971502690226" target="_blank" rel="noopener noreferrer" className="contact-link">WhatsApp</a>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Numan Maldar. Built with Next.js & R3F.</p>
      </footer>
    </main>
  );
}
