import { ThemeConfig } from '../types';

export const themePresets: Record<string, ThemeConfig> = {
  clean: {
    name: 'Clean',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    spacing: '1rem'
  },
  bold: {
    name: 'Bold',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '18px',
    spacing: '1.25rem'
  },
  soft: {
    name: 'Soft',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    backgroundColor: '#faf5ff',
    textColor: '#4c1d95',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    spacing: '1rem'
  },
  dark: {
    name: 'Dark',
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
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
  --bg-color: ${theme.backgroundColor};
  --text-color: ${theme.textColor};
  --font-family: ${theme.fontFamily};
  --font-size: ${theme.fontSize};
  --spacing: ${theme.spacing};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  background: var(--bg-color);
  line-height: 1.6;
}

section {
  padding: calc(var(--spacing) * 4) calc(var(--spacing) * 2);
}

.hero-section {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
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
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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
  background: ${theme.backgroundColor === '#ffffff' ? '#1e293b' : '#000000'};
  color: ${theme.backgroundColor === '#ffffff' ? '#f1f5f9' : '#9ca3af'};
  padding: calc(var(--spacing) * 3) calc(var(--spacing) * 2);
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
  .hero-advanced {
  padding: calc(var(--spacing) * 5) calc(var(--spacing) * 1);
  max-width: 80rem;
  margin: 0 auto;
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
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
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
  background: ${theme.backgroundColor === '#ffffff' ? 'white' : 'rgba(255,255,255,0.05)'};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: calc(var(--spacing) * 1) calc(var(--spacing) * 1.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: var(--text-color);
}

.nav-links {
  display: flex;
  gap: calc(var(--spacing) * 1.5);
}

.nav-links a {
  color: var(--secondary-color);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary-color);
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
}

@keyframes auto-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.product-track.animate-auto-scroll {
  animation: auto-scroll 30s linear infinite;
}


@media (max-width: 768px) {
  .nav-links { 
    gap: calc(var(--spacing) * 1); 
  }
  .nav-links a { 
    font-size: calc(var(--font-size) * 0.875); 
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--spacing) * 1.5);
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
  width: 11rem;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
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
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
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
  -webkit-line-clamp: 3;
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
    width: 9rem;
    height: 17rem;
  }
  .book-card img {
    height: 8rem;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--spacing) * 1.5);
}

@media (min-width: 768px) { .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .cards { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 1280px) { .cards { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

.card {
  /* EXACT .product-card sizes */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 24rem; /* Matches product-card with 12rem img + padding */
  flex: 1 1 17.5rem; /* EXACT product-card flex */
  
  /* Uiverse base styling */
  --flow-space: 0.5em;
  --hsl: var(--hue), var(--saturation), var(--lightness);
  padding: calc(var(--spacing) * 1.5); /* Matches .product-info */
  color: var(--text-color);
  border: 1px solid var(--primary-color);
  border-radius: 1rem; /* Matches product-card/book-card */
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
  -webkit-line-clamp: 3;
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
  border-radius: 0.5rem; /* Smaller radius for image */
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
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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

  padding: calc(var(--spacing) * 1);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 1rem;
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
  border-radius: 0.75rem;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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


  `.trim();
};
