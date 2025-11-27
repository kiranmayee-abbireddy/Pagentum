import { SectionTemplate } from '../types';

export const sectionTemplates: SectionTemplate[] = [
  {
    id: 'hero-1',
    name: 'Hero Banner',
    category: 'hero',
    description: 'Hero section with headline, subheadline, and CTA button',
    html: `
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">{{title}}</h1>
          <p class="hero-subtitle">{{subtitle}}</p>
          <button class="hero-cta">{{ctaText}}</button>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Your Product Name Here',
      subtitle: 'Transform your ideas into reality with our innovative solution',
      ctaText: 'Get Started'
    }
  },
  {
    id: 'hero-2',
    name: 'Hero with Image',
    category: 'hero',
    description: 'Hero section with text on left and image placeholder on right',
    html: `
      <section class="hero-section hero-split">
        <div class="hero-text">
          <h1 class="hero-title">{{title}}</h1>
          <p class="hero-subtitle">{{subtitle}}</p>
          <button class="hero-cta">{{ctaText}}</button>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">🖼️ Image</div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Welcome to Pagentum',
      subtitle: 'Create beautiful landing pages in minutes',
      ctaText: 'Start Building'
    }
  },
  {
    id: 'features-3col',
    name: 'Features Grid (3 Columns)',
    category: 'features',
    description: 'Three-column feature cards with icons',
    html: `
      <section class="features-section">
        <h2 class="section-title">{{title}}</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">{{feature1Title}}</h3>
            <p class="feature-description">{{feature1Desc}}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">{{feature2Title}}</h3>
            <p class="feature-description">{{feature2Desc}}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">{{feature3Title}}</h3>
            <p class="feature-description">{{feature3Desc}}</p>
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Key Features',
      feature1Title: 'Lightning Fast',
      feature1Desc: 'Build pages in minutes, not hours',
      feature2Title: 'Beautiful Design',
      feature2Desc: 'Pre-styled components that look great',
      feature3Title: 'Easy Export',
      feature3Desc: 'Download clean HTML and CSS'
    }
  },
  {
    id: 'cta-1',
    name: 'Call to Action',
    category: 'cta',
    description: 'Centered CTA with headline and button',
    html: `
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">{{title}}</h2>
          <p class="cta-subtitle">{{subtitle}}</p>
          <button class="cta-button">{{ctaText}}</button>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of users building amazing pages',
      ctaText: 'Sign Up Now'
    }
  },
  {
    id: 'testimonials-3col',
    name: 'Testimonials Grid',
    category: 'testimonials',
    description: 'Three testimonial cards with quotes',
    html: `
      <section class="testimonials-section">
        <h2 class="section-title">{{title}}</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p class="testimonial-quote">"{{quote1}}"</p>
            <p class="testimonial-author">— {{author1}}</p>
          </div>
          <div class="testimonial-card">
            <p class="testimonial-quote">"{{quote2}}"</p>
            <p class="testimonial-author">— {{author2}}</p>
          </div>
          <div class="testimonial-card">
            <p class="testimonial-quote">"{{quote3}}"</p>
            <p class="testimonial-author">— {{author3}}</p>
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'What Our Users Say',
      quote1: 'This tool saved me hours of work. Absolutely fantastic!',
      author1: 'Sarah Johnson',
      quote2: 'The perfect solution for rapid prototyping. Love it!',
      author2: 'Mike Chen',
      quote3: 'Clean exports and beautiful designs out of the box.',
      author3: 'Emily Rodriguez'
    }
  },
  {
    id: 'pricing-3tier',
    name: 'Pricing Table',
    category: 'pricing',
    description: 'Three-tier pricing table',
    html: `
      <section class="pricing-section">
        <h2 class="section-title">{{title}}</h2>
        <div class="pricing-grid">
          <div class="pricing-card">
            <h3 class="pricing-tier">{{tier1Name}}</h3>
            <p class="pricing-price">{{tier1Price}}</p>
            <ul class="pricing-features">
              <li>{{tier1Feature1}}</li>
              <li>{{tier1Feature2}}</li>
              <li>{{tier1Feature3}}</li>
            </ul>
            <button class="pricing-button">{{tier1CTA}}</button>
          </div>
          <div class="pricing-card pricing-featured">
            <h3 class="pricing-tier">{{tier2Name}}</h3>
            <p class="pricing-price">{{tier2Price}}</p>
            <ul class="pricing-features">
              <li>{{tier2Feature1}}</li>
              <li>{{tier2Feature2}}</li>
              <li>{{tier2Feature3}}</li>
            </ul>
            <button class="pricing-button">{{tier2CTA}}</button>
          </div>
          <div class="pricing-card">
            <h3 class="pricing-tier">{{tier3Name}}</h3>
            <p class="pricing-price">{{tier3Price}}</p>
            <ul class="pricing-features">
              <li>{{tier3Feature1}}</li>
              <li>{{tier3Feature2}}</li>
              <li>{{tier3Feature3}}</li>
            </ul>
            <button class="pricing-button">{{tier3CTA}}</button>
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Simple Pricing',
      tier1Name: 'Starter',
      tier1Price: '$9/mo',
      tier1Feature1: 'Up to 5 projects',
      tier1Feature2: 'Basic templates',
      tier1Feature3: 'Email support',
      tier1CTA: 'Get Started',
      tier2Name: 'Pro',
      tier2Price: '$29/mo',
      tier2Feature1: 'Unlimited projects',
      tier2Feature2: 'All templates',
      tier2Feature3: 'Priority support',
      tier2CTA: 'Go Pro',
      tier3Name: 'Enterprise',
      tier3Price: 'Custom',
      tier3Feature1: 'Custom templates',
      tier3Feature2: 'Dedicated support',
      tier3Feature3: 'SLA guarantee',
      tier3CTA: 'Contact Sales'
    }
  },
  {
    id: 'footer-1',
    name: 'Footer',
    category: 'footer',
    description: 'Simple footer with links and copyright',
    html: `
      <footer class="footer-section">
        <div class="footer-content">
          <div class="footer-links">
            <a href="#">{{link1}}</a>
            <a href="#">{{link2}}</a>
            <a href="#">{{link3}}</a>
            <a href="#">{{link4}}</a>
          </div>
          <p class="footer-copyright">{{copyright}}</p>
        </div>
      </footer>
    `,
    defaultContent: {
      link1: 'About',
      link2: 'Features',
      link3: 'Pricing',
      link4: 'Contact',
      copyright: '© 2024 Your Company. All rights reserved.'
    }
  }
];

export const getCategoryKeywords = (): Record<string, string[]> => ({
  hero: ['hero', 'banner', 'header', 'headline', 'landing', 'intro', 'welcome'],
  features: ['features', 'benefits', 'highlights', 'services', 'what we offer'],
  cta: ['cta', 'call to action', 'signup', 'register', 'join'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'social proof', 'quotes'],
  pricing: ['pricing', 'plans', 'packages', 'tiers', 'cost'],
  footer: ['footer', 'bottom', 'links', 'copyright']
});
