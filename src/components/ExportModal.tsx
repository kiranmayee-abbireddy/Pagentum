import { X, Download, FileText, Code } from 'lucide-react';
import { PageSection, ThemeConfig } from '../types';
import { generateHTML, generateStandaloneHTML, downloadFile, generateCSS } from '../utils/export';

interface ExportModalProps {
  sections: PageSection[];
  theme: ThemeConfig;
  onClose: () => void;
}

export default function ExportModal({ sections, theme, onClose }: ExportModalProps) {
  const handleExportSeparate = () => {
    const html = generateHTML(sections, theme);
    const css = generateCSS(theme);

    downloadFile('index.html', html);
    setTimeout(() => downloadFile('style.css', css), 100);

    alert('Files downloaded! You now have:\n\n1. index.html\n2. style.css\n\nPlace them in the same folder and open index.html.');
  };

  const handleExportStandalone = () => {
    const html = generateStandaloneHTML(sections, theme);
    downloadFile('page.html', html);
    alert('Single HTML file downloaded! Open it directly in any browser.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Export Your Page</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={handleExportStandalone}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Single HTML File
                </h3>
                <p className="text-sm text-gray-600">
                  All-in-one file with inline CSS. Perfect for quick sharing or prototypes.
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Download className="w-4 h-4" />
                  Download page.html
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportSeparate}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Separate HTML + CSS Files
                </h3>
                <p className="text-sm text-gray-600">
                  Clean separation for production use. Easier to customize and maintain.
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-medium">
                  <Download className="w-4 h-4" />
                  Download index.html + style.css
                </div>
              </div>
            </div>
          </button>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Export Info</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Clean, production-ready HTML and CSS</li>
              <li>✓ Fully responsive design included</li>
              <li>✓ No external dependencies</li>
              <li>✓ Works offline after download</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
