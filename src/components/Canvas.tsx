import { useState } from 'react';
import { GripVertical, Trash2, Edit3, Palette, Video, Image as ImageIcon } from 'lucide-react';
import { PageSection } from '../types';
import { sectionTemplates } from '../data/templates';
import { socialIcons } from '../data/socialIcons';

interface CanvasProps {
  sections: PageSection[];
  onSectionsChange: (sections: PageSection[]) => void;
  onEditSection: (section: PageSection) => void;
}

export default function Canvas({ sections, onSectionsChange, onEditSection }: CanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);

    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    onSectionsChange(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDelete = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    newSections.forEach((section, idx) => {
      section.order = idx;
    });
    onSectionsChange(newSections);
  };

  const renderSection = (section: PageSection) => {
    const template = sectionTemplates.find(t => t.id === section.templateId);
    if (!template) return null;

    let html = template.html;
    const layout = section.layout as any;

    if (section.templateId === 'navbar-1') {
      const logo = section.images?.[0];
      const logoHTML = logo
        ? `<img src="${logo.src}" alt="${logo.alt || 'Logo'}" style="height: 20px !important; width: auto !important; display: block;" />`
        : `<div class="h-4 w-4 bg-gray-200 rounded-full flex items-center justify-center text-[6px] font-bold">L</div>`;

      // Replace the img tag BEFORE replacing individual placeholders
      html = html.replace(/<img src="{{logoSrc}}".*?\/>/, logoHTML);
      html = html.replace('{{logoSrc}}', logo ? logo.src : '');

      // Force navbar-1 inner structure for editor
      html = html.replace('class="nav-inner"', 'class="nav-inner flex items-center justify-between px-2 py-1 flex-wrap gap-2"');
      html = html.replace('class="nav-brand"', 'class="nav-brand flex items-center space-x-2 shrink-0"');
      html = html.replace('class="nav-links"', 'class="nav-links-editor flex flex-wrap gap-1.5 sm:gap-3 justify-center"');

      // Remove mobile menu button from editor view
      html = html.replace(/<button class="mobile-menu-btn"[\s\S]*?<\/button>/, '');
      const navLinks = [
        ...(() => {
          let heroCount = 0;
          const linkSections = sections.filter(s => {
            const template = sectionTemplates.find(t => t.id === s.templateId);
            return template?.category !== 'cta' && s.templateId !== 'navbar-1' && s.templateId !== 'footer-1' && s.templateId !== 'footer-advanced';
          });
          return linkSections
            .map(s => {
              let label = s.content.title;
              if (s.templateId.includes('hero')) {
                heroCount++;
                if (heroCount === 1) label = 'Home';
                else if (heroCount === 2) label = 'About';
                else return null;
              }
              if (!label) return null;
              return `
                <a href="#section-${s.id}" 
                   onClick="document.getElementById('section-${s.id}')?.scrollIntoView({ behavior: 'smooth' })" 
                   class="text-gray-500 hover:text-blue-600 font-bold text-[8px] uppercase tracking-wider"
                   style="cursor: pointer;"
                >
                  ${label}
                </a>
              `;
            })
            .filter(Boolean);
        })(),
        ...[
          { label: 'nav1Label', href: 'nav1Href' },
          { label: 'nav2Label', href: 'nav2Href' },
          { label: 'nav3Label', href: 'nav3Href' },
          { label: 'nav4Label', href: 'nav4Href' },
          { label: 'nav5Label', href: 'nav5Href' },
          { label: 'nav6Label', href: 'nav6Href' }
        ].map(nav => {
          const label = section.content[nav.label as keyof typeof section.content];
          const href = section.content[nav.href as keyof typeof section.content];
          return label ? `<a href="${href || '#'}" class="text-gray-500 hover:text-blue-600 font-bold text-[8px] uppercase tracking-wider">${label}</a>` : '';
        })
      ].join('');

      html = html.replace('{{navLinksHTML}}', navLinks);
    }

    if (section.templateId === 'video-section') {
      const variant = layout?.variant || 'video-right';
      html = html.replace('{{variantClass}}', variant === 'video-left' ? 'lg:flex-row-reverse flex-col' : 'lg:flex-row flex-col');

      const videoUrl = section.content.videoUrl || '';
      // Simplified preview for editor
      html = html.replace('{{videoEmbedHTML}}',
        `<div class="w-full h-full bg-gray-900 rounded-xl flex flex-col items-center justify-center p-4">
           <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mb-2">
             <div class="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
           </div>
           <span class="text-[7px] text-white/40 font-bold uppercase tracking-widest text-center">${videoUrl ? 'Video Stream Ready' : 'Paste Video Link'}</span>
         </div>`
      );

      // Basic structure for editor
      html = html.replace('class="video-inner"', 'class="video-inner flex items-center gap-4 py-2"');
      html = html.replace('class="video-text"', 'class="video-text flex-1"');
      html = html.replace('class="video-container"', 'class="video-container flex-1 h-64"');
      html = html.replace('<h2>', '<h2 class="text-sm font-bold mb-1">');
      html = html.replace('<p>', '<p class="text-[9px] text-gray-500 leading-tight">');
    }

    if (section.templateId === 'hero-image-advanced') {
      const variant = layout?.variant || 'image-right';
      html = html.replace('{{variantClass}}', variant === 'image-left' ? 'lg:flex-row flex-col' : 'lg:flex-row-reverse flex-col');

      const imageSrc = section.images?.[0]?.src || '';
      const imageAlt = section.images?.[0]?.alt || section.content.title;

      // Force hero image to be truly tiny
      html = html.replace(/<div class="hero-image">[\s\S]*?<\/div>/,
        `<div class="hero-image flex justify-center py-1"><img src="${imageSrc}" alt="${imageAlt}" class="h-30 w-40 object-cover rounded shadow-sm border border-gray-50" /></div>`
      );

      html = html.replace('{{buttonLabel}}', layout?.buttonLabel || section.content.ctaText || 'Get Started');
      html = html.replace('{{buttonHref}}', layout?.buttonHref || '#');

      const showButton = layout?.showButton ?? true;
      if (!showButton) {
        html = html.replace(/{{#if showButton}}[\s\S]*?{{\/if}}/, '');
      } else {
        html = html.replace(/{{#if showButton}}(.*){{\/if}}/, '$1');
      }
    }

    if (section.templateId === 'contact-section') {
      const emailHTML = section.content.email ? `
        <div class="p-2 rounded-lg border border-gray-100 bg-gray-50">
          <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span class="text-blue-600 text-[6px] font-bold">@</span>
          </div>
          <p class="text-[7px] text-gray-500 truncate">${section.content.email}</p>
        </div>` : '';

      const phoneHTML = section.content.phone ? `
        <div class="p-2 rounded-lg border border-gray-100 bg-gray-50">
          <div class="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span class="text-green-600 text-[6px] font-bold">#</span>
          </div>
          <p class="text-[7px] text-gray-500 truncate">${section.content.phone}</p>
        </div>` : '';

      const addressHTML = section.content.address ? `
        <div class="p-2 rounded-lg border border-gray-100 bg-gray-50">
          <div class="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <span class="text-purple-600 text-[6px] font-bold">^</span>
          </div>
          <p class="text-[7px] text-gray-500 truncate">${section.content.address}</p>
        </div>` : '';

      html = `
        <div class="py-4 px-2 text-center">
          <h2 class="text-sm font-bold mb-1">${section.content.title || ''}</h2>
          <p class="text-[8px] opacity-60 mb-4">${section.content.subtitle || ''}</p>
          <div class="grid grid-cols-3 gap-2">
            ${emailHTML}
            ${phoneHTML}
            ${addressHTML}
          </div>
        </div>
      `;
    }

    if (section.templateId === 'portfolio-grid') {
      const count = parseInt(section.content.projectCount || '0');
      const itemsHTML = Array.from({ length: count }).map((_, idx) => {
        const num = idx + 1;
        const title = section.content[`proj${num}Title`] || `Project ${num}`;
        const desc = section.content[`proj${num}Desc`] || '';
        const thumb = section.content[`proj${num}Thumb`];

        return `
          <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
            <div class="h-16 overflow-hidden bg-gray-100 flex items-center justify-center p-2 text-center" style="background: color-mix(in srgb, var(--primary-color) 8%, var(--bg-color));">
              <span class="text-[10px] font-black uppercase tracking-tighter opacity-10" style="color: var(--primary-color); line-height: 0.8;">${title}</span>
            </div>
            <div class="p-2 flex-1">
              <h3 class="text-[9px] font-bold mb-0.5 line-clamp-1">${title}</h3>
              <p class="text-[7px] text-gray-500 line-clamp-2">${desc}</p>
            </div>
          </div>
        `;
      }).join('') || `
        <div class="col-span-full py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p class="text-[8px] text-gray-400 font-bold uppercase tracking-widest">No Projects Added</p>
          <p class="text-[7px] text-gray-400 italic">Click edit and use "Add Project" to begin.</p>
        </div>
      `;

      html = `
        <div class="py-4 px-2 text-center">
          <h2 class="text-sm font-bold mb-1">${section.content.title || ''}</h2>
          <p class="text-[8px] opacity-60 mb-4">${section.content.subtitle || ''}</p>
          <div class="grid grid-cols-3 gap-3">
            ${itemsHTML}
          </div>
        </div>
      `;
    }

    if (section.templateId === 'footer-advanced') {
      html = html.replace('class="footer-advanced py-16 px-6"', 'class="py-4 px-2 border-t border-gray-100"');
      html = html.replace('class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-left"', 'class="grid grid-cols-3 gap-4 mb-4 text-left"');
      html = html.replace('class="text-2xl font-bold mb-4"', 'class="text-[10px] font-bold mb-1"');
      html = html.replace('class="text-gray-400 max-w-md leading-relaxed"', 'class="text-[7px] text-gray-500 leading-tight"');
      html = html.replace('class="flex justify-start space-x-4"', 'class="flex space-x-1.5 mt-2"');
      html = html.replace(/class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-colors"/g, 'class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center"');
      html = html.replace(/class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors"/g, 'class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center"');
      html = html.replace(/class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors"/g, 'class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center"');
      html = html.replace(/class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"/g, 'class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center"');
      html = html.replace(/class="text-xs font-bold"/g, 'class="text-[5px] font-bold text-gray-400"');

      html = html.replace(/class="text-lg font-bold mb-4"/g, 'class="text-[8px] font-bold mb-2 text-gray-900"');
      html = html.replace(/class="flex flex-col space-y-2 text-gray-400"/g, 'class="flex flex-col space-y-1"');
      html = html.replace(/class="hover:text-white transition-colors"/g, 'class="text-[7px] text-gray-400"');
      html = html.replace(/class="space-y-2 text-gray-400"/g, 'class="space-y-1"');
      html = html.replace(/<p>/g, '<p class="text-[7px] text-gray-400">');

      html = html.replace('class="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-gray-500"', 'class="pt-2 border-t border-gray-50 text-center"');
      html = html.replace(/<p>{{copyright}}<\/p>/, '<p class="text-[6px] text-gray-400">{{copyright}}</p>');
    }

    if (section.templateId === 'pricing-3tier') {
      html = html.replace('class="pricing-grid"', 'class="pricing-grid grid grid-cols-3 gap-3 px-2 py-4"');
      html = html.replace(/class="pricing-card"/g, 'class="pricing-card p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center"');
      html = html.replace('class="pricing-card pricing-featured"', 'class="pricing-card p-3 bg-blue-50 rounded-xl border border-blue-200 flex flex-col items-center scale-105 shadow-sm"');

      // Inline typography scaling for editor
      html = html.replace(/class="pricing-tier"/g, 'class="font-bold text-[10px] text-gray-900 mb-1"');
      html = html.replace(/class="pricing-price"/g, 'class="text-xs font-black text-blue-600 mb-2"');
      html = html.replace(/class="pricing-features"/g, 'class="space-y-1 mb-3 text-[8px] text-gray-500 list-none p-0"');
      html = html.replace(/class="pricing-button"/g, 'class="mt-auto w-full py-1 bg-gray-800 text-white text-[8px] rounded font-bold"');
    }

    if (section.templateId === 'product-carousel') {
      // Apply flexbox directly to the product-track inside the template HTML
      html = html.replace('class="product-track"', 'class="product-track flex flex-wrap gap-3 justify-center px-2 py-2"');

      const imageCount = layout?.imageCount || section.images?.length || 5;
      const displayImages = section.images?.slice(0, imageCount) || [];
      const showButton = layout?.showButton ?? false;
      const buttonHref = layout?.buttonHref || '#';
      const buttonLabel = layout?.buttonLabel || 'Buy Now';

      const productsHTML = displayImages.map((img, idx) => {
        const productNum = idx + 1;
        const title = section.content[`product${productNum}Title`] || `Product ${productNum}`;
        const price = section.content[`product${productNum}Price`] || '$99';
        const desc = section.content[`product${productNum}Description`] || 'Amazing product';

        return `
          <div class="product-card flex flex-col w-[120px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-transform hover:scale-105">
            <div class="h-12 w-full bg-gray-100 relative group overflow-hidden">
              <img src="${img.src}" alt="${img.alt || title}" class="w-full h-full object-cover" />
              <div class="absolute bottom-0.5 right-0.5 bg-white/95 backdrop-blur-sm px-1 py-0.5 rounded-[2px] text-[8px] font-bold text-gray-800">
                ${price}
              </div>
            </div>
            <div class="p-1.5 flex-1 flex flex-col bg-white">
              <h3 class="font-bold text-[9px] text-gray-900 mb-0.5 line-clamp-1">${title}</h3>
              <p class="text-[8px] text-gray-500 line-clamp-1 mb-1.5">${desc}</p>
              ${showButton ? `
                <div class="mt-auto border-t border-gray-50 pt-1">
                  <a href="${buttonHref}" class="w-full inline-block bg-blue-600 text-white text-[7px] py-1 rounded font-bold text-center">
                    ${buttonLabel}
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      html = html.replace('{{productsHTML}}', productsHTML);
    }

    if (section.templateId === 'footer-1') {
      const links = [
        ...(() => {
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
              return `
                <a href="#section-${s.id}" 
                   onClick="document.getElementById('section-${s.id}')?.scrollIntoView({ behavior: 'smooth' })" 
                   class="text-gray-500 hover:text-blue-600 font-bold text-[8px] uppercase tracking-wider mx-2"
                   style="cursor: pointer;"
                >
                  ${label}
                </a>
              `;
            })
            .filter(Boolean);
        })(),
        ...['link1', 'link2', 'link3', 'link4', 'link5', 'link6'].map(key => {
          const label = section.content[key as keyof typeof section.content];
          return label ? `<a href="#" class="text-gray-500 hover:text-blue-600 font-bold text-[8px] uppercase tracking-wider mx-2">${label}</a>` : '';
        })
      ].join('');

      html = html.replace(/<div class="footer-links">[\s\S]*?<\/div>/, `<div class="footer-links flex flex-wrap justify-center py-2">${links}</div>`);
    }

    if (section.templateId === 'footer-advanced') {
      const socialHTML = ['social1', 'social2', 'social3', 'social4', 'social5', 'social6']
        .map((prefix) => {
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
                transform: translateY(-2px);
              }
            </style>
            <a id="${iconId}" href="${href}" target="_blank" rel="noopener noreferrer" 
               class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm pointer-events-auto" 
               style="background: rgba(0,0,0,0.05); color: #666; margin-right: 8px; display: flex; cursor: pointer !important;">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style="pointer-events: none;"><path d="${config.path}"/></svg>
            </a>
          `;
        })
        .join('');

      html = html.replace('{{socialLinksHTML}}', socialHTML);
    }

    // Standard replacements
    Object.entries(section.content).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Simplified Canvas view: No colors/gradients (reserved for preview only)
    return <div dangerouslySetInnerHTML={{ __html: html }} className="rounded-xl bg-white" />;
  };

  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="text-6xl mb-4">🌪️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building Your Page</h3>
          <p className="text-gray-500">Add sections from the library or describe your layout above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth bg-transparent">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {sections.map((section, index) => {
          const template = sectionTemplates.find(t => t.id === section.templateId);
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group mb-6 transition-all duration-200 ease-in-out ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'
                }`}
            >

              <div className="border-2 border-dashed border-transparent group-hover:border-blue-300 rounded-xl overflow-hidden bg-white shadow-md transition-all duration-200 hover:shadow-lg">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                  <span className="px-2 py-1 bg-blue-600 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wide rounded shadow-sm flex items-center gap-1">
                    {template?.name}
                    {section.layout?.backgroundType && section.layout?.backgroundType !== 'plain' && (
                      <span className="flex items-center gap-1 ml-1 pl-1 border-l border-white/20 text-[7px] sm:text-[8px] font-semibold text-blue-200">
                        {section.layout.backgroundType === 'gradient' && <Palette className="w-2.5 h-2.5" />}
                        {section.layout.backgroundType === 'video' && <Video className="w-2.5 h-2.5" />}
                        {section.layout.backgroundType === 'image' && <ImageIcon className="w-2.5 h-2.5" />}
                        {section.layout.backgroundType.toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-md">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                      title="Drag to reorder"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSection(section);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit section"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(section.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {renderSection(section)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
