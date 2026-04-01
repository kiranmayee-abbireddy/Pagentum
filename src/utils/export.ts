import { PageSection, ThemeConfig } from '../types';
import { sectionTemplates } from '../data/templates';
import { generateCSS } from '../data/themes';

function getSectionStyleRules(section: PageSection) {
  const layout = section.layout || {};
  const bgType = layout.backgroundType || 'plain';
  let rules = '';

  // Text Color
  if (layout.textColor) {
    rules += `color: ${layout.textColor} !important; `;
  }

  // Background logic
  if (bgType === 'plain') {
    if (layout.backgroundColor) {
      rules += `background: ${layout.backgroundColor} !important; `;
    }
  } else if (bgType === 'gradient') {
    const start = layout.gradientStart || '#000000';
    const end = layout.gradientEnd || '#ffffff';
    const angle = layout.gradientDirection || '135';
    const intensity = layout.gradientDomination ?? 100;
    rules += `background: linear-gradient(${angle}deg, ${start} 0%, ${end} ${intensity}%) !important; `;
  } else if (bgType === 'image') {
    if (layout.backgroundImage) {
      // Use single quotes for url() to avoid breaking the style="" attribute
      rules += `background: url('${layout.backgroundImage}') center / cover no-repeat !important; `;
    } else if (layout.backgroundColor) {
      rules += `background: ${layout.backgroundColor} !important; `;
    }
  } else if (bgType === 'video') {
    if (layout.backgroundColor) {
      rules += `background: ${layout.backgroundColor} !important; `;
    } else {
      rules += `background: transparent !important; `;
    }
  }

  return rules;
}

function getSectionBackgroundHTML(section: PageSection) {
  const layout = section.layout || {};
  if (layout.backgroundType === 'video' && layout.backgroundVideo) {
    const opacity = (layout.overlayOpacity ?? 30) / 100;
    return `
      <div class="video-background-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; pointer-events: none;">
        <video autoplay muted loop playsinline style="min-width: 100%; min-height: 100%; width: auto; height: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: cover;">
          <source src="${layout.backgroundVideo}" type="video/mp4">
        </video>
        <div class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: ${opacity};"></div>
      </div>
    `;
  }
  
  if (layout.backgroundType === 'image' && layout.backgroundImage) {
    const opacity = (layout.overlayOpacity ?? 0) / 100;
    if (opacity > 0) {
      return `<div class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: ${opacity}; z-index: 0; pointer-events: none;"></div>`;
    }
  }

  return '';
}

export function generateHTML(sections: PageSection[], theme: ThemeConfig): string {
  const sectionsHTML = sections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      const template = sectionTemplates.find(t => t.id === section.templateId);
      if (!template) return '';

      let html = template.html;
      Object.entries(section.content).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return html;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${sectionsHTML}
</body>
</html>`;
}

export function generateStandaloneHTML(sections: PageSection[], theme: ThemeConfig): string {
  const sectionsHTML = sections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      const sectionRules = getSectionStyleRules(section);
      const bgHTML = getSectionBackgroundHTML(section);
      const isRelative = !!bgHTML || (section.layout?.backgroundType === 'image' && (section.layout?.overlayOpacity ?? 0) > 0);
      const combinedStyle = `style="${sectionRules}${isRelative ? ' position: relative; overflow: hidden;' : ''}"`;

      if (section.templateId === 'hero-image-advanced') {
        const variant = (section.layout as any)?.variant || 'image-right';
        const img = section.images?.[0];
        const showButton = (section.layout as any)?.showButton ?? true;
        const buttonLabel = (section.layout as any)?.buttonLabel || section.content.ctaText || 'Get Started';
        const buttonHref = (section.layout as any)?.buttonHref || '#';
        
        return `
          <section class="hero-advanced py-20 px-4" ${combinedStyle}>
            ${bgHTML}
            <div class="hero-inner max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 ${
              variant === 'image-left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }" style="position: relative; z-index: 1;">
              <div class="hero-text flex-1 text-center lg:text-left">
                <h1 class="text-4xl lg:text-5xl font-bold mb-6">${section.content.title}</h1>
                <p class="text-xl mb-8 max-w-lg opacity-90">${section.content.subtitle}</p>
                ${showButton ? 
                   `<a href="${buttonHref}" class="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all">${buttonLabel}</a>` : ''
                }
              </div>
              <div class="hero-image flex-1 flex justify-center lg:justify-end">
                ${img ? 
                  `<img src="${img.src}" alt="${img.alt || section.content.title}" class="w-full max-w-md lg:max-w-lg h-64 lg:h-80 object-cover rounded-2xl shadow-2xl" />` :
                  `<div class="w-full max-w-md lg:max-w-lg h-64 lg:h-80 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <span class="text-gray-500">Image</span>
                  </div>`
                }
              </div>
            </div>
          </section>
        `;
      }

      if (section.templateId === 'product-carousel') {
        const carouselStyle = (section.layout as any)?.carouselStyle || 'auto-scroll';
        const showButton = (section.layout as any)?.showButton ?? false;
        const buttonHref = (section.layout as any)?.buttonHref || '#';
        const buttonLabel = (section.layout as any)?.buttonLabel || 'Buy Now';
        const imageCount = (section.layout as any)?.imageCount || section.images?.length || 5;
        const displayImages = section.images?.slice(0, imageCount) || [];

        if (carouselStyle === 'grid') {
          return `
            <section class="bookshelf-section py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-16">
                  <h2 style="text-align:center;" class="text-3xl lg:text-4xl font-bold mb-4">${section.content.title}</h2>
                  <p style="margin-bottom:50px; text-align:center;" class="text-xl opacity-80 max-w-2xl mx-auto">${section.content.subtitle}</p>
                </div>
                
                <div class="bookshelf-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start justify-items-center">
                  ${displayImages.map((img, idx) => {
                    const productNum = idx + 1;
                    const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
                    const price = section.content[`product${productNum}Price`] || '$19.99';
                    const desc = section.content[`product${productNum}Description`] || 'Great product.';
                    
                    return `
                      <div class="book-card group relative w-44 h-80 flex flex-col rounded-2xl shadow-xl
                                  transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.1)]
                                  hover:scale-110 hover:-translate-y-3 hover:shadow-2xl hover:z-20
                                  bg-white border border-gray-100 overflow-hidden">
                        
                        <img src="${img.src}" alt="${img.alt || title}" 
                            class="w-full h-40 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500" />
                        
                        <div class="p-5 flex-1 flex flex-col">
                          <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">${title}</h3>
                          <p class="text-2xl font-black text-primary mb-3">${price}</p>
                          <p class="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-4">${desc}</p>
                          ${showButton ? 
                            `<a href="${buttonHref}" class="mt-auto inline-flex items-center justify-center
                                    bg-primary hover:bg-primary/90 text-white
                                    px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                                    transition-all duration-300 transform hover:-translate-y-1">
                              ${buttonLabel}
                            </a>` : ''
                          }
                        </div>
                      </div>
                    `;
                  }).join('') || `
                    <div class="col-span-full text-center py-20">
                      <div class="inline-block p-12 bg-gray-100 rounded-3xl">
                        <span class="text-5xl">📚</span>
                        <p class="text-gray-500 mt-4 text-lg">Upload products to fill the bookshelf</p>
                      </div>
                    </div>
                  `}
                </div>
              </div>
            </section>
          `;
        }
        if (carouselStyle === 'glowing') {
          return `
            <section class="glowing-bookshelf py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-16">
                  <h2 style="text-align:center;" class="text-3xl lg:text-4xl font-bold mb-4">${section.content.title}</h2>
                  <p style="margin-bottom:50px; text-align:center;" class="text-xl opacity-80 max-w-2xl mx-auto">${section.content.subtitle}</p>
                </div>
                <div class="cards">
                  ${displayImages.map((img, idx) => {
                    const productNum = idx + 1;
                    const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
                    const price = section.content[`product${productNum}Price`] || '$19.99';
                    const desc = section.content[`product${productNum}Description`] || 'Great product.';
                    
                    return `
                      <div class="card" style="--hue: ${200 + idx * 30}; --saturation: 80%; --lightness: 50%;">
                        <img src="${img.src}" alt="${img.alt || title}" class="card__image" />
                        <p class="card__heading">${title}</p>
                        <p class="card__price">${price}</p>
                        <p class="card__description">${desc}</p>
                        ${showButton ? `<a href="${buttonHref}" class="cta">${buttonLabel}</a>` : ''}
                      </div>
                    `;
                  }).join('') || `
                    <div class="empty-card text-center py-12">
                      <span class="text-6xl block mb-6">✨</span>
                      <p class="text-xl font-bold mb-2">Upload products</p>
                    </div>
                  `}
                </div>
              </div>
            </section>
          `;
        }
        if (carouselStyle === 'rail') {
          return `
            <section class="product-carousel py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-12">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4">${section.content.title}</h2>
                  <p class="text-xl opacity-80 max-w-2xl mx-auto">${section.content.subtitle}</p>
                </div>
                <div class="rail-grid">
                  ${displayImages.map((img, idx) => {
                    const productNum = idx + 1;
                    const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
                    const price = section.content[`product${productNum}Price`] || '$99';
                    const desc = section.content[`product${productNum}Description`] || 'Amazing product.';
                    
                    return `
                      <div class="rail-card-box">
                        <div class="rail-card">
                          <div class="rail-image">
                            <img src="${img.src}" alt="${img.alt || title}" />
                          </div>
                          <div class="rail-body">
                            <div class="rail-content">
                              <div class="rail-title">${title}</div>
                              <div class="rail-desc">${desc}</div>
                              <div class="rail-price">${price}</div>
                            </div>
                            ${showButton ? `<a href="${buttonHref}" class="rail-cta">${buttonLabel}</a>` : ''}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('') || `
                    <div class="rail-card-box"><div class="rail-card rail-empty">Empty</div></div>
                  `}
                </div>
              </div>
            </section>
          `;
        }

        if (carouselStyle === 'auto-scroll') {
          const quantity = Math.max(1, displayImages.length || 1);
          return `
            <section class="product-carousel py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-12">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4">${section.content.title}</h2>
                  <p class="text-xl opacity-80">${section.content.subtitle}</p>
                </div>
                <div class="slider" style="--width: 280px; --height: 360px; --quantity: ${quantity};">
                  <div class="list">
                    ${displayImages.map((img, idx) => {
                      const productNum = idx + 1;
                      const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
                      const price = section.content[`product${productNum}Price`] || '$99';
                      const desc = section.content[`product${productNum}Description`] || 'Product';
                      
                      return `
                        <div class="item" style="--position: ${idx + 1}">
                          <div class="auto-card">
                            <div class="auto-card-image"><img src="${img.src}" /></div>
                            <div class="auto-card-content">
                              <h3 class="auto-card-title">${title}</h3>
                              <p class="auto-card-price">${price}</p>
                              <p class="auto-card-desc">${desc}</p>
                              ${showButton ? `<a href="${buttonHref}" class="auto-card-cta">${buttonLabel}</a>` : ''}
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </section>
          `;
        }
      }

      if (section.templateId === 'navbar-1') {
        const logo = section.images?.[0];
        return `
          <header class="site-navbar shadow-sm sticky top-0 z-50" ${combinedStyle}>
            <div class="nav-inner max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div class="nav-brand flex items-center space-x-3">
                ${logo ? 
                  `<img src="${logo.src}" alt="${logo.alt || section.content.logoAlt || 'Logo'}" class="h-10 w-auto" />` :
                  `<div class="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-sm font-bold">LOGO</span>
                  </div>`
                }
                <span class="text-xl font-bold">${section.content.siteName}</span>
              </div>
              <nav class="nav-links flex space-x-6">
                ${[
                  { label: 'nav1Label', href: 'nav1Href' },
                  { label: 'nav2Label', href: 'nav2Href' },
                  { label: 'nav3Label', href: 'nav3Href' }
                ].map((nav: any) => {
                  const label = section.content[nav.label as keyof typeof section.content];
                  const href = section.content[nav.href as keyof typeof section.content];
                  return label ? `<a href="${href || '#'}" class="hover:text-blue-600 font-medium transition-colors" style="color: inherit;">${label}</a>` : '';
                }).filter(Boolean).join('')}
              </nav>
            </div>
          </header>
        `;
      }

      // Default rendering
      const template = sectionTemplates.find(t => t.id === section.templateId);
      if (!template) return '';
      let html = template.html;
      Object.entries(section.content).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      });
      
      // Inject styles into the main container if possible
      if (html.includes('<section')) {
        html = html.replace('<section', `<section ${combinedStyle}`);
        if (bgHTML) {
          const firstTagEnd = html.indexOf('>') + 1;
          html = html.slice(0, firstTagEnd) + bgHTML + html.slice(firstTagEnd);
        }
      } else if (html.includes('<header')) {
        html = html.replace('<header', `<header ${combinedStyle}`);
      }

      return html;
    })
    .join('\n');

  const css = generateCSS(theme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
${css}
  </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;
}

function getCarouselClasses(style: string): string {
  switch (style) {
    case 'auto-scroll':
      return 'flex overflow-hidden [scroll-behavior:smooth] snap-x snap-mandatory scrollbar-hide animate-auto-scroll';
    case 'rail':
      return 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4';
    case 'grid':
      return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    default:
      return 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4';
  }
}

export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { generateCSS } from '../data/themes';
