import { X } from 'lucide-react';
import { PageSection, ThemeConfig } from '../types';
import { generateStandaloneHTML } from '../utils/export';
import { useEffect, useState } from 'react';

interface PreviewModalProps {
  sections: PageSection[];
  theme: ThemeConfig;
  onClose: () => void;
}

export default function PreviewModal({ sections, theme, onClose }: PreviewModalProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const html = generateStandaloneHTML(sections, theme);
    setHtmlContent(html);
  }, [sections, theme]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
          Close Preview
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          title="Page Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
