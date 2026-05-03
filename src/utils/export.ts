import { PageSection, ThemeConfig } from '../types';
import { sectionTemplates } from '../data/templates';
import { generateCSS } from '../data/themes';
import { socialIcons } from '../data/socialIcons';

const featureIcons: Record<string, string> = {
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  palette: 'M12 21a9 9 0 110-18 9 9 0 010 18z M12 7a5 5 0 100 10 5 5 0 000-10z',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.71-2.13l.12-.13a8.48 8.48 0 016.3-6.3l.13-.12s1.29 0 2.13-.71c1.5-1.26 2-5 2-5s-3.74.5-5 2c-.71.84-.71 2.13-.71 2.13l-.12.13a8.48 8.48 0 01-6.3 6.3l-.13.12s-1.29 0-2.13.71z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 21V3 M21 12H3',
  monitor: 'M2 3h20v14H2V3zm6 18h8m-4-4v4',
  mouse: 'M12 2a5 5 0 00-5 5v10a5 5 0 0010 0V7a5 5 0 00-5-5z M12 7V5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  coffee: 'M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
  database: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5 M3 5c0 1.66 4 3 9 3s9-1.34 9-3 M3 5c0-1.66 4-3 9-3s9 1.34 9 3 M3 12c0 1.66 4 3 9 3s9-1.34 9-3',
  cpu: 'M4 4h16v16H4V4z M9 9h6v6H9V9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 15h3 M1 9h3 M1 15h3',
  layers: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5'
};

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
        // Handle conditional blocks: {{#if field}}...{{/if}}
        const hasValue = value && value !== '' && value !== 'https://via.placeholder.com/150';
        if (!hasValue) {
          html = html.replace(new RegExp(`{{\\s*#if ${key}\\s*}}[\\s\\S]*?{{\\s*/if\\s*}}`, 'g'), '');
        } else {
          html = html.replace(new RegExp(`{{\\s*#if ${key}\\s*}}([\\s\\S]*?){{\\s*/if\\s*}}`, 'g'), '$1');
        }

        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
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

      if (section.templateId === 'intro-loader') {
        const logoSrc = section.content.logoSrc;
        const showLogo = logoSrc && logoSrc !== '' && logoSrc !== 'https://cdn-icons-png.flaticon.com/512/3665/3665247.png';
        // Force fixed position to ensure it covers everything even with backgrounds
        const finalStyle = `style="${sectionRules} position: fixed !important; z-index: 100000; overflow: hidden;"`;
        const customTextColor = section.layout?.textColor;
        const fontStyle = section.layout?.introFont ? `font-family: '${section.layout.introFont}', cursive;` : '';
        const titleStyle = `style="${fontStyle} ${customTextColor ? `background: none; -webkit-text-fill-color: ${customTextColor}; color: ${customTextColor};` : ''}"`;
        const animClass = section.layout?.introTextAnimation ? `intro-text-${section.layout.introTextAnimation}` : 'intro-text-slide-up';
        const logoAnimClass = section.layout?.introLogoAnimation ? `intro-logo-${section.layout.introLogoAnimation}` : 'intro-logo-rotate-fade';
        
        return `
          <div id="section-${section.id}" class="intro-screen" ${finalStyle}>
            ${bgHTML}
            <div class="intro-content" style="position: relative; z-index: 1;">
              ${showLogo ? `
              <div class="intro-logo-wrapper ${logoAnimClass}">
                <img src="${logoSrc}" alt="Logo" class="intro-logo" />
              </div>` : ''}
              <h1 class="intro-title text-center ${animClass}" ${titleStyle}>${section.content.siteName}</h1>
              <div class="intro-progress-bar">
                <div class="intro-progress-fill" ${customTextColor ? `style="background: ${customTextColor};"` : ''}></div>
              </div>
            </div>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const intro = document.getElementById('section-${section.id}');
              if (intro) {
                const isBuilder = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const duration = isBuilder ? 1200 : 3000;
                const exitAnim = "${section.layout?.introExitAnimation || 'slide-up'}";
                const exitClass = "intro-exit-" + exitAnim;
                
                setTimeout(() => {
                  intro.classList.add(exitClass);
                  setTimeout(() => {
                     if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
                  }, 1000);
                }, duration);
              }
            });
          </script>
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
                
                <div class="bookshelf-grid grid gap-12 items-stretch justify-items-center">
                  ${displayImages.map((img, idx) => {
            const productNum = idx + 1;
            const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
            const price = section.content[`product${productNum}Price`] || '$19.99';
            const desc = section.content[`product${productNum}Description`] || 'Great product.';

            return `
                      <div class="book-card group relative w-full h-full flex flex-col shadow-xl
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.1)]
            hover:scale-110 hover:-translate-y-3 hover:shadow-2xl hover:z-20
            overflow-hidden">
                        
                        <div class="img-container">
                          <img src="${img.src}" alt="${img.alt || title}" 
                              class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        
                        <div class="p-5 flex-1 flex flex-col">
                          <h3 class="font-bold text-lg mb-2 line-clamp-2 leading-tight">${title}</h3>
                          <p class="text-2xl font-black text-primary mb-3">${price}</p>
                          <p class="text-sm leading-relaxed line-clamp-6 flex-1 mb-4">${desc}</p>
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
      if (section.templateId === 'features-3col') {
        const title = section.content.title || 'Key Features';
        const subtitle = section.content.subtitle || '';

        const cardsHTML = [1, 2, 3].map(i => {
          const fTitle = section.content[`feature${i}Title`] || `Feature ${i}`;
          const fDesc = section.content[`feature${i}Desc`] || '';
          const iconKey = section.content[`feature${i}Icon`] || 'zap';
          const iconPath = featureIcons[iconKey] || featureIcons.zap;
          const cardId = `feature-card-${section.id}-${i}`;

          return `
            <style>
              #${cardId} {
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                background: color-mix(in srgb, var(--text-color) 5%, var(--bg-color));
                backdrop-filter: blur(10px);
                border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
              }
              #${cardId}:hover {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                border-color: var(--primary-color);
                background: color-mix(in srgb, var(--primary-color) 5%, var(--bg-color));
              }
              #${cardId} .icon-glow {
                transition: all 0.5s ease;
                opacity: 0;
                filter: blur(20px);
                background: var(--primary-color);
              }
              #${cardId}:hover .icon-glow {
                opacity: 0.2;
                transform: scale(1.5);
              }
              #${cardId} .icon-svg {
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                color: var(--primary-color);
              }
              #${cardId}:hover .icon-svg {
                transform: scale(1.2) rotate(5deg);
              }
            </style>
            <div id="${cardId}" class="p-10 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group">
              <div class="relative w-20 h-20 mb-8 flex items-center justify-center">
                <div class="icon-glow absolute inset-0 rounded-full"></div>
                <div class="icon-svg relative z-10 w-12 h-12 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
                    <path d="${iconPath}"></path>
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold mb-4" style="color: var(--text-color);">${fTitle}</h3>
              <p class="leading-relaxed opacity-70" style="color: var(--text-color);">${fDesc}</p>
            </div>
          `;
        }).join('');

        return `
          <section id="section-${section.id}" class="features-section py-32 px-6" ${combinedStyle}>
            ${bgHTML}
            <div class="max-w-7xl mx-auto relative z-10">
              <div class="text-center mb-24">
                <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">${title}</h2>
                <p class="text-xl opacity-70 max-w-2xl mx-auto font-medium">${subtitle}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                ${cardsHTML}
              </div>
            </div>
          </section>
        `.replace('{{featuresHTML}}', cardsHTML);
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
                    ${(() => {
            const socialHTML = ['social1', 'social2', 'social3', 'social4', 'social5', 'social6'].map((prefix) => {
              let href = section.content[`${prefix}Link` as keyof typeof section.content];
              if (!href || href === '#') return '';

              if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                href = `https://${href}`;
              }

              const type = (section.content[`${prefix}Type` as keyof typeof section.content] || 'facebook').toLowerCase();
              const config = socialIcons.find((icon: any) => icon.id === type) || socialIcons[0];
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
                      <a id="${iconId}" href="${href}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm" 
                         style="background: color-mix(in srgb, var(--text-color) 10%, transparent); color: var(--text-color);">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="${config.path}"/></svg>
                      </a>`;
            }).join('');
            return socialHTML;
          })()}
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
        // Handle conditional blocks: {{#if field}}...{{/if}}
        const hasValue = value && value !== '' && value !== 'https://via.placeholder.com/150';
        if (!hasValue) {
          html = html.replace(new RegExp(`{{\\s*#if ${key}\\s*}}[\\s\\S]*?{{\\s*/if\\s*}}`, 'g'), '');
        } else {
          html = html.replace(new RegExp(`{{\\s*#if ${key}\\s*}}([\\s\\S]*?){{\\s*/if\\s*}}`, 'g'), '$1');
        }

        html = html.replace(new RegExp(`{{${key}}}`, 'g'), (value as string) || '');
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css?family=Abril+Fatface|Anton|Bangers|Bebas+Neue|Berkshire+Swash|Bungee+Shade|Cinzel+Decorative|Creepster|Fredoka+One|Great+Vibes|Lobster|Luckiest+Guy|Monoton|Orbitron:900|Pacifico|Permanent+Marker|Press+Start+2P|Righteous|Russo+One|Sacramento&display=swap" rel="stylesheet">
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
