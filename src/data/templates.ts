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
            <h3 class="feature-title">{{feature2Title}}</h3>
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
    id: 'video-section',
    name: 'Video Showcase',
    category: 'features',
    description: 'Feature section with YouTube video embed and descriptive text',
    html: `
      <section class="video-section">
        <div class="video-inner flex {{variantClass}}">
          <div class="video-text">
            <h2>{{title}}</h2>
            <p>{{description}}</p>
          </div>
          <div class="video-container">
            {{videoEmbedHTML}}
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Watch the Story',
      description: 'Discover how our platform is transforming the industry with cutting-edge technology and user-centric design.',
      videoUrl: 'https://www.youtube.com/watch?v=YE7VzlLtp-4'
    },
    defaultLayout: {
      variant: 'video-right'
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
  },
  {
    id: 'contact-section',
    name: 'Contact Section',
    category: 'cta',
    description: 'A direct contact section with info and call to action',
    html: `
      <section class="py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-6">{{title}}</h2>
            <p class="text-lg md:text-xl opacity-70 max-w-2xl mx-auto leading-relaxed">{{description}}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div class="p-8 rounded-2xl border text-center transition-transform hover:scale-105" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background: color-mix(in srgb, var(--primary-color) 15%, transparent); color: var(--primary-color);">📧</div>
              <h3 class="text-xl font-bold mb-2">Email Us</h3>
              <p class="opacity-70 break-all">{{email}}</p>
            </div>
            <div class="p-8 rounded-2xl border text-center transition-transform hover:scale-105" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background: color-mix(in srgb, var(--primary-color) 15%, transparent); color: var(--primary-color);">📞</div>
              <h3 class="text-xl font-bold mb-2">Call Us</h3>
              <p class="opacity-70">{{phone}}</p>
            </div>
            <div class="p-8 rounded-2xl border text-center transition-transform hover:scale-105" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background: color-mix(in srgb, var(--primary-color) 15%, transparent); color: var(--primary-color);">📍</div>
              <h3 class="text-xl font-bold mb-2">Visit Us</h3>
              <p class="opacity-70 leading-snug">{{address}}</p>
            </div>
          </div>
          <div class="mt-16 text-center">
            <div class="inline-block p-6 md:p-10 rounded-[2rem] border-2 border-dashed" style="border-color: color-mix(in srgb, var(--primary-color) 30%, transparent); background: color-mix(in srgb, var(--bg-color) 98%, var(--text-color) 2%);">
              <h4 class="text-xl md:text-2xl font-bold mb-4">Have a specific query?</h4>
              <p class="text-lg opacity-70 mb-8">{{queryText}}</p>
              <a href="mailto:{{email}}" class="inline-block py-4 px-10 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg" style="background: var(--primary-color);">{{buttonText}}</a>
            </div>
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Get in Touch',
      description: 'We are here to help and answer any questions you might have. We look forward to hearing from you.',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Creative Street, Design City',
      queryText: 'For business inquiries or urgent matters, feel free to reach out directly via email.',
      buttonText: 'Send an Email'
    }
  },
  {
    id: 'portfolio-grid',
    name: 'Portfolio Grid',
    category: 'features',
    description: 'A grid showcasing projects or portfolio items',
    html: `
      <section class="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
        <div class="text-center mb-10 md:mb-16">
          <h2 class="text-2xl md:text-5xl font-bold mb-4">{{title}}</h2>
          <p class="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">{{subtitle}}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div class="group relative overflow-hidden rounded-2xl shadow-lg border" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
            <div class="h-48 md:h-64 flex items-center justify-center font-bold uppercase tracking-widest text-xs" style="background: color-mix(in srgb, var(--bg-color) 90%, var(--text-color) 10%); color: color-mix(in srgb, var(--text-color) 40%, transparent)">Project 1</div>
            <div class="p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-bold mb-2">{{proj1Title}}</h3>
              <p class="text-sm md:text-base opacity-80">{{proj1Desc}}</p>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-2xl shadow-lg border" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
            <div class="h-48 md:h-64 flex items-center justify-center font-bold uppercase tracking-widest text-xs" style="background: color-mix(in srgb, var(--bg-color) 90%, var(--text-color) 10%); color: color-mix(in srgb, var(--text-color) 40%, transparent)">Project 2</div>
            <div class="p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-bold mb-2">{{proj2Title}}</h3>
              <p class="text-sm md:text-base opacity-80">{{proj2Desc}}</p>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-2xl shadow-lg border" style="background: color-mix(in srgb, var(--bg-color) 95%, var(--text-color) 5%); border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
            <div class="h-48 md:h-64 flex items-center justify-center font-bold uppercase tracking-widest text-xs" style="background: color-mix(in srgb, var(--bg-color) 90%, var(--text-color) 10%); color: color-mix(in srgb, var(--text-color) 40%, transparent)">Project 3</div>
            <div class="p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-bold mb-2">{{proj3Title}}</h3>
              <p class="text-sm md:text-base opacity-80">{{proj3Desc}}</p>
            </div>
          </div>
        </div>
      </section>
    `,
    defaultContent: {
      title: 'Our Latest Work',
      subtitle: 'A selection of our most recent and favorite projects.',
      proj1Title: 'E-commerce Platform',
      proj1Desc: 'A complete redesign resulting in a 40% conversion increase.',
      proj2Title: 'Brand Identity',
      proj2Desc: 'Modernizing a legacy brand for the digital age.',
      proj3Title: 'Mobile Application',
      proj3Desc: 'An award-winning fitness and habit tracking app.'
    }
  },
  {
    id: 'footer-advanced',
    name: 'Advanced Footer',
    category: 'footer',
    description: 'Footer with description, links, and social icons',
    html: `
      <footer class="footer-advanced py-12 md:py-16 px-4 md:px-6 overflow-hidden">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-10 md:mb-12 text-left">
          <div class="space-y-4 md:space-y-6">
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">{{companyName}}</h3>
            <p class="text-sm md:text-base text-gray-400 max-w-md leading-relaxed">{{description}}</p>
            <div class="flex justify-start space-x-3 md:space-x-4">
              <a href="{{social1Link}}" class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span class="text-[10px] md:text-xs font-bold">FB</span>
              </a>
              <a href="{{social2Link}}" class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors">
                <span class="text-[10px] md:text-xs font-bold">TW</span>
              </a>
              <a href="{{social3Link}}" class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors">
                <span class="text-[10px] md:text-xs font-bold">IG</span>
              </a>
              <a href="{{social4Link}}" class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span class="text-[10px] md:text-xs font-bold">IN</span>
              </a>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="text-base md:text-lg font-bold mb-3 md:mb-4">Quick Links</h4>
            <div class="flex flex-col space-y-2 text-sm md:text-base text-gray-400">
              <a href="#" class="hover:text-white transition-colors">{{link1}}</a>
              <a href="#" class="hover:text-white transition-colors">{{link2}}</a>
              <a href="#" class="hover:text-white transition-colors">{{link3}}</a>
              <a href="#" class="hover:text-white transition-colors">{{link4}}</a>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-base md:text-lg font-bold mb-3 md:mb-4">Contact Us</h4>
            <div class="space-y-2 text-sm md:text-base text-gray-400">
              <p>{{email}}</p>
              <p>{{phone}}</p>
              <p>{{address}}</p>
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto pt-6 md:pt-8 border-t border-gray-800 text-center text-xs md:text-sm text-gray-500">
          <p>{{copyright}}</p>
        </div>
      </footer>
    `,
    defaultContent: {
      companyName: 'Pagentum',
      description: 'We create digital experiences that make a difference. Our platform empowers creators to build magical landing pages effortlessly.',
      social1Link: '#',
      social2Link: '#',
      social3Link: '#',
      social4Link: '#',
      link1: 'Home',
      link2: 'Features',
      link3: 'Portfolio',
      link4: 'Contact',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Creative Street, Design City',
      copyright: '© 2026 Pagentum. All rights reserved.'
    }
  }
];

export const getCategoryKeywords = (): Record<string, string[]> => ({
  hero: ['hero', 'banner', 'header', 'headline', 'landing', 'intro', 'welcome'],
  features: ['features', 'benefits', 'highlights', 'services', 'what we offer'],
  portfolio: ['portfolio', 'projects', 'work', 'gallery', 'showcase', 'examples'],
  cta: ['cta', 'call to action', 'signup', 'register', 'join'],
  contact: ['contact', 'form', 'email', 'message', 'touch', 'reach out'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'social proof', 'quotes'],
  pricing: ['pricing', 'plans', 'packages', 'tiers', 'cost'],
  footer: ['footer', 'bottom', 'links', 'copyright']
});
