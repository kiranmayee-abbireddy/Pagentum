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
  `.trim();
};
