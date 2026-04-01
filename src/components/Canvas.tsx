import { useState } from 'react';
import { GripVertical, Trash2, Edit3 } from 'lucide-react';
import { PageSection } from '../types';
import { sectionTemplates } from '../data/templates';

interface CanvasProps {
  sections: PageSection[];
  onSectionsChange: (sections: PageSection[]) => void;
  onEditSection: (section: PageSection) => void;
  showGrid: boolean;
}

export default function Canvas({ sections, onSectionsChange, onEditSection, showGrid }: CanvasProps) {
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

    // Handle template specific logic
    if (section.templateId === 'hero-image-advanced') {
      const variant = layout?.variant || 'image-right';
      html = html.replace('{{variantClass}}', variant === 'image-left' ? 'lg:flex-row' : 'lg:flex-row-reverse');
      html = html.replace('{{imageSrc}}', section.images?.[0]?.src || '');
      html = html.replace('{{imageAlt}}', section.images?.[0]?.alt || section.content.title);
      html = html.replace('{{buttonLabel}}', layout?.buttonLabel || section.content.ctaText || 'Get Started');
      html = html.replace('{{buttonHref}}', layout?.buttonHref || '#');
      
      const showButton = layout?.showButton ?? true;
      if (!showButton) {
        html = html.replace(/{{#if showButton}}[\s\S]*?{{\/if}}/, '');
      } else {
        html = html.replace(/{{#if showButton}}(.*){{\/if}}/, '$1');
      }
    }

    if (section.templateId === 'product-carousel') {
      const carouselStyle = layout?.carouselStyle || 'auto-scroll';
      html = html.replace('{{carouselStyleClass}}', carouselStyle);
      
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
          <div class="product-card flex flex-col min-w-[280px] mx-2 snap-center">
            <div class="product-image mb-4">
              <img src="${img.src}" alt="${img.alt || title}" class="w-full h-48 object-cover rounded-xl shadow-lg" />
            </div>
            <div class="product-info p-4 flex-1 flex flex-col">
              <h3 class="font-bold text-lg mb-2 text-gray-900">${title}</h3>
              <p class="text-2xl font-bold text-blue-600 mb-3">${price}</p>
              <p class="text-gray-600 mb-4 flex-1 text-sm">${desc}</p>
              ${showButton ? `<a href="${buttonHref}" class="mt-auto bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center">${buttonLabel}</a>` : ''}
            </div>
          </div>
        `;
      }).join('');
      
      html = html.replace('{{productsHTML}}', productsHTML);
    }

    // Standard replacements
    Object.entries(section.content).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Handle section specific gradient style
    const sectionStyle = layout?.gradientEnabled
      ? { 
          background: `linear-gradient(135deg, ${layout.gradientStart}, ${layout.gradientEnd})`,
          '--gradient-start': layout.gradientStart,
          '--gradient-end': layout.gradientEnd,
          color: (section.templateId === 'hero-image-advanced' || section.templateId.includes('carousel')) ? 'white' : undefined
        }
      : {};

    return <div style={sectionStyle as any} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌪️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building Your Page</h3>
          <p className="text-gray-500">Add sections from the library or describe your layout above</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-gray-50 overflow-y-auto ${showGrid ? 'grid-overlay' : ''}`}>
      <div className="max-w-6xl mx-auto py-8">
        {sections.map((section, index) => {
          const template = sectionTemplates.find(t => t.id === section.templateId);
          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group mb-6 transition-all duration-200 ease-in-out ${
                draggedIndex === index ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'
              }`}
            >

              <div className="border-2 border-dashed border-transparent group-hover:border-blue-300 rounded-xl overflow-hidden bg-white shadow-md transition-all duration-200 hover:shadow-lg">
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full shadow-md">
                    {template?.name}
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

      <style>{`
        .grid-overlay {
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(59, 130, 246, 0.1) 79px, rgba(59, 130, 246, 0.1) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(59, 130, 246, 0.1) 79px, rgba(59, 130, 246, 0.1) 80px);
        }
      `}</style>
    </div>
  );
}
