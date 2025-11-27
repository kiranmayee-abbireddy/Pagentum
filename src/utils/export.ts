import { PageSection, ThemeConfig } from '../types';
import { sectionTemplates } from '../data/templates';
import { generateCSS } from '../data/themes';

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
      // NEW TEMPLATES - HANDLE FIRST
      if (section.templateId === 'hero-image-advanced') {
        const variant = (section.layout as any)?.variant || 'image-right';
        const img = section.images?.[0];
        const showButton = (section.layout as any)?.showButton ?? true;
        const buttonLabel = (section.layout as any)?.buttonLabel || section.content.ctaText || 'Get Started';
        const buttonHref = (section.layout as any)?.buttonHref || '#';
        
        return `
          <section class="hero-advanced py-20 px-4 max-w-7xl mx-auto">
            <div class="hero-inner flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 ${
              variant === 'image-left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }">
              <div class="hero-text flex-1 text-center lg:text-left">
                <h1 class="text-4xl lg:text-5xl font-bold mb-6">${section.content.title}</h1>
                <p class="text-xl text-gray-600 mb-8 max-w-lg">${section.content.subtitle}</p>
                ${showButton ? 
                  `<a href="${buttonHref}" class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">${buttonLabel}</a>` : ''
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
        
        return `
          <section class="product-carousel py-20 px-4 max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-bold mb-4">${section.content.title}</h2>
              <p class="text-xl text-gray-600">${section.content.subtitle}</p>
            </div>
            <div class="product-track ${getCarouselClasses(carouselStyle)}">
              ${section.images?.map((img, idx) => {
                const productNum = idx + 1;
                return `
                  <div class="product-card flex flex-col min-w-[280px] mx-2 snap-center">
                    <div class="product-image mb-4">
                      <img src="${img.src}" alt="${img.alt || `Product ${productNum}`}" class="w-full h-48 object-cover rounded-xl shadow-lg" />
                    </div>
                    <div class="product-info p-4 flex-1 flex flex-col">
                      <h3 class="font-bold text-lg mb-2">${section.content[`product${productNum}Title`] || `Product ${productNum}`}</h3>
                      <p class="text-2xl font-bold text-blue-600 mb-3">${section.content[`product${productNum}Price`] || '$99'}</p>
                      <p class="text-gray-600 mb-4 flex-1">${section.content[`product${productNum}Description`] || 'Amazing product'}</p>
                      ${showButton ? 
                        `<a href="${(section.layout as any)?.buttonHref || '#'}" class="mt-auto inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">${(section.layout as any)?.buttonLabel || 'Buy Now'}</a>` : ''
                      }
                    </div>
                  </div>
                `;
              }).join('') || `
                <div class="w-full text-center py-12">
                  <span class="text-gray-500">Upload product images</span>
                </div>
              `}
            </div>
          </section>
        `;
      }

      if (section.templateId === 'navbar-1') {
        const logo = section.images?.[0];
        return `
          <header class="site-navbar bg-white shadow-sm sticky top-0 z-50">
            <div class="nav-inner max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div class="nav-brand flex items-center space-x-3">
                ${logo ? 
                  `<img src="${logo.src}" alt="${logo.alt || section.content.logoAlt || 'Logo'}" class="h-10 w-auto" />` :
                  `<div class="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-sm font-bold">LOGO</span>
                  </div>`
                }
                <span class="text-xl font-bold text-gray-900">${section.content.siteName}</span>
              </div>
              <nav class="nav-links flex space-x-6">
                ${[
                  { label: 'nav1Label', href: 'nav1Href' },
                  { label: 'nav2Label', href: 'nav2Href' },
                  { label: 'nav3Label', href: 'nav3Href' }
                ].map((nav: any) => {
                  const label = section.content[nav.label as keyof typeof section.content];
                  const href = section.content[nav.href as keyof typeof section.content];
                  return label ? `<a href="${href || '#'}" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">${label}</a>` : '';
                }).filter(Boolean).join('')}
              </nav>
            </div>
          </header>
        `;
      }

      // YOUR ORIGINAL FALLBACK FOR ALL OTHER TEMPLATES
      const template = sectionTemplates.find(t => t.id === section.templateId);
      if (!template) return '';

      let html = template.html;
      Object.entries(section.content).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      });

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

// Add carousel helper function
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
