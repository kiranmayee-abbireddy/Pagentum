import { useState, useEffect } from 'react';
import { X, Layout, Type as TypeIcon, Image as ImageIcon, Palette, Settings2, Trash2, Plus, ArrowRight, Video, Monitor, MousePointer2 } from 'lucide-react';
import { PageSection, SectionLayout, PageImage } from '../types';
import { sectionTemplates } from '../data/templates';
import { themePresets } from '../data/themes';
import { socialIcons } from '../data/socialIcons';

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
  const [introAnimationTab, setIntroAnimationTab] = useState<'text' | 'logo' | 'font' | 'intro' | 'loaders'>('font');
  const template = sectionTemplates.find(t => t.id === section.templateId);

  useEffect(() => {
    setContent(section.content || {});
    setImages(section.images || []);
    setLayout(section.layout || {});
  }, [section]);

  const handleContentChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBg: boolean = false) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    if (isBg) {
      const reader = new FileReader();
      reader.onload = () => {
        handleLayoutChange('backgroundImage')(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
      return;
    }

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
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[650px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
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

        {/* Tab Switcher */}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
          {activeTab === 'content' ? (
            <div className="space-y-8 animate-in slide-in-from-right-2 fade-in duration-300">
              {/* Image Group */}
              {['hero-image-advanced', 'product-carousel', 'navbar-1'].includes(section.templateId) && (
                <section>
                  <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gallery & Assets</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="relative group h-24">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, false)}
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
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Text Content</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                   {Object.entries(template.defaultContent)
                    .filter(([key]) => !key.includes('nav') && !key.includes('link') && !key.includes('social') && !key.includes('Icon')) // Filter out nav/footer/social/icons
                    .map(([key, defaultValue]) => {
                      const isHref = key.toLowerCase().includes('href');
                      return (
                        <div key={key} className={`${(key.includes('Description') || key.includes('quote')) ? 'md:col-span-2' : ''} space-y-1`}>
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                            {isHref && <MousePointer2 className="w-2.5 h-2.5 text-blue-400" />}
                            {key.replace(/([A-Z])/g, ' $1').replace('Href', ' Link').trim()}
                          </label>
                          {key.includes('Description') || key.includes('quote') ? (
                            <textarea
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium text-gray-600 shadow-sm"
                              rows={3}
                              value={content[key] || defaultValue || ''}
                              onChange={handleContentChange(key)}
                            />
                          ) : key.toLowerCase().includes('logosrc') ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                                  {content[key] ? (
                                    <img src={content[key]} alt="Logo Preview" className="w-full h-full object-contain" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 text-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id={`logo-upload-${key}`}
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        const reader = new FileReader();
                                        reader.onload = () => setContent(prev => ({ ...prev, [key]: reader.result as string }));
                                        reader.readAsDataURL(e.target.files[0]);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`logo-upload-${key}`}
                                    className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                                  >
                                    Upload Logo
                                  </label>
                                  {content[key] && (
                                    <button 
                                      onClick={() => setContent(prev => ({ ...prev, [key]: '' }))}
                                      className="ml-2 text-[10px] text-red-400 font-bold uppercase tracking-wider hover:text-red-500"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <input
                              type="text"
                              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm shadow-sm ${isHref ? 'bg-blue-50/30 border-blue-100 font-bold text-blue-600' : 'bg-white border-gray-200 font-bold text-gray-900'}`}
                              value={content[key] || defaultValue || ''}
                              onChange={handleContentChange(key)}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>

              {/* Intro Animations Manager */}
              {section.templateId === 'intro-loader' && (
                <section className="mt-8 border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Settings2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Intro Customizations</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(['font', 'text', 'logo', 'style', 'loaders'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setIntroAnimationTab(tab)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                          introAnimationTab === tab 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {tab === 'text' ? 'Text Animations' :
                         tab === 'logo' ? 'Logo Animations' :
                         tab === 'font' ? 'Fonts' :
                         tab === 'style' ? 'Intro Styles' : 'Loaders'}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {introAnimationTab === 'font' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          { id: 'Abril Fatface', name: 'Abril Fatface' },
                          { id: 'Anton', name: 'Anton' },
                          { id: 'Bangers', name: 'Bangers' },
                          { id: 'Bebas Neue', name: 'Bebas Neue' },
                          { id: 'Berkshire Swash', name: 'Berkshire Swash' },
                          { id: 'Bungee Shade', name: 'Bungee Shade' },
                          { id: 'Cinzel Decorative', name: 'Cinzel Decorative' },
                          { id: 'Creepster', name: 'Creepster' },
                          { id: 'Fredoka One', name: 'Fredoka One' },
                          { id: 'Great Vibes', name: 'Great Vibes' },
                          { id: 'Lobster', name: 'Lobster' },
                          { id: 'Luckiest Guy', name: 'Luckiest Guy' },
                          { id: 'Monoton', name: 'Monoton' },
                          { id: 'Orbitron', name: 'Orbitron' },
                          { id: 'Pacifico', name: 'Pacifico' },
                          { id: 'Permanent Marker', name: 'Permanent Marker' },
                          { id: 'Press Start 2P', name: 'Press Start 2P' },
                          { id: 'Righteous', name: 'Righteous' },
                          { id: 'Russo One', name: 'Russo One' },
                          { id: 'Sacramento', name: 'Sacramento' }
                        ].map(font => (
                          <button
                            key={font.id}
                            onClick={() => handleLayoutChange('introFont')(font.id)}
                            className={`p-3 rounded-xl border-2 text-center transition-all group ${
                              layout.introFont === font.id
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className="h-12 flex items-center justify-center mb-1 bg-gray-50 rounded-lg group-hover:bg-white transition-colors overflow-hidden px-2">
                              <span 
                                className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-gray-900"
                                style={{ fontFamily: font.id }}
                              >
                                {content.siteName || 'Title'}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest block truncate">{font.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {introAnimationTab === 'text' && (
                      <div className="relative">
                        <style>{`
                          @keyframes introTitleIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                          @keyframes textFadeIn { from { opacity: 0; } to { opacity: 1; } }
                          @keyframes textSlideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                          @keyframes textSlideLeft { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                          @keyframes textSlideRight { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                          @keyframes textPopUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                          @keyframes textZoomIn { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                          @keyframes textZoomOut { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                          @keyframes textBlurIn { from { filter: blur(20px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
                          @keyframes textTrackingIn { from { letter-spacing: -0.5em; opacity: 0; } to { letter-spacing: normal; opacity: 1; } }
                          @keyframes textTrackingOut { from { letter-spacing: 0.5em; opacity: 0; } to { letter-spacing: normal; opacity: 1; } }
                          @keyframes textFlip { from { transform: perspective(400px) rotateX(90deg); opacity: 0; } to { transform: perspective(400px) rotateX(0deg); opacity: 1; } }
                          @keyframes textBounce { 0% { transform: translateY(-50px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(-15px); } 90% { transform: translateY(0); } 100% { transform: translateY(0); opacity: 1; } }
                          @keyframes textSpin { from { transform: rotate(-180deg) scale(0.5); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
                          @keyframes textSwing { 0% { transform: rotate(15deg); opacity: 0; } 50% { transform: rotate(-10deg); opacity: 1; } 75% { transform: rotate(5deg); } 100% { transform: rotate(0deg); opacity: 1; } }
                          @keyframes textPulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.05); opacity: 0.8; } }
                          @keyframes textJello { 0%, 11.1%, 100% { transform: translate3d(0,0,0); } 22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); } 33.3% { transform: skewX(6.25deg) skewY(6.25deg); } 44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); } 55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); } 66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); } 77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); } 88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); } }

                          .anim-preview-fix {
                            animation-iteration-count: infinite !important;
                            animation-delay: 0s !important;
                            animation-fill-mode: both !important;
                            padding: 0.2em 0.4em !important;
                            lineHeight: 1 !important;
                            display: inline-block !important;
                          }
                        `}</style>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                          {[
                            { id: 'none', name: 'None' },
                            { id: 'fade', name: 'Fade In' },
                            { id: 'slide-up', name: 'Slide Up' },
                          { id: 'slide-down', name: 'Slide Down' },
                          { id: 'slide-left', name: 'Slide Left' },
                          { id: 'slide-right', name: 'Slide Right' },
                          { id: 'pop', name: 'Pop Up' },
                          { id: 'zoom', name: 'Zoom In' },
                          { id: 'zoom-out', name: 'Zoom Out' },
                          { id: 'blur', name: 'Blur In' },
                          { id: 'tracking', name: 'Expand' },
                          { id: 'tracking-out', name: 'Contract' },
                          { id: 'flip', name: 'Flip' },
                          { id: 'bounce', name: 'Bounce' },
                          { id: 'spin', name: 'Spin' },
                          { id: 'swing', name: 'Swing' },
                          { id: 'pulse', name: 'Pulse' },
                          { id: 'jello', name: 'Jello' }
                        ].map(anim => {
                          const currentAnim = layout.introTextAnimation || 'slide-up';
                          const isSelected = currentAnim === anim.id;
                          
                          // Direct keyframe mapping for reliable preview
                          const keyframeMap: Record<string, string> = {
                            'none': 'none',
                            'fade': 'textFadeIn',
                            'slide-up': 'introTitleIn',
                            'slide-down': 'textSlideDown',
                            'slide-left': 'textSlideLeft',
                            'slide-right': 'textSlideRight',
                            'pop': 'textPopUp',
                            'zoom': 'textZoomIn',
                            'zoom-out': 'textZoomOut',
                            'blur': 'textBlurIn',
                            'tracking': 'textTrackingIn',
                            'tracking-out': 'textTrackingOut',
                            'flip': 'textFlip',
                            'bounce': 'textBounce',
                            'spin': 'textSpin',
                            'swing': 'textSwing',
                            'pulse': 'textPulse',
                            'jello': 'textJello'
                          };

                          return (
                            <button
                              key={anim.id}
                              onClick={() => handleLayoutChange('introTextAnimation')(anim.id)}
                              className={`p-4 rounded-xl border-2 text-center transition-all group ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              }`}
                            >
                              <div className="h-16 flex items-center justify-center mb-1 bg-gray-50/50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                                <span 
                                  className="text-lg font-black anim-preview-fix whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]"
                                  style={{ 
                                    animationName: keyframeMap[anim.id] || 'none',
                                    animationDuration: '2s',
                                    animationIterationCount: 'infinite',
                                    animationTimingFunction: 'ease-in-out',
                                    animationDelay: '0s',
                                    animationFillMode: 'both',
                                    color: layout.textColor || '#3b82f6',
                                    fontFamily: layout.introFont || 'inherit',
                                    display: 'inline-block',
                                    padding: '0.2em 0.4em',
                                    lineHeight: '1.2'
                                  }}
                                >
                                  {content.siteName || 'Title'}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest">{anim.name}</span>
                            </button>
                          );
                        })}
                        </div>
                      </div>
                    )}

                    {introAnimationTab === 'logo' && (
                      <div className="relative">
                        <style>{`
                          @keyframes logoFadeIn { from { opacity: 0; } to { opacity: 1; } }
                          @keyframes logoSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                          @keyframes logoSlideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                          @keyframes logoPopIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                          @keyframes logoZoomIn { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                          @keyframes logoFlipIn { from { transform: perspective(400px) rotateY(90deg); opacity: 0; } to { transform: perspective(400px) rotateY(0deg); opacity: 1; } }
                          @keyframes logoSpinIn { from { transform: rotate(-180deg) scale(0.5); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
                          @keyframes logoBounceIn { 0% { transform: translateY(-50px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(-15px); } 90% { transform: translateY(0); } 100% { transform: translateY(0); opacity: 1; } }
                          @keyframes introLogoIn { from { transform: scale(0) rotate(-45deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
                        `}</style>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                          {[
                            { id: 'none', name: 'None' },
                            { id: 'fade', name: 'Fade In' },
                            { id: 'slide-up', name: 'Slide Up' },
                            { id: 'slide-down', name: 'Slide Down' },
                            { id: 'pop', name: 'Pop In' },
                            { id: 'zoom', name: 'Zoom In' },
                            { id: 'flip', name: 'Flip' },
                            { id: 'spin', name: 'Spin' },
                            { id: 'bounce', name: 'Bounce' },
                            { id: 'rotate-fade', name: 'Rotate Fade' }
                          ].map(anim => {
                            const currentAnim = layout.introLogoAnimation || 'rotate-fade';
                            const isSelected = currentAnim === anim.id;
                            
                            const keyframeMap: Record<string, string> = {
                              'none': 'none',
                              'fade': 'logoFadeIn',
                              'slide-up': 'logoSlideUp',
                              'slide-down': 'logoSlideDown',
                              'pop': 'logoPopIn',
                              'zoom': 'logoZoomIn',
                              'flip': 'logoFlipIn',
                              'spin': 'logoSpinIn',
                              'bounce': 'logoBounceIn',
                              'rotate-fade': 'introLogoIn'
                            };

                            const logoSrc = content.logoSrc || 'https://via.placeholder.com/150?text=LOGO';

                            return (
                              <button
                                key={anim.id}
                                onClick={() => handleLayoutChange('introLogoAnimation')(anim.id)}
                                className={`p-4 rounded-xl border-2 text-center transition-all group ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                              >
                                <div className="h-16 flex items-center justify-center mb-1 bg-gray-50/50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors overflow-hidden">
                                  <img 
                                    src={logoSrc}
                                    alt="Logo Preview"
                                    className="w-10 h-10 object-contain anim-preview-fix"
                                    style={{ 
                                      animationName: keyframeMap[anim.id] || 'none',
                                      animationDuration: '2s',
                                      animationIterationCount: 'infinite',
                                      animationTimingFunction: 'ease-in-out',
                                      animationDelay: '0s',
                                      animationFillMode: 'both'
                                    }}
                                  />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest">{anim.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {introAnimationTab === 'style' && (
                      <div className="relative">
                        <style>{`
                          @keyframes introFadeOut { from { opacity: 1; } to { opacity: 0; } }
                          @keyframes introSlideUp { from { transform: translateY(0); } to { transform: translateY(-100%); } }
                          @keyframes introSlideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
                          @keyframes introSlideLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
                          @keyframes introSlideRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
                          @keyframes introZoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(2); opacity: 0; } }
                          @keyframes introZoomInExit { from { transform: scale(1); opacity: 1; } to { transform: scale(0); opacity: 0; } }
                          @keyframes introBlurOut { from { filter: blur(0); opacity: 1; } to { filter: blur(20px); opacity: 0; } }
                          @keyframes introIrisOut { from { clip-path: circle(100% at 50% 50%); } to { clip-path: circle(0% at 50% 50%); } }
                          @keyframes introWipeOut { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 0 100% 0); } }
                          @keyframes splitTop { from { transform: translateY(0); } to { transform: translateY(-100%); } }
                          @keyframes splitBottom { from { transform: translateY(0); } to { transform: translateY(100%); } }
                          @keyframes splitWobbleTop { 0% { transform: translateY(0); } 20% { transform: translateY(10px); } 40% { transform: translateY(-5px); } 100% { transform: translateY(-100%); } }
                          @keyframes splitWobbleBottom { 0% { transform: translateY(0); } 20% { transform: translateY(-10px); } 40% { transform: translateY(5px); } 100% { transform: translateY(100%); } }

                          .exit-preview-fix {
                            animation-iteration-count: infinite !important;
                            animation-delay: 0.5s !important;
                            animation-duration: 2s !important;
                            animation-fill-mode: both !important;
                          }
                        `}</style>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                          {[
                            { id: 'fade', name: 'Fade Out' },
                            { id: 'slide-up', name: 'Slide Up' },
                            { id: 'slide-down', name: 'Slide Down' },
                            { id: 'slide-left', name: 'Slide Left' },
                            { id: 'slide-right', name: 'Slide Right' },
                            { id: 'zoom-out', name: 'Zoom Out' },
                            { id: 'zoom-in', name: 'Zoom In' },
                            { id: 'blur', name: 'Blur Out' },
                            { id: 'iris', name: 'Iris Wipe' },
                            { id: 'wipe', name: 'Wipe Out' },
                            { id: 'split-straight', name: 'Split Straight' },
                            { id: 'split-zigzag', name: 'Split Zigzag' },
                            { id: 'split-curvy', name: 'Split Curvy' },
                            { id: 'split-wobble', name: 'Split Wobble' }
                          ].map(anim => {
                            const currentAnim = layout.introExitAnimation || 'slide-up';
                            const isSelected = currentAnim === anim.id;
                            
                            const keyframeMap: Record<string, string> = {
                              'fade': 'introFadeOut',
                              'slide-up': 'introSlideUp',
                              'slide-down': 'introSlideDown',
                              'slide-left': 'introSlideLeft',
                              'slide-right': 'introSlideRight',
                              'zoom-out': 'introZoomOut',
                              'zoom-in': 'introZoomInExit',
                              'blur': 'introBlurOut',
                              'iris': 'introIrisOut',
                              'wipe': 'introWipeOut',
                              'split-straight': 'splitTop',
                              'split-zigzag': 'splitTop',
                              'split-curvy': 'splitTop',
                              'split-wobble': 'splitWobbleTop'
                            };

                            const isSplit = anim.id.startsWith('split');

                            return (
                              <button
                                key={anim.id}
                                onClick={() => handleLayoutChange('introExitAnimation')(anim.id)}
                                className={`p-4 rounded-xl border-2 text-center transition-all group ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                              >
                                <div className="h-16 relative bg-gray-100 rounded-lg border border-gray-100 overflow-hidden mb-1">
                                  {/* Mock Page Content Behind */}
                                  <div className="absolute inset-0 p-2 flex flex-col gap-1">
                                    <div className="w-full h-2 bg-blue-200 rounded-full"></div>
                                    <div className="w-2/3 h-1.5 bg-gray-200 rounded-full"></div>
                                    <div className="w-1/2 h-1.5 bg-gray-200 rounded-full"></div>
                                  </div>
                                  
                                  {isSplit ? (
                                    <>
                                      <div 
                                        className="absolute inset-0 bg-blue-600 z-10 exit-preview-fix"
                                        style={{ 
                                          animationName: anim.id === 'split-wobble' ? 'splitWobbleTop' : 'splitTop',
                                          clipPath: anim.id === 'split-straight' || anim.id === 'split-wobble' ? 'inset(0 0 50% 0)' : 
                                                   anim.id === 'split-zigzag' ? 'polygon(0 0, 100% 0, 100% 50%, 80% 45%, 60% 55%, 40% 45%, 20% 55%, 0 50%)' :
                                                   'polygon(0 0, 100% 0, 100% 50%, 85% 40%, 70% 55%, 50% 45%, 30% 60%, 15% 45%, 0 55%)'
                                        }}
                                      ></div>
                                      <div 
                                        className="absolute inset-0 bg-blue-600 z-10 exit-preview-fix"
                                        style={{ 
                                          animationName: anim.id === 'split-wobble' ? 'splitWobbleBottom' : 'splitBottom',
                                          clipPath: anim.id === 'split-straight' || anim.id === 'split-wobble' ? 'inset(50% 0 0 0)' : 
                                                   anim.id === 'split-zigzag' ? 'polygon(0 50%, 20% 55%, 40% 45%, 60% 55%, 80% 45%, 100% 50%, 100% 100%, 0 100%)' :
                                                   'polygon(0 55%, 15% 45%, 30% 60%, 50% 45%, 70% 55%, 85% 40%, 100% 50%, 100% 100%, 0 100%)'
                                        }}
                                      ></div>
                                    </>
                                  ) : (
                                    <div 
                                      className="absolute inset-0 bg-blue-600 z-10 flex items-center justify-center exit-preview-fix"
                                      style={{ 
                                        animationName: keyframeMap[anim.id] || 'none'
                                      }}
                                    >
                                      <div className="w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                                    </div>
                                  )}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest">{anim.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {introAnimationTab === 'loaders' && (
                      <div className="relative">
                        <style>{`
                          @keyframes introProgress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
                          @keyframes introCircleProgress { 0% { stroke-dashoffset: 283; } 100% { stroke-dashoffset: 0; } }
                          @keyframes introSpinner { to { transform: rotate(360deg); } }
                          @keyframes introDots { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                          @keyframes heartFillAnim { 0% { background-size: 100% 0%; } 100% { background-size: 100% 100%; } }
                          
                          .loader-preview-box {
                            height: 64px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #f8fafc;
                            border-radius: 12px;
                            border: 1px solid #f1f5f9;
                            margin-bottom: 8px;
                            position: relative;
                            overflow: hidden;
                          }
                        `}</style>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                          {[
                            { id: 'bar-classic', name: 'Classic Bar' },
                            { id: 'bar-gradient', name: 'Gradient Bar' },
                            { id: 'bar-pulsing', name: 'Pulsing Bar' },
                            { id: 'circle-thin', name: 'Circle Thin' },
                            { id: 'circle-thick', name: 'Circle Thick' },
                            { id: 'circle-dashed', name: 'Circle Dash' },
                            { id: 'dots-bounce', name: 'Dots Bounce' },
                            { id: 'spinner-classic', name: 'Spinner' },
                            { id: 'heart-fill', name: 'Heart Fill' },
                            { id: 'none', name: 'No Loader' }
                          ].map(loader => {
                            const currentLoader = layout.introLoaderStyle || 'bar-classic';
                            const isSelected = currentLoader === loader.id;
                            
                            return (
                              <button
                                key={loader.id}
                                onClick={() => handleLayoutChange('introLoaderStyle')(loader.id)}
                                className={`p-4 rounded-xl border-2 text-center transition-all group ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                              >
                                <div className="loader-preview-box">
                                  {loader.id.startsWith('bar') && (
                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-600 origin-left"
                                        style={{ 
                                          animation: 'introProgress 2s infinite ease-in-out',
                                          background: loader.id === 'bar-gradient' ? 'linear-gradient(90deg, #3b82f6, #6366f1)' : '#3b82f6'
                                        }}
                                      ></div>
                                    </div>
                                  )}
                                  {loader.id.startsWith('circle') && (
                                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="45" stroke="#e2e8f0" strokeWidth={loader.id === 'circle-thick' ? "4" : "1.5"} fill="none" />
                                      <circle 
                                        cx="50" cy="50" r="45" 
                                        stroke="#3b82f6" 
                                        strokeWidth={loader.id === 'circle-thick' ? "4" : "1.5"} 
                                        fill="none" 
                                        strokeDasharray="283"
                                        strokeDashoffset="283"
                                        strokeLinecap="round"
                                        style={{ 
                                          animation: 'introCircleProgress 2s infinite ease-in-out',
                                          strokeDasharray: loader.id === 'circle-dashed' ? '8 4' : '283'
                                        }}
                                      />
                                    </svg>
                                  )}
                                  {loader.id === 'dots-bounce' && (
                                    <div className="flex gap-1.5">
                                      {[0, 1, 2].map(i => (
                                        <div 
                                          key={i}
                                          className="w-2.5 h-2.5 bg-blue-600 rounded-full"
                                          style={{ animation: `introDots 0.6s infinite alternate ${i * 0.15}s` }}
                                        ></div>
                                      ))}
                                    </div>
                                  )}
                                  {loader.id === 'spinner-classic' && (
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                  )}
                                  {loader.id === 'heart-fill' && (
                                    <div 
                                      className="w-8 h-8 bg-gray-200"
                                      style={{
                                        WebkitMask: `
                                          radial-gradient(circle at 60% 65%, #000 64%, #0000 65%) top left, 
                                          radial-gradient(circle at 40% 65%, #000 64%, #0000 65%) top right, 
                                          linear-gradient(to bottom left, #000 43%,#0000 44%) bottom left , 
                                          linear-gradient(to bottom right,#000 43%,#0000 44%) bottom right`,
                                        WebkitMaskSize: '51% 51%',
                                        WebkitMaskRepeat: 'no-repeat',
                                        background: `linear-gradient(#3b82f6 0 0) bottom/100% 0% no-repeat #ccc`,
                                        animation: 'heartFillAnim 2s infinite linear'
                                      }}
                                    ></div>
                                  )}
                                  {loader.id === 'none' && <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">None</span>}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest">{loader.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {(introAnimationTab !== 'font' && introAnimationTab !== 'text' && introAnimationTab !== 'logo' && introAnimationTab !== 'style' && introAnimationTab !== 'loaders') && (
                      <div className="py-12 text-center">
                        <Palette className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Templates Coming Soon</p>
                        <p className="text-[9px] text-gray-400 mt-1">We will add these animations one by one</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Social Links Manager */}
              {section.templateId === 'footer-advanced' && (
                <section>
                   <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Social Presence</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => {
                      const linkKey = `social${i}Link`;
                      const typeKey = `social${i}Type`;
                      
                      // Show if it has content, or if it's one of the first 4, or if the previous one has content
                      const isVisible = i <= 4 || !!content[linkKey] || (i > 4 && !!content[`social${i-1}Link`]);
                      if (!isVisible) return null;

                      return (
                        <SocialItem 
                          key={i} 
                          index={i} 
                          content={content} 
                          setContent={setContent} 
                          handleContentChange={handleContentChange} 
                        />
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Custom Links Manager */}
              {/* Features Icon Picker */}
              {section.templateId === 'features-3col' && (
                <section>
                   <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <MousePointer2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Feature Icons</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <FeatureIconPicker 
                        key={i}
                        index={i}
                        content={content}
                        setContent={setContent}
                      />
                    ))}
                  </div>
                </section>
              )}

              {['navbar-1', 'footer-1'].includes(section.templateId) && (
                <section>
                   <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <MousePointer2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Additional Links</h3>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(i => {
                      const prefix = section.templateId === 'navbar-1' ? 'nav' : 'link';
                      const labelKey = section.templateId === 'navbar-1' ? `${prefix}${i}Label` : `link${i}`;
                      const hrefKey = section.templateId === 'navbar-1' ? `${prefix}${i}Href` : `link${i}Href`;
                      
                      const isActive = !!content[labelKey];
                      if (!isActive && i > 1 && !content[`${prefix}${i-1}Label`] && !content[`link${i-1}`]) return null;

                      return (
                        <div key={i} className="flex flex-col space-y-2 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Link {i}</span>
                            {isActive && (
                              <button 
                                onClick={() => setContent(prev => ({ ...prev, [labelKey]: '', [hrefKey]: '#' }))}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Label (e.g. Help)"
                              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold focus:border-blue-400 outline-none"
                              value={content[labelKey] || ''}
                              onChange={handleContentChange(labelKey)}
                            />
                            <input
                              type="text"
                              placeholder="Link (e.g. #support)"
                              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold focus:border-blue-400 outline-none"
                              value={content[hrefKey] || ''}
                              onChange={handleContentChange(hrefKey)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Product Entries */}
              {section.templateId === 'product-carousel' && images.length > 0 && (
                <section>
                  <div className="flex items-center space-x-2 mb-4 border-b pb-2">
                    <Layout className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Product Catalog</h3>
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
              {/* Portfolio Entries */}
              {section.templateId === 'portfolio-grid' && (
                <section>
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <Layout className="w-4 h-4 text-gray-400" />
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Portfolio Projects</h3>
                    </div>
                    <button
                      onClick={() => {
                        const count = parseInt(content.projectCount || '0') + 1;
                        setContent(prev => ({ ...prev, projectCount: count.toString() }));
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase">Add Project</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {Array.from({ length: parseInt(content.projectCount || '0') }).map((_, idx) => {
                      const num = idx + 1;
                      return (
                        <div key={num} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors shadow-sm relative group/item">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center font-bold text-[10px]">{num.toString().padStart(2, '0')}</span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Project Specification</span>
                            </div>
                            <button
                              onClick={() => {
                                const newContent = { ...content };
                                // Shift items up to fill gap
                                const count = parseInt(content.projectCount || '0');
                                for (let i = num; i < count; i++) {
                                  newContent[`proj${i}Title`] = newContent[`proj${i+1}Title`];
                                  newContent[`proj${i}Desc`] = newContent[`proj${i+1}Desc`];
                                  newContent[`proj${i}Link`] = newContent[`proj${i+1}Link`];
                                  newContent[`proj${i}Thumb`] = newContent[`proj${i+1}Thumb`];
                                }
                                delete newContent[`proj${count}Title`];
                                delete newContent[`proj${count}Desc`];
                                delete newContent[`proj${count}Link`];
                                delete newContent[`proj${count}Thumb`];
                                newContent.projectCount = (count - 1).toString();
                                setContent(newContent);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/item:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                            <div className="flex gap-3 items-start">
                              <div className="flex-none w-20 h-20 relative group/thumb overflow-hidden rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                                {content[`proj${num}Thumb`] ? (
                                  <img src={content[`proj${num}Thumb`]} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-1">
                                    <ImageIcon className="w-4 h-4 text-gray-300" />
                                    <span className="text-[6px] font-bold text-gray-400">NO THUMB</span>
                                  </div>
                                )}
                                <label className="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      if (!e.target.files?.[0]) return;
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setContent(prev => ({ ...prev, [`proj${num}Thumb`]: reader.result as string }));
                                      };
                                      reader.readAsDataURL(e.target.files[0]);
                                    }}
                                  />
                                  <Plus className="w-4 h-4 text-white" />
                                </label>
                                {content[`proj${num}Thumb`] && (
                                  <button 
                                    onClick={() => setContent(prev => ({ ...prev, [`proj${num}Thumb`]: '' }))}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <input
                                  type="text"
                                  placeholder="Project Title"
                                  value={content[`proj${num}Title`] || ''}
                                  onChange={handleContentChange(`proj${num}Title`)}
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:border-blue-300 outline-none shadow-sm"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-none flex items-center px-2 bg-gray-100 rounded-lg">
                                    <MousePointer2 className="w-3 h-3 text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Live Link (e.g. https://...)"
                                    value={content[`proj${num}Link`] || ''}
                                    onChange={handleContentChange(`proj${num}Link`)}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-blue-600 focus:border-blue-300 outline-none shadow-sm"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <textarea
                              rows={2}
                              placeholder="Describe the project achievements or details..."
                              value={content[`proj${num}Desc`] || ''}
                              onChange={handleContentChange(`proj${num}Desc`)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-500 focus:border-blue-300 outline-none shadow-sm"
                            />
                          </div>
                        </div>
                      );
                    })}

                    {parseInt(content.projectCount || '0') === 0 && (
                      <div className="py-12 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Layout className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Projects Added</p>
                        <p className="text-[9px] text-gray-400 mt-1">Click the "Add Project" button to start your showcase</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left-2 fade-in duration-300 pb-4">
              {/* Main Layout Group */}
              <section className="space-y-6">
              {['hero-image-advanced', 'video-section'].includes(section.templateId) && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Layout Alignment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {section.templateId === 'video-section' ? (
                      ['video-left', 'video-right', 'video-center'].map(v => (
                        <button
                          key={v}
                          onClick={() => handleLayoutChange('variant')(v)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                            (layout.variant || 'video-right') === v
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-50' 
                              : 'border-gray-100 bg-white text-gray-300 hover:border-gray-200'
                          }`}
                        >
                           <Video className="w-4 h-4" />
                           <span className="text-[8px] font-black uppercase tracking-widest">{v.split('-')[1]}</span>
                        </button>
                      ))
                    ) : (
                      ['image-left', 'image-right'].map(v => (
                        <button
                          key={v}
                          onClick={() => handleLayoutChange('variant')(v)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                            (layout.variant || 'image-right') === v
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-50' 
                              : 'border-gray-100 bg-white text-gray-300 hover:border-gray-200'
                          }`}
                        >
                           <Layout className="w-4 h-4" />
                           <span className="text-[8px] font-black uppercase tracking-widest">{v.split('-')[1]}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

                <div className="p-5 bg-white rounded-xl border border-gray-100 space-y-6 shadow-sm">
                  {/* Background Mode Selector */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Background Surface</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                       {['plain', 'gradient', 'image', 'video'].map(type => (
                         <button
                           key={type}
                           onClick={() => handleLayoutChange('backgroundType')(type)}
                           className={`py-2 rounded-lg border transition-all text-[9px] font-black uppercase tracking-tighter ${
                             (layout.backgroundType || 'plain') === type
                               ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                               : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Section Colors */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[9px] font-bold text-gray-400 uppercase">Background</label>
                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                           <input
                             type="color"
                             value={layout.backgroundColor || themePresets.clean.backgroundColor}
                             onChange={(e) => handleLayoutChange('backgroundColor')(e.target.value)}
                             className="w-7 h-7 rounded-md bg-white cursor-pointer border border-white"
                           />
                           <span className="text-[9px] font-black font-mono text-gray-500">{(layout.backgroundColor || themePresets.clean.backgroundColor).toUpperCase()}</span>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-bold text-gray-400 uppercase">Text Color</label>
                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                           <input
                             type="color"
                             value={layout.textColor || themePresets.clean.textColor}
                             onChange={(e) => handleLayoutChange('textColor')(e.target.value)}
                             className="w-7 h-7 rounded-md bg-white cursor-pointer border border-white"
                           />
                           <span className="text-[9px] font-black font-mono text-gray-500">{(layout.textColor || themePresets.clean.textColor).toUpperCase()}</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Gradient Specifics */}
                  {layout.backgroundType === 'gradient' && (
                    <div className="space-y-6 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-gray-400 uppercase">Start Color</label>
                           <input
                             type="color"
                             value={layout.gradientStart || themePresets.clean.primaryColor}
                             onChange={(e) => handleLayoutChange('gradientStart')(e.target.value)}
                             className="w-full h-8 rounded-lg cursor-pointer"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-gray-400 uppercase">End Color</label>
                           <input
                             type="color"
                             value={layout.gradientEnd || themePresets.clean.secondaryColor}
                             onChange={(e) => handleLayoutChange('gradientEnd')(e.target.value)}
                             className="w-full h-8 rounded-lg cursor-pointer"
                           />
                        </div>
                      </div>
                      
                      <div className="space-y-4 px-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                           <label className="flex items-center space-x-1"><Monitor className="w-3 h-3" /> <span>Angle</span></label>
                           <span className="text-blue-600">{layout.gradientDirection || '135'} deg</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={layout.gradientDirection || '135'}
                          onChange={(e) => handleLayoutChange('gradientDirection')(e.target.value)}
                          className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div className="space-y-4 px-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                           <label className="flex items-center space-x-1"><Palette className="w-3 h-3" /> <span>Intensity</span></label>
                           <span className="text-blue-600">{layout.gradientDomination || 50} %</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={layout.gradientDomination || 50}
                          onChange={(e) => handleLayoutChange('gradientDomination')(parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Media Specifics */}
                  {(layout.backgroundType === 'image' || layout.backgroundType === 'video') && (
                    <div className="space-y-6 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                       {layout.backgroundType === 'image' ? (
                         <div className="space-y-3">
                           <label className="text-[9px] font-bold text-gray-400 uppercase">Background Image</label>
                           <div className="relative">
                             <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="hidden" id="bg-upload" />
                             <label htmlFor="bg-upload" className="flex items-center p-3 border border-gray-100 bg-gray-50 rounded-xl hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                               <ImageIcon className="w-4 h-4 text-gray-400 mr-2" />
                               <span className="text-[10px] font-bold text-gray-600">{layout.backgroundImage ? 'Change Image...' : 'Click to Upload Image'}</span>
                               {layout.backgroundImage && <div className="ml-auto w-6 h-6 rounded border bg-white"><img src={layout.backgroundImage} className="w-full h-full object-cover" /></div>}
                             </label>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-3">
                           <label className="text-[9px] font-bold text-gray-400 uppercase">Background Video URL</label>
                           <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100 focus-within:bg-white focus-within:border-blue-300 transition-all">
                             <Video className="w-4 h-4 text-gray-400 ml-3" />
                             <input
                               type="text"
                               placeholder="https://..."
                               value={layout.backgroundVideo || ''}
                               onChange={(e) => handleLayoutChange('backgroundVideo')(e.target.value)}
                               className="flex-1 p-2 bg-transparent outline-none text-[10px] font-bold text-gray-700"
                             />
                           </div>
                         </div>
                       )}

                       <div className="space-y-4 px-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                           <label className="flex items-center space-x-1"><MousePointer2 className="w-3 h-3" /> <span>Overlay Opacity</span></label>
                           <span className="text-blue-600">{layout.overlayOpacity || 30} %</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={layout.overlayOpacity || 30}
                          onChange={(e) => handleLayoutChange('overlayOpacity')(parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[7px] text-gray-300 font-bold uppercase text-center mt-1">Increases readability of text over media</p>
                      </div>
                    </div>
                  )}

                  {/* Carousel Specifics */}
                  {section.templateId === 'product-carousel' && (
                    <div className="space-y-6 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carousel Style</label>
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

                      <div className="space-y-4 px-1">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <label className="text-gray-400">Items Quantity</label>
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
                    <>
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

                      {layout.showButton && (
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
                    </>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors font-bold text-[10px] tracking-widest uppercase"
          >
            Abort
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

function FeatureIconPicker({ index, content, setContent }: { index: number, content: any, setContent: any }) {
  const [showPicker, setShowPicker] = useState(false);
  const iconKey = `feature${index}Icon`;
  const currentIcon = content[iconKey] || 'zap';
  
  const icons = [
    { id: 'zap', label: 'Lightning', path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'palette', label: 'Design', path: 'M12 21a9 9 0 110-18 9 9 0 010 18z M12 7a5 5 0 100 10 5 5 0 000-10z' },
    { id: 'rocket', label: 'Launch', path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.71-2.13l.12-.13a8.48 8.48 0 016.3-6.3l.13-.12s1.29 0 2.13-.71c1.5-1.26 2-5 2-5s-3.74.5-5 2c-.71.84-.71 2.13-.71 2.13l-.12.13a8.48 8.48 0 01-6.3 6.3l-.13.12s-1.29 0-2.13.71z' },
    { id: 'shield', label: 'Security', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'clock', label: 'Speed', path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'globe', label: 'Global', path: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 21V3 M21 12H3' },
    { id: 'monitor', label: 'Desktop', path: 'M2 3h20v14H2V3zm6 18h8m-4-4v4' },
    { id: 'mouse', label: 'Click', path: 'M12 2a5 5 0 00-5 5v10a5 5 0 0010 0V7a5 5 0 00-5-5z M12 7V5' },
    { id: 'star', label: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'heart', label: 'Loved', path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' },
    { id: 'coffee', label: 'Energy', path: 'M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3' },
    { id: 'code', label: 'Code', path: 'M16 18l6-6-6-6 M8 6l-6 6 6 6' },
    { id: 'database', label: 'Data', path: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5 M3 5c0 1.66 4 3 9 3s9-1.34 9-3 M3 5c0-1.66 4-3 9-3s9 1.34 9 3 M3 12c0 1.66 4 3 9 3s9-1.34 9-3' },
    { id: 'cpu', label: 'Logic', path: 'M4 4h16v16H4V4z M9 9h6v6H9V9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 15h3 M1 9h3 M1 15h3' },
    { id: 'layers', label: 'Stack', path: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' }
  ];

  return (
    <div className="relative">
      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-2">Icon {index}</label>
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-blue-300 transition-all group"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform">
          <path d={icons.find(i => i.id === currentIcon)?.path || icons[0].path}></path>
        </svg>
      </button>

      {showPicker && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-4 gap-2 min-w-[180px] animate-in fade-in zoom-in duration-200">
          {icons.map(icon => (
            <button
              key={icon.id}
              onClick={() => {
                setContent((prev: any) => ({ ...prev, [iconKey]: icon.id }));
                setShowPicker(false);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-blue-50 ${currentIcon === icon.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}
              title={icon.label}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d={icon.path}></path>
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialItem({ index, content, setContent, handleContentChange }: { 
  index: number, 
  content: any, 
  setContent: any, 
  handleContentChange: any 
}) {
  const [showPicker, setShowPicker] = useState(false);
  const typeKey = `social${index}Type`;
  const linkKey = `social${index}Link`;
  const currentType = content[typeKey] || 'facebook';
  const currentIcon = socialIcons.find(i => i.id === currentType) || socialIcons[0];

  return (
    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Social Link {index}</span>
        <div className="flex items-center space-x-2">
          {content[linkKey] && (
            <button 
              onClick={() => setContent((prev: any) => ({ ...prev, [linkKey]: '', [typeKey]: 'facebook' }))}
              className="p-1.5 text-red-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button 
            onClick={() => setShowPicker(!showPicker)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110 active:scale-95"
            style={{ 
              background: currentIcon.color,
              color: 'white'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d={currentIcon.path} />
            </svg>
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-5 gap-2 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-48">
          {socialIcons.map(icon => (
            <button
              key={icon.id}
              onClick={() => {
                setContent((prev: any) => ({ ...prev, [typeKey]: icon.id }));
                setShowPicker(false);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 ${currentType === icon.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-40 hover:opacity-100'}`}
              style={{ 
                background: icon.color,
                color: 'white'
              }}
              title={icon.name}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d={icon.path} />
              </svg>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded-lg">
          <span className="text-[10px] font-black text-gray-400 uppercase min-w-[60px]">{currentIcon.name}</span>
          <input
            type="text"
            placeholder="Profile URL"
            className="flex-1 bg-transparent text-[10px] font-bold outline-none"
            value={content[linkKey] || ''}
            onChange={handleContentChange(linkKey)}
          />
        </div>
      </div>
    </div>
  );
}
