import { useState, useEffect } from 'react';
import { X, Layout, Type as TypeIcon, Image as ImageIcon, Palette, Settings2, Trash2, Plus, ArrowRight } from 'lucide-react';
import { PageSection, SectionLayout, PageImage } from '../types';
import { sectionTemplates } from '../data/templates';
import { themePresets } from '../data/themes';

interface EditModalProps {
  section: PageSection;
  onSave: (section: PageSection) => void;
  onClose: () => void;
}

type TabType = 'content' | 'design';

export default function EditModal({ section, onSave, onClose }: EditModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');
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
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise<PageImage>(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `img-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            src: reader.result as string,
            alt: content.title || content.siteName || file.name.replace(/\.[^/.]+$/, ''),
          });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imagesFromFiles => {
      setImages(prev => [...prev, ...imagesFromFiles]);
    });
  };

  const handleLayoutChange = (field: keyof SectionLayout) => (value: any) => {
    setLayout(prev => ({ ...prev, [field]: value }));
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
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
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[650px] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        {/* Header - Fixed Height */}
        <div className="flex-none px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1 uppercase tracking-tight">Edit Section</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{template.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher - Fixed Height */}
        <div className="flex-none flex p-1 gap-1 bg-gray-100/80 mx-6 mt-4 rounded-xl">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-all font-bold text-[10px] tracking-widest ${
              activeTab === 'content' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <TypeIcon className="w-3 h-3" />
            <span>CONTENT</span>
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-all font-bold text-[10px] tracking-widest ${
              activeTab === 'design' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>DESIGN</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
          {activeTab === 'content' ? (
            <div className="space-y-8 animate-in slide-in-from-right-2 fade-in duration-300">
              {/* Image Group */}
              {['hero-image-advanced', 'product-carousel', 'navbar-1'].includes(section.templateId) && (
                <section>
                  <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Images</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="relative group h-24">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                        multiple={section.templateId === 'product-carousel'}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Add</span>
                      </label>
                    </div>

                    {images.map(img => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 h-24 shadow-sm">
                        <img src={img.src} alt="Preview" className="w-full h-full object-cover" />
                        {/* Restored Backdrop Blur Hover */}
                        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                          <button 
                            onClick={() => removeImage(img.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform shadow-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Text Content */}
              <section>
                <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                  <TypeIcon className="w-4 h-4 text-gray-400" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Text Content</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                  {Object.entries(template.defaultContent).map(([key, defaultValue]) => (
                    <div key={key} className={`${(key.includes('Description') || key.includes('quote')) ? 'md:col-span-2' : ''} space-y-1`}>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {key.includes('Description') || key.includes('quote') ? (
                        <textarea
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium text-gray-600 shadow-sm"
                          rows={3}
                          value={content[key] || defaultValue || ''}
                          onChange={handleContentChange(key)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-bold text-gray-900 shadow-sm"
                          value={content[key] || defaultValue || ''}
                          onChange={handleContentChange(key)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Product Entries */}
              {section.templateId === 'product-carousel' && images.length > 0 && (
                <section>
                  <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <Layout className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Catalog</h3>
                  </div>
                  <div className="space-y-3">
                    {images.slice(0, layout.imageCount || images.length).map((_, idx) => {
                      const productNum = idx + 1;
                      return (
                        <div key={productNum} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                          <div className="flex items-center space-x-2 mb-3">
                               <span className="w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center font-bold text-[10px]">{productNum.toString().padStart(2, '0')}</span>
                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Item Specification</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                placeholder="Product Title"
                                value={content[`product${productNum}Title`] || ''}
                                onChange={handleContentChange(`product${productNum}Title`)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:border-blue-300 outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="$ --"
                                value={content[`product${productNum}Price`] || ''}
                                onChange={handleContentChange(`product${productNum}Price`)}
                                className="w-full px-3 py-2 bg-blue-50/50 border border-transparent rounded-lg text-xs font-black text-blue-700"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <textarea
                                rows={2}
                                placeholder="Features and details..."
                                value={content[`product${productNum}Description`] || ''}
                                onChange={handleContentChange(`product${productNum}Description`)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-500 focus:border-blue-300 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left-2 fade-in duration-300">
              {/* layout options */}
              <section className="space-y-6">
                {section.templateId === 'hero-image-advanced' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Image Position</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleLayoutChange('variant')('image-left')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                          layout.variant === 'image-left' 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-50' 
                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                         <Layout className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Left</span>
                      </button>
                      <button
                        onClick={() => handleLayoutChange('variant')('image-right')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                          layout.variant === 'image-right' || !layout.variant
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-50' 
                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                         <Layout className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Right</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-5 bg-white rounded-xl border border-gray-100 space-y-6 shadow-sm">
                  {section.templateId === 'product-carousel' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Animation Effect</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['auto-scroll', 'rail', 'grid', 'glowing'].map(style => (
                            <button
                              key={style}
                              onClick={() => handleLayoutChange('carouselStyle')(style)}
                              className={`py-2.5 px-4 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${
                                (layout.carouselStyle || 'auto-scroll') === style
                                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                  : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                              }`}
                            >
                              {style.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <label className="text-gray-400">Display Quantity</label>
                          <span className="text-blue-600 text-sm font-black">{layout.imageCount || images.length || 5}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={layout.imageCount || images.length || 5}
                          onChange={(e) => handleLayoutChange('imageCount')(parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {['hero-image-advanced', 'product-carousel'].includes(section.templateId) && (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Primary CTA</h4>
                      </div>
                      <button
                        onClick={() => handleLayoutChange('showButton')(!layout.showButton)}
                        className={`w-10 h-5 border rounded-full transition-all flex items-center px-1 ${
                          layout.showButton ? 'bg-blue-600 border-blue-500 justify-end' : 'bg-gray-100 border-gray-200 justify-start'
                        }`}
                      >
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </button>
                    </div>
                  )}

                  {layout.showButton && ['hero-image-advanced', 'product-carousel'].includes(section.templateId) && (
                    <div className="grid grid-cols-2 gap-3 mt-2 animate-in zoom-in-95 duration-200">
                      <input
                        type="text"
                        value={layout.buttonLabel || content.ctaText || ''}
                        onChange={(e) => handleLayoutChange('buttonLabel')(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 rounded-lg text-[10px] font-bold outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all shadow-inner"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={layout.buttonHref || ''}
                        onChange={(e) => handleLayoutChange('buttonHref')(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 rounded-lg text-[10px] font-bold outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all shadow-inner"
                        placeholder="Link"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2 text-gray-900 border-none">
                      <Palette className="w-4 h-4 text-blue-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Section Colors</h4>
                    </div>
                    <button
                      onClick={() => handleLayoutChange('gradientEnabled')(!layout.gradientEnabled)}
                      className={`w-10 h-5 border rounded-full transition-all flex items-center px-1 ${
                        layout.gradientEnabled ? 'bg-blue-600 border-blue-500 justify-end' : 'bg-gray-100 border-gray-200 justify-start'
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </button>
                  </div>

                  {layout.gradientEnabled && (
                    <div className="grid grid-cols-2 gap-4 mt-2 animate-in zoom-in-95 duration-200 px-1">
                      <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 shadow-inner">
                        <input
                          type="color"
                          value={layout.gradientStart || themePresets.clean.primaryColor}
                          onChange={(e) => handleLayoutChange('gradientStart')(e.target.value)}
                          className="w-7 h-7 rounded bg-white cursor-pointer border border-white shadow-sm"
                        />
                        <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-tighter">{layout.gradientStart}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 shadow-inner">
                        <input
                          type="color"
                          value={layout.gradientEnd || themePresets.clean.secondaryColor}
                          onChange={(e) => handleLayoutChange('gradientEnd')(e.target.value)}
                          className="w-7 h-7 rounded bg-white cursor-pointer border border-white shadow-sm"
                        />
                        <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-tighter">{layout.gradientEnd}</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer - Fixed Height */}
        <div className="flex-none px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors font-bold text-[10px] tracking-widest"
          >
            DISCARD CHANGES
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Finalize</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
