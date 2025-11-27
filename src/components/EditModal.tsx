import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PageSection, SectionLayout, PageImage } from '../types';
import { sectionTemplates } from '../data/templates';
import { themePresets } from '../data/themes';

interface EditModalProps {
  section: PageSection;
  onSave: (section: PageSection) => void;
  onClose: () => void;
}

export default function EditModal({ section, onSave, onClose }: EditModalProps) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<PageImage[]>([]);
  const [layout, setLayout] = useState<SectionLayout>({});
  const template = sectionTemplates.find(t => t.id === section.templateId);

  useEffect(() => {
    setContent(section.content || {});
    setImages(section.images || []);
    setLayout(section.layout || {});
  }, [section]);

  const handleContentChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newImage: PageImage = {
        id: `img-${Date.now()}`,
        fileName: file.name,
        src: base64,
        alt: content.title || content.siteName || file.name.replace(/\.[^/.]+$/, ''),
      };
      setImages([newImage]);
    };
    reader.readAsDataURL(file);
  };

  const handleLayoutChange = (field: keyof SectionLayout) => (value: any) => {
    setLayout(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...section,
      content,
      images,
      layout,
    });
    onClose();
  };

  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit {template.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-8">
          {/* Content Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(template.defaultContent).map(([key, defaultValue]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                {key.includes('Description') || key.includes('quote') ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    rows={3}
                    value={content[key] || defaultValue || ''}
                    onChange={handleContentChange(key)}
                    placeholder={defaultValue as string}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={content[key] || defaultValue || ''}
                    onChange={handleContentChange(key)}
                    placeholder={defaultValue as string}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Image Upload */}
          {['hero-image-advanced', 'product-carousel', 'navbar-1'].includes(section.templateId) && (
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">Image Upload</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center">
                      📷
                    </div>
                    <p className="text-lg font-medium text-gray-900">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group">
                      <img 
                        src={img.src} 
                        alt={img.alt} 
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => setImages([])}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Layout Options */}
          {section.templateId === 'hero-image-advanced' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Layout Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="image-position"
                    value="image-left"
                    checked={layout.variant === 'image-left'}
                    onChange={() => handleLayoutChange('variant')('image-left')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Image Left, Text Right</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="image-position"
                    value="image-right"
                    checked={layout.variant === 'image-right' || !layout.variant}
                    onChange={() => handleLayoutChange('variant')('image-right')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Image Right, Text Left</span>
                </label>
              </div>
              
              <div className="mt-6 space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={layout.showButton || false}
                    onChange={(e) => handleLayoutChange('showButton')(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium">Show Call-to-Action Button</span>
                </label>
                {layout.showButton && (
                  <>
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={layout.buttonLabel || content.ctaText || ''}
                      onChange={(e) => handleLayoutChange('buttonLabel')(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="Button Link (https:// or #)"
                      value={layout.buttonHref || ''}
                      onChange={(e) => handleLayoutChange('buttonHref')(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Carousel Style */}
          {section.templateId === 'product-carousel' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Carousel Animation</h3>
              <select
                value={layout.carouselStyle || 'auto-scroll'}
                onChange={(e) => handleLayoutChange('carouselStyle')(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto-scroll">Auto-scroll (Continuous)</option>
                <option value="rail">Rail (Horizontal scroll)</option>
                <option value="grid">Grid (Bookshelf style)</option>
              </select>
              
              <div className="mt-6 space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={layout.showButton || false}
                    onChange={(e) => handleLayoutChange('showButton')(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium">Show Buy Button on Cards</span>
                </label>
                {layout.showButton && (
                  <>
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={layout.buttonLabel || 'Buy Now'}
                      onChange={(e) => handleLayoutChange('buttonLabel')(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="Button Link"
                      value={layout.buttonHref || ''}
                      onChange={(e) => handleLayoutChange('buttonHref')(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Theme Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Section Theme</h3>
            <select
              value={layout.themeId || ''}
              onChange={(e) => handleLayoutChange('themeId')(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Use Page Default</option>
              {Object.keys(themePresets).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themePresets[themeKey as keyof typeof themePresets].name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Fields for Carousel */}
          {section.templateId === 'product-carousel' && images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="space-y-4">
                {images.slice(0, 6).map((_, idx) => {
                  const productNum = idx + 1;
                  return (
                    <div key={productNum} className="border p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Product {productNum}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Product Title"
                          value={content[`product${productNum}Title`] || ''}
                          onChange={handleContentChange(`product${productNum}Title`)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Price ($99)"
                          value={content[`product${productNum}Price`] || ''}
                          onChange={handleContentChange(`product${productNum}Price`)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          rows={2}
                          placeholder="Description"
                          value={content[`product${productNum}Description`] || ''}
                          onChange={handleContentChange(`product${productNum}Description`)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-3"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
