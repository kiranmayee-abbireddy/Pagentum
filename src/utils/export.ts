import { PageSection, ThemeConfig } from '../types';
import { sectionTemplates } from '../data/templates';
import { generateCSS } from '../data/themes';

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

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
    const isM3U8 = layout.backgroundVideo.toLowerCase().endsWith('.m3u8');

    // More robust YouTube Detection (Supports URLs and raw IDs)
    const ytIdMatch = layout.backgroundVideo.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})|^([^"&?\/\s]{11})$/i);
    const ytId = ytIdMatch ? (ytIdMatch[1] || ytIdMatch[2]) : null;

    if (ytId) {
      return `
        <div class="video-background-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0;">
          <iframe 
            style="position: absolute; top: 50%; left: 50%; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; transform: translate(-50%, -50%); pointer-events: none; border: none; z-index: 1;"
            src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0" 
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
          <div class="video-shield" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; cursor: default; background: rgba(0,0,0,0); pointer-events: auto;"></div>
          <div class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: ${opacity}; z-index: 3; pointer-events: none;"></div>
        </div>
      `;
    }

    const videoId = `video-${section.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    return `
      <div class="video-background-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; pointer-events: none;">
        <video id="${videoId}" autoplay muted loop playsinline style="min-width: 100%; min-height: 100%; width: auto; height: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: cover;">
          ${!isM3U8 ? `<source src="${layout.backgroundVideo}" type="video/mp4">` : ''}
        </video>
        ${isM3U8 ? `
        <script>
          (function() {
            var video = document.getElementById('${videoId}');
            var videoSrc = '${layout.backgroundVideo}';
            if (Hls.isSupported()) {
              var hls = new Hls();
              hls.loadSource(videoSrc);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
              });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              video.src = videoSrc;
              video.addEventListener('loadedmetadata', function() {
                video.play();
              });
            }
          })();
        </script>` : ''}
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: 'var(--primary-color)',
            secondary: 'var(--secondary-color)',
            accent: 'var(--accent-color)'
          }
        }
      }
    }
  </script>
  ${sections.some(s => s.layout?.backgroundType === 'video' && s.layout?.backgroundVideo?.toLowerCase().endsWith('.m3u8')) ? '<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>' : ''}
</head>
<body>
${sectionsHTML}
  <div class="mobile-overlay" onclick="document.querySelector('.nav-links').classList.remove('active'); document.querySelector('.mobile-menu-btn').classList.remove('active'); this.classList.remove('active')"></div>
  <script>
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#section-')) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId) || document.querySelector('[id="'+targetId+'"]');
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
            document.querySelector('.mobile-overlay').classList.remove('active');
          }
        }
      });
    });

    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.querySelector('.mobile-overlay').classList.toggle('active');
      });
    }
  </script>
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
        const buttonLabel = section.content.buttonLabel || section.content.ctaText || 'Get Started';
        const buttonHref = section.content.buttonHref || section.content.ctaHref || '#';

        return `
          <section id="section-${section.id}" class="hero-advanced py-20 px-4" ${combinedStyle}>
            ${bgHTML}
            <div class="hero-inner max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 ${variant === 'image-left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
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

      if (section.templateId === 'video-section') {
        const variant = (section.layout as any)?.variant || 'video-right';
        const videoUrl = section.content.videoUrl || '';
        const embedUrl = getYouTubeEmbedUrl(videoUrl);

        return `
          <section id="section-${section.id}" class="video-section py-24 md:py-32 px-6" ${combinedStyle}>
            ${bgHTML}
            <div class="video-inner ${variant === 'video-center' ? 'video-center' : (variant === 'video-left' ? 'lg:flex-row-reverse' : 'lg:flex-row')}" style="position: relative; z-index: 1;">
              <div class="video-text ${variant === 'video-left' ? 'lg:text-right' : (variant === 'video-center' ? 'text-center' : 'lg:text-left')}">
                <h2 class="text-4xl lg:text-6xl font-black mb-8 leading-tight">${section.content.title}</h2>
                <p class="text-xl opacity-90 mb-0 leading-relaxed max-w-2xl ${variant === 'video-left' ? 'lg:ml-auto' : (variant === 'video-center' ? 'mx-auto' : 'lg:mr-auto')}">${section.content.description}</p>
              </div>
              <div class="video-container" style="${variant === 'video-center' ? 'max-width: 1000px;' : ''}">
                ${embedUrl ?
            `<iframe src="${embedUrl}?rel=0&showinfo=0&modestbranding=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` :
            `<div class="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">Video Link Required</div>`
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
            <section id="section-${section.id}" class="bookshelf-section py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-16">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-center">${section.content.title}</h2>
                  <p class="text-xl opacity-80 max-w-2xl mx-auto text-center mb-12">${section.content.subtitle}</p>
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
            <section id="section-${section.id}" class="glowing-bookshelf py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-16">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-center">${section.content.title}</h2>
                  <p class="text-xl opacity-80 max-w-2xl mx-auto text-center mb-12">${section.content.subtitle}</p>
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
            <section id="section-${section.id}" class="product-carousel py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-12">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-center">${section.content.title}</h2>
                  <p class="text-xl opacity-80 max-w-2xl mx-auto text-center mb-12">${section.content.subtitle}</p>
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
            <section id="section-${section.id}" class="product-carousel py-20 px-4" ${combinedStyle}>
              ${bgHTML}
              <div class="max-w-7xl mx-auto" style="position: relative; z-index: 1;">
                <div class="text-center mb-12">
                  <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-center">${section.content.title}</h2>
                  <p class="text-xl opacity-80 max-w-2xl mx-auto text-center mb-12">${section.content.subtitle}</p>
                </div>
                <div class="slider" style="--width: 280px; --height: 420px; --quantity: ${quantity};">
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
          <header class="site-navbar" ${combinedStyle}>
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
                ${(() => {
            let heroCount = 0;
            const linkSections = sections.filter(s => {
              const template = sectionTemplates.find(t => t.id === s.templateId);
              return template?.category !== 'cta' && s.templateId !== 'navbar-1' && s.templateId !== 'footer-1' && s.templateId !== 'footer-advanced';
            });

            return linkSections.map(s => {
              let label = s.content.title;
              if (s.templateId.includes('hero')) {
                heroCount++;
                if (heroCount === 1) label = 'Home';
                else if (heroCount === 2) label = 'About';
                else return null;
              }
              if (!label) return null;
              return `<a href="#section-${s.id}" class="hover:text-blue-600 font-medium transition-colors" style="color: inherit; font-size: 0.9rem; white-space: nowrap;">${label}</a>`;
            })
              .filter(Boolean)
              .join('');
          })()}
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
              <button class="mobile-menu-btn" onclick="document.querySelector('.nav-links').classList.toggle('active'); this.classList.toggle('active')">
                <span></span><span></span><span></span>
              </button>
            </div>
          </header>
        `;
      }

      if (section.templateId === 'footer-1') {
        const copyright = section.content.copyright || `© ${new Date().getFullYear()} ${theme.name || 'Pagentum'}. All rights reserved.`;
        return `
          <footer class="footer-section py-12" ${combinedStyle}>
            <div class="footer-content max-w-7xl mx-auto px-4 text-center">
              <div class="footer-links flex flex-wrap justify-center gap-6 mb-8">
                ${(() => {
            let heroCount = 0;
            return sections
              .filter(s => s.templateId !== 'navbar-1' && s.templateId !== 'footer-1')
              .map(s => {
                let label = s.content.title;
                if (s.templateId.includes('hero')) {
                  heroCount++;
                  if (heroCount === 1) label = 'Home';
                  else if (heroCount === 2) label = 'About';
                  else return null;
                }
                if (!label) return null;
                return `<a href="#section-${s.id}" class="hover:text-primary transition-colors" style="color: inherit; text-decoration: none;">${label}</a>`;
              })
              .filter(Boolean)
              .join('');
          })()}
                ${['link1', 'link2', 'link3', 'link4'].map(key => {
            const label = section.content[key as keyof typeof section.content];
            const href = section.content[`${key}Href` as keyof typeof section.content] || '#';
            return label ? `<a href="${href}" class="hover:text-primary transition-colors" style="color: inherit; text-decoration: none; font-size: 0.9rem; white-space: nowrap;">${label}</a>` : '';
          }).filter(Boolean).join('')}
              </div>
              <p class="footer-copyright opacity-80">${copyright}</p>
            </div>
          </footer>
        `;
      }

      if (section.templateId === 'portfolio-grid') {
        const count = parseInt(section.content.projectCount || '0');
        const itemsHTML = Array.from({ length: count }).map((_, idx) => {
          const num = idx + 1;
          const title = section.content[`proj${num}Title`] || `Project ${num}`;
          const desc = section.content[`proj${num}Desc`] || '';
          const link = section.content[`proj${num}Link`] || '#';
          const thumb = section.content[`proj${num}Thumb`];

          const thumbHTML = thumb
            ? `<img src="${thumb}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />`
            : `
              <div class="w-full h-full flex items-center justify-center p-8 text-center" style="background: color-mix(in srgb, var(--primary-color) 8%, var(--bg-color));">
                <span class="text-4xl font-black tracking-tighter opacity-10 uppercase" style="color: var(--primary-color); line-height: 0.9;">${title}</span>
              </div>
            `;

          return `
            <div class="group relative overflow-hidden rounded-3xl shadow-lg bg-white border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
              <div class="h-72 overflow-hidden relative bg-gray-50 flex-none">
                ${thumbHTML}
                <a href="${link}" class="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm z-20">
                  <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </div>
                </a>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">${title}</h3>
                <p class="opacity-70 leading-relaxed line-clamp-3">${desc}</p>
              </div>
            </div>
          `;
        }).join('') || `
          <div class="col-span-full py-24 text-center bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100">
             <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
            <p class="text-gray-400 text-xl font-bold uppercase tracking-widest">No Projects Yet</p>
            <p class="text-gray-400 mt-2">Add your amazing work from the builder editor.</p>
          </div>
        `;

        return `
          <section id="section-${section.id}" class="portfolio-section py-28 px-6" ${combinedStyle}>
            ${bgHTML}
            <div class="max-w-7xl mx-auto relative z-10">
              <div class="text-center mb-20">
                <h2 class="text-4xl md:text-7xl font-bold mb-8 tracking-tight">${section.content.title || ''}</h2>
                <p class="text-2xl opacity-70 max-w-3xl mx-auto font-medium">${section.content.subtitle || ''}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${itemsHTML}
              </div>
            </div>
          </section>
        `;
      }

      if (section.templateId === 'contact-section') {
        return `
          <section id="section-${section.id}" class="contact-section py-24 px-6 max-w-7xl mx-auto" ${combinedStyle}>
            <div class="text-center mb-16">
              <h2 class="text-4xl md:text-6xl font-bold mb-6">${section.content.title || ''}</h2>
              <p class="text-xl opacity-80 max-w-2xl mx-auto">${section.content.subtitle || ''}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
              ${section.content.email ? `
                <div class="p-10 rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 flex-none">
                    <span class="text-blue-600 font-bold text-xl">@</span>
                  </div>
                  <h3 class="text-2xl font-bold mb-3 text-center flex-none">Email</h3>
                  <p class="text-lg opacity-70 text-center flex-1">${section.content.email}</p>
                </div>
              ` : ''}
              
              ${section.content.phone ? `
                <div class="p-10 rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 flex-none">
                    <span class="text-green-600 font-bold text-xl">#</span>
                  </div>
                  <h3 class="text-2xl font-bold mb-3 text-center flex-none">Phone</h3>
                  <p class="text-lg opacity-70 text-center flex-1">${section.content.phone}</p>
                </div>
              ` : ''}
              
              ${section.content.address ? `
                <div class="p-10 rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 flex-none">
                    <span class="text-purple-600 font-bold text-xl">^</span>
                  </div>
                  <h3 class="text-2xl font-bold mb-3 text-center flex-none">Address</h3>
                  <p class="text-lg opacity-70 text-center flex-1">${section.content.address}</p>
                </div>
              ` : ''}
            </div>
          </section>
        `;
      }

      if (section.templateId === 'footer-advanced') {
        const copyright = section.content.copyright || `© ${new Date().getFullYear()} ${theme.name || 'Pagentum'}. All rights reserved.`;
        return `
          <footer class="footer-advanced py-20" ${combinedStyle}>
            ${bgHTML}
            <div class="max-w-7xl mx-auto px-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left">
                <div class="space-y-6">
                  <h3 class="text-2xl font-bold">${section.content.companyName || 'Pagentum'}</h3>
                  <p class="opacity-70 leading-relaxed max-w-md">${section.content.description || ''}</p>
                  <div class="flex justify-start space-x-4">
                    ${['social1', 'social2', 'social3', 'social4'].map((prefix) => {
          const href = section.content[`${prefix}Link` as keyof typeof section.content] || '#';
          const type = (section.content[`${prefix}Type` as keyof typeof section.content] || 'facebook').toLowerCase();

          const icons: Record<string, { svg: string, color: string }> = {
            facebook: {
              color: '#1877F2',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
            },
            twitter: {
              color: '#1DA1F2',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
            },
            instagram: {
              color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.282.888.889 1.222 2.154 1.29 3.598.073 1.357.081 1.793.081 5.17s-.008 3.813-.081 5.17c-.067 1.442-.401 2.708-1.29 3.598-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.282-.888-.889-1.222-2.154-1.29-3.598-.073-1.357-.081-1.793-.081-5.17s.008-3.813.081-5.17c.067-1.442.401-2.708 1.29-3.598.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.01 4.01 0 110-8.019A4.01 4.01 0 0112 16zm7.846-10.405a1.441 1.441 0 11-2.881 0 1.441 1.441 0 012.881 0z"/></svg>'
            },
            linkedin: {
              color: '#0077B5',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
            },
            youtube: {
              color: '#FF0000',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
            },
            github: {
              color: '#333333',
              svg: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
            }
          };

          const config = icons[type] || icons.facebook;
          const iconId = `social-icon-${section.id}-${prefix}`;

          return `
                    <style>
                      #${iconId}:hover {
                        background: ${config.color} !important;
                        color: white !important;
                        transform: translateY(-3px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                      }
                    </style>
                    <a id="${iconId}" href="${href}" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm" 
                       style="background: color-mix(in srgb, var(--text-color) 10%, transparent); color: var(--text-color);">
                        ${config.svg}
                    </a>`;
        }).join('')}
                  </div>
                </div>
                
                <div class="space-y-6">
                  <h4 class="text-lg font-bold">Quick Links</h4>
                  ${(() => {
            let heroCount = 0;
            const linkSections = sections.filter(s => s.templateId !== 'navbar-1' && s.templateId !== 'footer-1' && s.templateId !== 'footer-advanced');

            const allLinks = linkSections.map(s => {
              let label = s.content.title;
              if (s.templateId.includes('hero')) {
                heroCount++;
                if (heroCount === 1) label = 'Home';
                else if (heroCount === 2) label = 'About';
                else return null;
              }
              if (!label) return null;
              return `<a href="#section-${s.id}" class="hover:text-white transition-colors text-sm">${label}</a>`;
            }).filter(Boolean);

            if (allLinks.length > 6) {
              return `<div class="grid grid-cols-2 gap-x-8 gap-y-3 opacity-70">
                          ${allLinks.join('')}
                        </div>`;
            }

            return `<div class="flex flex-col space-y-3 opacity-70">
                        ${allLinks.join('')}
                      </div>`;
          })()}
                </div>

                <div class="space-y-6">
                  <h4 class="text-lg font-bold">Contact Us</h4>
                  <div class="space-y-3 opacity-70 text-sm">
                    ${section.content.email ? `<p>${section.content.email}</p>` : ''}
                    ${section.content.phone ? `<p>${section.content.phone}</p>` : ''}
                    ${section.content.address ? `<p>${section.content.address}</p>` : ''}
                  </div>
                </div>
              </div>
              <div class="pt-8 border-t border-gray-800 text-center opacity-50 text-sm" style="border-color: color-mix(in srgb, var(--text-color) 10%, transparent)">
                <p>${copyright}</p>
              </div>
            </div>
          </footer>
        `;
      }

      if (section.templateId === 'footer-1') {
        const copyright = section.content.copyright || `© ${new Date().getFullYear()} ${theme.name || 'Pagentum'}. All rights reserved.`;
        return `
          <footer class="footer-section py-12" ${combinedStyle}>
            ${bgHTML}
            <div class="footer-content max-w-7xl mx-auto px-4 text-center relative z-10">
              <div class="footer-links flex flex-wrap justify-center gap-6 mb-8">
                ${(() => {
            let heroCount = 0;
            return sections
              .filter(s => s.templateId !== 'navbar-1' && s.templateId !== 'footer-1' && s.templateId !== 'footer-advanced')
              .map(s => {
                let label = s.content.title;
                if (s.templateId.includes('hero')) {
                  heroCount++;
                  if (heroCount === 1) label = 'Home';
                  else if (heroCount === 2) label = 'About';
                  else return null;
                }
                if (!label) return null;
                return `<a href="#section-${s.id}" class="hover:text-primary transition-colors" style="color: inherit; text-decoration: none;">${label}</a>`;
              })
              .filter(Boolean)
              .join('');
          })()}
                ${['link1', 'link2', 'link3', 'link4'].map(key => {
            const label = section.content[key as keyof typeof section.content];
            const href = section.content[`${key}Href` as keyof typeof section.content] || '#';
            return label ? `<a href="${href}" class="hover:text-primary transition-colors" style="color: inherit; text-decoration: none; font-size: 0.9rem; white-space: nowrap;">${label}</a>` : '';
          }).filter(Boolean).join('')}
              </div>
              <p class="footer-copyright opacity-80">${copyright}</p>
            </div>
          </footer>
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
        html = html.replace('<section', `<section id="section-${section.id}" ${combinedStyle}`);
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${theme.primaryColor}',
            secondary: '${theme.secondaryColor}',
            accent: '${theme.accentColor || theme.primaryColor}'
          }
        }
      }
    }
  </script>
  ${sections.some(s => s.layout?.backgroundType === 'video' && s.layout?.backgroundVideo?.toLowerCase().endsWith('.m3u8')) ? '<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>' : ''}
  <style>
${css}
  </style>
</head>
<body>
${sectionsHTML}
  <div class="mobile-overlay" onclick="document.querySelector('.nav-links').classList.remove('active'); document.querySelector('.mobile-menu-btn').classList.remove('active'); this.classList.remove('active')"></div>
  <script>
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#section-')) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId) || document.querySelector('[id="'+targetId+'"]');
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
            document.querySelector('.mobile-overlay').classList.remove('active');
          }
        }
      });
    });

    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.querySelector('.mobile-overlay').classList.toggle('active');
      });
    }
  </script>
</body>
</html>`;
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
