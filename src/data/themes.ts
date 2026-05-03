import { ThemeConfig } from '../types';

export const themePresets: Record<string, ThemeConfig> = {
  clean: {
    name: 'Clean',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    gradientStart: '#2563eb',
    gradientEnd: '#60a5fa',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    spacing: '1rem'
  },
  bold: {
    name: 'Bold',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    accentColor: '#ef4444',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    gradientStart: '#dc2626',
    gradientEnd: '#f97316',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '18px',
    spacing: '1.25rem'
  },
  soft: {
    name: 'Soft',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    accentColor: '#c084fc',
    backgroundColor: '#faf5ff',
    textColor: '#4c1d95',
    gradientStart: '#8b5cf6',
    gradientEnd: '#d8b4fe',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    spacing: '1rem'
  },
  dark: {
    name: 'Dark',
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    accentColor: '#22d3ee',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    gradientStart: '#06b6d4',
    gradientEnd: '#0891b2',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    spacing: '1rem'
  }
};


export const generateCSS = (theme: ThemeConfig): string => {
  return `
:root {
  --primary-color: ${theme.primaryColor};
  --secondary-color: ${theme.secondaryColor};
  --accent-color: ${theme.accentColor || theme.primaryColor};
  --bg-color: ${theme.backgroundColor};
  --text-color: ${theme.textColor};
  --gradient-start: ${theme.gradientStart || theme.primaryColor};
  --gradient-end: ${theme.gradientEnd || theme.secondaryColor};
  --font-family: ${theme.fontFamily};
  --font-size: ${theme.fontSize};
  --spacing: ${theme.spacing};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

*::-webkit-scrollbar {
  display: none;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  background: var(--bg-color);
  line-height: 1.6;
  overflow-x: hidden !important;
}

section {
  padding: calc(var(--spacing) * 4) calc(var(--spacing) * 2);
}

/* --- Layout Utilities for Sections --- */
.video-section { width: 100%; position: relative; }
.video-inner { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 3rem; 
  width: 100%; 
  max-width: 1200px; 
  margin: 0 auto; 
}

@media (min-width: 1024px) {
  .video-inner { flex-direction: row; gap: 6rem; }
  .video-inner.lg\:flex-row-reverse { flex-direction: row-reverse; }
  .video-inner.video-center { flex-direction: column; text-align: center; }
}

.video-text { flex: 1; }
.video-container { 
  flex: 1.5; 
  width: 100%; 
  aspect-ratio: 16 / 9; 
  background: black; 
  border-radius: 2rem; 
  overflow: hidden;
}
.video-container iframe { width: 100%; height: 100%; border: 0; }

.aspect-video { aspect-ratio: 16 / 9; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.w-full { width: 100%; }
.max-w-7xl { max-width: 80rem; }
.mx-auto { margin-left: auto; margin-right: auto; }


.hero-section {
  min-height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  padding-top: calc(var(--spacing) * 8) !important;
  padding-bottom: calc(var(--spacing) * 5) !important;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  width: 100% !important;
}

.hero-content {
  max-width: 800px;
  padding: var(--spacing);
}

.hero-title {
  font-size: calc(var(--font-size) * 2.5);
  font-weight: 700;
  margin-bottom: calc(var(--spacing) * 1.5);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: calc(var(--font-size) * 1.25);
  margin-bottom: calc(var(--spacing) * 2);
  opacity: 0.95;
  line-height: 1.5;
}

.hero-cta, .cta-button, .pricing-button {
  background: white;
  color: var(--primary-color);
  padding: calc(var(--spacing) * 0.75) calc(var(--spacing) * 2);
  border: none;
  border-radius: 8px;
  font-size: calc(var(--font-size) * 1.1);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-cta:hover, .cta-button:hover, .pricing-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* --- FULL WIDTH SECTIONS & BREAKOUT --- */
.hero-advanced, 
section[style*="background"], 
div[style*="background"] {
  width: 100vw !important;
  max-width: 100vw !important;
  position: relative !important;
  left: 50% !important;
  right: 50% !important;
  margin-left: -50vw !important;
  margin-right: -50vw !important;
  box-sizing: border-box !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Ensure content stays centered within broken-out sections */
.hero-inner, 
.hero-advanced > div:not(.video-background-container, .overlay), 
section[style*="background"] > div:not(.product-track, .video-background-container, .overlay),
div[style*="background"] > section {
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100% !important;
  padding-left: calc(var(--spacing) * 2) !important;
  padding-right: calc(var(--spacing) * 2) !important;
  box-sizing: border-box !important;
  position: relative;
  z-index: 1;
}

.hero-advanced {
  min-height: 100vh !important;
  padding-top: calc(var(--spacing) * 8) !important;
  padding-bottom: calc(var(--spacing) * 5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.hero-inner {
  display: flex !important;
  align-items: center !important;
  gap: 4rem !important;
  width: 100% !important;
}

.hero-text {
  flex: 1;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 1.5rem;
  shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(var(--spacing) * 3);
  text-align: left;
  padding: calc(var(--spacing) * 4);
}

.hero-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--font-size) * 2);
  border: 2px dashed rgba(255,255,255,0.4);
}

.features-section, .testimonials-section, .pricing-section {
  background: var(--bg-color);
}

.section-title {
  font-size: calc(var(--font-size) * 2);
  font-weight: 700;
  text-align: center;
  margin-bottom: calc(var(--spacing) * 3);
  color: var(--text-color);
  position: relative;
  z-index: 5;
}

.features-grid, .testimonials-grid, .pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: calc(var(--spacing) * 2);
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card, .testimonial-card {
  padding: calc(var(--spacing) * 2);
  background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
  border-radius: 12px;
  transition: transform 0.2s;
}

.feature-card:hover, .testimonial-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: calc(var(--font-size) * 2.5);
  margin-bottom: var(--spacing);
}

.feature-title {
  font-size: calc(var(--font-size) * 1.3);
  font-weight: 600;
  margin-bottom: calc(var(--spacing) * 0.5);
  color: var(--text-color);
}

.feature-description {
  color: var(--secondary-color);
  line-height: 1.5;
}

.cta-section {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  text-align: center;
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 2);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: calc(var(--font-size) * 2.2);
  font-weight: 700;
  margin-bottom: var(--spacing);
}

.cta-subtitle {
  font-size: calc(var(--font-size) * 1.2);
  margin-bottom: calc(var(--spacing) * 2);
  opacity: 0.95;
}

.testimonial-quote {
  font-size: calc(var(--font-size) * 1.1);
  font-style: italic;
  margin-bottom: var(--spacing);
  line-height: 1.6;
}

.testimonial-author {
  font-weight: 600;
  color: var(--primary-color);
}

.pricing-card {
  padding: calc(var(--spacing) * 2.5);
  background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.pricing-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
}

.pricing-featured {
  border-color: var(--primary-color);
  position: relative;
  transform: scale(1.05);
}

.pricing-tier {
  font-size: calc(var(--font-size) * 1.5);
  font-weight: 700;
  margin-bottom: calc(var(--spacing) * 0.5);
  color: var(--text-color);
}

.pricing-price {
  font-size: calc(var(--font-size) * 2);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: calc(var(--spacing) * 1.5);
}

.pricing-features {
  list-style: none;
  margin-bottom: calc(var(--spacing) * 2);
  text-align: left;
}

.pricing-features li {
  padding: calc(var(--spacing) * 0.5) 0;
  border-bottom: 1px solid ${theme.backgroundColor === '#ffffff' ? '#e2e8f0' : 'rgba(255,255,255,0.1)'};
}

.pricing-features li:last-child {
  border-bottom: none;
}

.footer-section {
  background: var(--bg-color);
  color: var(--text-color);
  border-top: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 2);
}

.footer-advanced {
  background: var(--bg-color);
  color: var(--text-color);
  border-top: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: calc(var(--spacing) * 2);
  margin-bottom: calc(var(--spacing) * 1.5);
  flex-wrap: wrap;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-copyright {
  font-size: calc(var(--font-size) * 0.9);
  opacity: 0.8;
}
.hero-inner {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 2);
}

@media (min-width: 1024px) {
  .hero-inner {
    flex-direction: row;
    align-items: center;
    gap: calc(var(--spacing) * 4);
  }
  .hero-inner.lg\\:flex-row-reverse {
    flex-direction: row-reverse;
  }
}

.hero-text {
  flex: 1;
  text-align: center;
}


@media (min-width: 1024px) {
  .hero-text { 
    text-align: left; 
    align-items: flex-start;
  }
}

.hero-text h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: calc(var(--spacing) * 1.5);
  color: var(--text-color);
}

.hero-text p {
  font-size: calc(var(--font-size) * 1.25);
  color: var(--secondary-color);
  max-width: 32rem;
  margin: 0 auto calc(var(--spacing) * 2) auto;
}

@media (min-width: 1024px) {
  .hero-text p { 
    margin: 0 0 calc(var(--spacing) * 2) 0; 
  }
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .hero-image { 
    justify-content: flex-end; 
  }
}

.hero-image img {
  width: 100%;
  max-width: 24rem;
  height: 20rem;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.image-placeholder {
  width: 100%;
  height: 20rem;
  background: rgba(255,255,255,0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  font-size: calc(var(--font-size) * 1.5);
}

/* Product Carousel */
.product-carousel {
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 1);
  overflow-x: hidden;
  margin: 0 auto;
}

.product-carousel h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: calc(var(--spacing) * 1);
  color: var(--text-color);
}

.product-carousel-text{
  font-size: calc(var(--font-size) * 1.25);
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: calc(var(--spacing) * 3);
  width: 100%;
}

.product-track {
  display: flex;
  overflow-x: visible;
  align-items: stretch; 
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  gap: calc(var(--spacing) * 1.5);
  padding-bottom: calc(var(--spacing) * 1.25);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.product-track::-webkit-scrollbar { 
  display: none; 
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 17.5rem;
  scroll-snap-align: center;
  background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
  border-radius: 2.5rem 0 2.5rem 0 !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 2.5rem 0 0 0;
}

.product-info {
  padding: calc(var(--spacing) * 1.5);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-info p {
  color: var(--secondary-color);
  margin-bottom: calc(var(--spacing) * 1);
  flex-grow: 1; /* pushes button down */
}

.product-info a {
  margin-top: auto; /* forces button to bottom */
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: calc(var(--spacing) * 0.75) calc(var(--spacing) * 1.5);
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
}

.product-info a:hover {
  background: ${theme.primaryColor?.replace(/[\d]{2,3}$/, (match) => {
    const num = parseInt(match) - 20;
    return num.toString().padStart(3, '0');
  }) || '#1d4ed8'};
  transform: translateY(-1px);
}

/* Navbar */
.site-navbar {
  background: transparent !important;
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.nav-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: calc(var(--spacing) * 1) calc(var(--spacing) * 1.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 0.75);
}

.nav-brand img {
  height: 2.5rem;
  width: auto;
}

.nav-brand span {
  font-size: calc(var(--font-size) * 1.25);
  font-weight: 800;
  color: inherit !important;
}

.nav-links {
  display: flex;
  gap: calc(var(--spacing) * 1.5);
  flex-wrap: wrap;
  justify-content: center;
}

.nav-links a {
  color: inherit !important;
  opacity: 0.9;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* Mobile Menu Toggle */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  display: block;
  width: 25px;
  height: 2px;
  background: var(--text-color);
  margin: 5px 0;
  transition: 0.4s;
}

@media (max-width: 1024px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--bg-color);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem !important;
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -15px 0 35px rgba(0,0,0,0.1);
    z-index: 1000;
    padding: 3rem 2rem;
  }

  .nav-links.active {
    right: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  .mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
  }
  .mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}
.hero-advanced a {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
}
.hero-advanced a:hover {
  background-color: #1e40af; /* darker shade */
}
.product-carousel > p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: var(--secondary-color);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

@keyframes auto-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.product-track.animate-auto-scroll {
  animation: auto-scroll 30s linear infinite;
}

@media (max-width: 1024px) {
  .nav-links a { 
    font-size: calc(var(--font-size) * 1.125); 
  }
}

@media (max-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: calc(var(--font-size) * 1.8);
  }

  .section-title {
    font-size: calc(var(--font-size) * 1.5);
  }

  .features-grid, .testimonials-grid, .pricing-grid {
    grid-template-columns: 1fr;
  }
}
  /* COMPLETE Bookshelf Grid - ADD THIS */
.bookshelf-section {
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 1);
  max-width: 80rem;
  margin: 0 auto;
}

.bookshelf-grid {
  perspective: 1000px;
  display: grid;
  grid-template-columns: 1fr;
  gap: calc(var(--spacing) * 2);
}

@media (min-width: 768px) {
  .bookshelf-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .bookshelf-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .bookshelf-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.book-card {
  transform-style: preserve-3d;
  position: relative;
  width: 16rem;
  min-height: 28rem;
  display: flex;
  flex-direction: column;
  border-radius: 2.5rem 0 2.5rem 0 !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  background: ${theme.backgroundColor === '#ffffff' ? 'white' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${theme.backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.2)'};
  overflow: hidden;
  transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

.book-card:hover {
  transform: scale(1.1) translateY(-0.75rem) translateZ(25px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  z-index: 20;
}

.group {
  position: relative;
}

.book-card img {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  border-radius: 2.5rem 0 0 0;
  transition: transform 500ms ease;
}

.group:hover .book-card img {
  transform: scale(1.05);
}

.book-card > div {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-card h3 {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card .text-primary {
  color: var(--primary-color) !important;
  font-size: 1.375rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
}

.book-card p:last-of-type {
  font-size: 0.875rem;
  color: var(--secondary-color);
  line-height: 1.4;
  flex: 1;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: auto;
  transition: all 300ms ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.book-card a:hover {
  background: color-mix(in srgb, var(--primary-color), black 20%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .book-card {
    width: 100%;
    max-width: 320px;
    height: auto;
    min-height: 24rem;
  }
  .book-card img {
    height: 10rem;
  }
}

.glowing-bookshelf {
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 1);
  max-width: 80rem;
  margin: 0 auto;
}

.main__heading {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: calc(var(--spacing) * 1);
  color: var(--text-color);
}

.product-carousel-text {
  font-size: calc(var(--font-size) * 1.25);
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: calc(var(--spacing) * 3);
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: calc(var(--spacing) * 2);
}

@media (min-width: 768px) { .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .cards { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 1280px) { .cards { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

.card {
  /* EXACT .product-card sizes */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 28rem; /* Matches product-card with 12rem img + padding */
  flex: 1 1 17.5rem; /* EXACT product-card flex */
  
  /* Uiverse base styling */
  --flow-space: 0.5em;
  --hsl: var(--hue), var(--saturation), var(--lightness);
  padding: calc(var(--spacing) * 1.5); /* Matches .product-info */
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  border-radius: 2.5rem 0 2.5rem 0 !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all ease-in-out 0.3s;
}
  .card__description {
  color: var(--secondary-color);
  line-height: 1.5;
  margin-bottom: calc(var(--spacing) * 1);
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: calc(var(--font-size) * 0.95);
}

.empty-card {
  grid-column: 1 / -1;
  padding: 3rem 2rem;
  border: 2px dashed rgba(255,255,255,0.3);
  border-radius: 1rem;
  text-align: center;
  color: var(--text-color);
  background: rgba(255,255,255,0.05);
}


.card__image {
  width: 100%;
  height: 12rem; /* EXACT .product-image img height */
  object-fit: cover;
  border-radius: 2rem 0 0 0;
  margin-bottom: calc(var(--spacing) * 0.5);
}

.card__heading {
  font-size: calc(var(--font-size) * 1.1); /* Matches product title */
  font-weight: 600;
  margin: 0 0 calc(var(--spacing) * 0.5) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__price {
  font-size: calc(var(--font-size) * 1.5); /* Slightly larger than heading */
  font-weight: 700;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 calc(var(--spacing) * 0.5) 0;
}



.cta {
  /* EXACT .product-info a styling */
  margin-top: auto;
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: calc(var(--spacing) * 0.75) calc(var(--spacing) * 1.5);
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
}

.cta:hover {
  background: ${theme.primaryColor?.replace(/[\d]{2,3}$/, (match) => {
    const num = parseInt(match) - 20;
    return num.toString().padStart(3, '0');
  }) || '#1d4ed8'};
  transform: translateY(-1px);
}

/* UIVERSE MAGIC GLOW - ONLY ON HOVER */
.card:hover {
  --lightness: 80%;
  background: rgba(255,255,255,0.125);
  outline: 1px solid rgba(255,255,255,0.5);
  box-shadow: 
    inset 0 0 80px rgba(255,255,255,0.2),
    inset 20px 0 80px var(--primary-color),
    inset -20px 0 80px var(--bg-color),
    inset 20px 0 300px var(--secondary-color),
    inset -20px 0 300px var(--bg-color),
    0 0 50px rgba(255,255,255,0.5),
    -10px 0 80px var(--secondary-color),
    10px 0 80px var(--bg-color);
  
  z-index: 10;
}
/* === UIVERSE AUTO-SCROLL SLIDER === */
.slider {
  width: 100%;
  height: var(--height, 360px);
  margin: 0 auto;
}

.slider .list {
  display: flex;
  width: 100%;
  min-width: calc(var(--width, 280px) * var(--quantity));
  position: relative;
}

.slider .list .item {
  width: var(--width, 280px);
  height: var(--height, 360px);
  position: absolute;
  left: 100%;
  animation: autoRun 20s linear infinite;
  transition: filter 0.5s;
  animation-delay: calc((20s / var(--quantity)) * (var(--position) - 1) - 20s) !important;
}

@keyframes autoRun {
  from { left: 100%; }
  to { left: calc(var(--width, 280px) * -1); }
}

.slider:hover .item {
  animation-play-state: paused !important;
  filter: grayscale(0.3);
}

.slider .item:hover {
  filter: grayscale(0) brightness(1.1);
  transform: scale(1.05);
}

/* CARD STYLING - Theme integrated */
.auto-card {
  width: 100%;
  height: 100%;
  padding: calc(var(--spacing) * 1);
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: 2.5rem 0 2.5rem 0 !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.auto-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.auto-card:hover::before {
  transform: translateX(100%);
}

.auto-card-image img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 2rem 0 0 0;
  margin-bottom: calc(var(--spacing) * 0.5);
}

.auto-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: calc(var(--spacing) * 1);
}

.auto-card-title {
  font-size: calc(var(--font-size) * 1.1);
  font-weight: 700;
  margin-bottom: calc(var(--spacing) * 0.25);
  line-height: 1.3;
}

.auto-card-price {
  font-size: calc(var(--font-size) * 1.4);
  font-weight: 800;
  margin-bottom: calc(var(--spacing) * 0.5);
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.auto-card-desc {
  font-size: calc(var(--font-size) * 0.9);
  opacity: 0.9;
  line-height: 1.4;
  flex-grow: 1;
}

.auto-card-cta {
  margin-top: auto;
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 1);
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.auto-card-cta:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.empty-auto-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--spacing) * 2);
}
/* === RAIL CAROUSEL THEMED === */

.rail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: calc(var(--spacing) * 2);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 calc(var(--spacing) * 1);
}

.rail-card-box {
  width: 260px;
  min-height: 440px;
  height: auto;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 24px;
  box-shadow:
    rgba(0, 0, 0, 0.4) 0px 2px 10px 0px,
    rgba(0, 0, 0, 0.5) 0px 2px 25px 0px;
  transition: transform 0.3s ease;
}

.rail-card-box:hover {
  transform: translateY(-8px);
}

.rail-card {
  position: relative;
  width: 95%;
  height: 95%;
  background: color-mix(in srgb, var(--bg-color) 70%, #000 30%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
}

/* IMAGE (unchanged behavior) */
.rail-image {
  position: absolute;
  inset: 0;
  z-index: 1;
  transition: all 0.4s ease;
}

.rail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

/* BOTTOM PANEL */
.rail-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem 1rem 1.2rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--bg-color) 90%, #000 10%),
    transparent
  );
}

.rail-content {
  width: 100%;
  text-align: center;
}

.rail-title {
  font-size: 1.05rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  color: var(--text-color);
}

.rail-desc {
  font-size: 0.85rem;
  line-height: 1.45;
  color: color-mix(in srgb, var(--text-color) 80%, #ffffff 20%);
  margin-bottom: 0.5rem;
}

.rail-price {
  font-size: 1.15rem;
  font-weight: 900;
  margin-top: 0.25rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* CTA uses primary color tint */
.rail-cta {
  margin-top: 0.7rem;
  padding: 0.6rem 1.4rem;
  background: color-mix(in srgb, var(--primary-color) 40%, #ffffff 10%, transparent);
  color: #ffffff;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--primary-color) 50%, #ffffff 20%);
  backdrop-filter: blur(12px);
  transition: all 0.25s ease;
}

.rail-cta:hover {
  background: color-mix(in srgb, var(--primary-color) 55%, #ffffff 20%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

/* HOVER: SHRINK IMAGE + REVEAL BODY */
.rail-card:hover .rail-image {
  width: 70%;
  height: 45%;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.55);
}

.rail-card:hover .rail-body {
  opacity: 1;
  transform: translateY(0);
}

/* ROTATING GLOW BORDER USES PRIMARY/SECONDARY */
.rail-card-box::before {
  content: "";
  position: absolute;
  width: 45%;
  height: 160%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  transform-origin: center;
  animation: railGlow 4s linear infinite;
  filter: blur(10px);
  opacity: 0.5;
  z-index: 0;
  border-radius: 50%;
}

@keyframes railGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rail-empty {
  background: color-mix(in srgb, var(--bg-color) 70%, #ffffff 10%) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  padding-top: 2rem;
  color: var(--text-color);
}

/* RESPONSIVE IMPROVEMENTS */
@media (max-width: 1024px) {
  .rail-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: calc(var(--spacing) * 2);
  }
  .rail-card-box {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .rail-grid {
    grid-template-columns: 1fr;
    gap: calc(var(--spacing) * 2.5);
    padding: 0 calc(var(--spacing) * 2);
  }

  .rail-card-box {
    width: 100%;
    max-width: 360px;
    height: 400px;
    margin: 0 auto;
  }

  .product-track {
    flex-direction: column !important;
    align-items: center !important;
    gap: calc(var(--spacing) * 3) !important;
    padding: 0 calc(var(--spacing) * 1.5);
  }

  .product-card {
    flex: 0 0 85vw !important;
    max-width: 400px;
    margin: 0 auto;
  }

  .slider {
    --width: 90vw !important;
    --height: 480px !important;
  }

  .slider .list .item {
    animation-duration: 40s !important;
  }

  .auto-card {
    width: 100% !important;
  }

  .cards {
    grid-template-columns: 1fr !important;
    padding: 0 calc(var(--spacing) * 1.5);
  }
  
  .card {
    flex: 1 1 100% !important;
    max-width: 400px;
    margin: 0 auto;
    margin-bottom: calc(var(--spacing) * 2);
  }

  .bookshelf-grid, .cards, .rail-grid {
    grid-template-columns: 1fr !important;
    row-gap: calc(var(--spacing) * 4) !important;
    column-gap: 0 !important;
  }
}



/* Utilities for Standalone Export */
.text-center { text-align: center !important; }
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }
.mx-auto { margin-left: auto !important; margin-right: auto !important; }
.flex { display: flex !important; }
.flex-col { flex-direction: column !important; }
.items-center { align-items: center !important; }
.justify-center { justify-content: center !important; }
.inline-block { display: inline-block !important; }
.w-full { width: 100% !important; }
.max-w-7xl { max-width: 1280px !important; }
.max-w-lg { max-width: 32rem !important; }
.max-w-2xl { max-width: 42rem !important; }
.gap-4 { gap: 1rem !important; }
.gap-8 { gap: 2rem !important; }
.lg\\:gap-16 { gap: 4rem !important; }
.mb-4 { margin-bottom: 1rem !important; }
.mb-6 { margin-bottom: 1.5rem !important; }
.mb-8 { margin-bottom: 2rem !important; }
.mb-12 { margin-bottom: 3rem !important; }
.mb-16 { margin-bottom: 4rem !important; }
.py-20 { padding-top: 5rem !important; padding-bottom: 5rem !important; }
.px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
.px-8 { padding-left: 2rem !important; padding-right: 2rem !important; }
.py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
.rounded-lg { border-radius: 0.5rem !important; }
.rounded-2xl { border-radius: 1rem !important; }
.font-bold { font-weight: 700 !important; }
.font-semibold { font-weight: 600 !important; }
.bg-primary { background-color: var(--primary-color) !important; }
.text-white { color: white !important; }
.text-xl { font-size: 1.25rem !important; }
.text-3xl { font-size: 1.875rem !important; }
.text-4xl { font-size: 2.25rem !important; }
.lg\\:text-4xl { font-size: 2.25rem !important; }
.lg\\:text-5xl { font-size: 3rem !important; }
.transition-all { transition: all 0.3s ease !important; }
.opacity-80 { opacity: 0.8 !important; }
.opacity-90 { opacity: 0.9 !important; }

@media (min-width: 1024px) {
  .lg\\:flex-row { flex-direction: row !important; }
  .lg\\:flex-row-reverse { flex-direction: row-reverse !important; }
  .lg\\:items-center { align-items: center !important; }
  .lg\\:justify-end { justify-content: flex-end !important; }
  .lg\\:text-left { text-align: left !important; }
}

/* Overlay & Sticky Utilities */
.sticky { position: sticky !important; }
.fixed { position: fixed !important; }
.absolute { position: absolute !important; }

/* --- Portfolio Grid Theme Overrides --- */
.portfolio-section .bg-white { background-color: var(--bg-color) !important; }
.portfolio-section .border-gray-100 { border-color: color-mix(in srgb, var(--text-color) 10%, transparent) !important; }
.portfolio-section .text-gray-900 { color: var(--text-color) !important; }
.portfolio-section .bg-gray-50 { background-color: color-mix(in srgb, var(--text-color) 5%, transparent) !important; }
.portfolio-section .bg-gray-900\\/40 { background-color: color-mix(in srgb, var(--bg-color) 40%, transparent) !important; }
.portfolio-section .bg-blue-100 { background-color: color-mix(in srgb, var(--primary-color) 15%, transparent) !important; }
.portfolio-section .text-blue-600 { color: var(--primary-color) !important; }

/* --- Contact Section Theme Overrides --- */
.contact-section .bg-white\\/50 { background-color: color-mix(in srgb, var(--bg-color) 50%, transparent) !important; }
.contact-section .border-gray-100 { border-color: color-mix(in srgb, var(--text-color) 10%, transparent) !important; }
.contact-section .bg-blue-100, .contact-section .bg-green-100, .contact-section .bg-purple-100 { background-color: color-mix(in srgb, var(--primary-color) 15%, transparent) !important; }
.contact-section .text-blue-600, .contact-section .text-green-600, .contact-section .text-purple-600 { color: var(--primary-color) !important; }
.contact-section h3, .contact-section p { color: var(--text-color) !important; }

  `.trim();
};
