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
    id: 'navbar-1',
    name: 'Navbar',
    category: 'hero',
    description: 'Top navigation with logo and links',
    html: `
      <header class="site-navbar">
        <div class="nav-inner">
          <div class="nav-brand">
            <img src="{{logoSrc}}" alt="{{logoAlt}}" class="nav-logo" />
            <span class="nav-name">{{siteName}}</span>
          </div>
          <nav class="nav-links">
            {{navLinksHTML}}
          </nav>
          <button class="mobile-menu-btn" onclick="document.querySelector('.nav-links')?.classList.toggle('active'); this.classList.toggle('active'); document.querySelector('.mobile-overlay')?.classList.toggle('active')">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    `,
    defaultContent: {
      siteName: 'My Brand',
      logoAlt: 'Brand logo',
      nav1Label: '',
      nav1Href: '#',
      nav2Label: '',
      nav2Href: '#',
      nav3Label: '',
      nav3Href: '#'
    }
  },

  // Hero with configurable image side
  {
    id: 'hero-image-advanced',
    name: 'Hero with Image',
    category: 'hero',
    description: 'Hero section with text and uploadable image with left/right layout toggle',
    html: `
      <section class="hero-advanced">
        <div class="hero-inner flex {{variantClass}}">
          <div class="hero-text">
            <h1>{{title}}</h1>
            <p>{{subtitle}}</p>
            {{#if showButton}}<a href="{{buttonHref}}" class="btn-primary">{{buttonLabel}}</a>{{/if}}
          </div>
          <div class="hero-image">
            <img src="{{imageSrc}}" alt="{{imageAlt}}" />
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Welcome to Pagentum',
      subtitle: 'Create beautiful landing pages in minutes',
      buttonLabel: 'Start Building',
      buttonHref: '#',
    }
  },

  // Product Carousel
  {
    id: 'product-carousel',
    name: 'Product Carousel',
    category: 'features',
    description: 'Product carousel with multiple animation options',
    html: `
      <section class="product-carousel {{carouselStyleClass}}">
        <h2>{{title}}</h2>
        <p>{{subtitle}}</p>
        <div class="product-track">
          {{productsHTML}}
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Our Products',
      subtitle: 'Discover our best products',
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
    id: 'hero-video',
    name: 'Hero Video',
    category: 'hero',
    description: 'Hero section with immersive background video and centered content',
    html: `
      <section class="hero-video-section relative overflow-hidden flex items-center justify-center min-h-[600px] py-24">
        <div class="hero-content relative z-10 text-center px-4 max-w-4xl">
          <h1 class="hero-title text-4xl md:text-6xl font-black text-white mb-6">{{title}}</h1>
          <p class="hero-subtitle text-xl text-white/90 mb-10 max-w-2xl mx-auto">{{subtitle}}</p>
          <button class="hero-cta bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-black/20">{{ctaText}}</button>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Experience The Future',
      subtitle: 'Premium designs with seamless video backgrounds and high-performance streaming',
      ctaText: 'Explore More'
    },
    defaultLayout: {
      backgroundType: 'video',
      backgroundVideo: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      overlayOpacity: 40
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
      link1: '',
      link2: '',
      link3: '',
      link4: '',
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
