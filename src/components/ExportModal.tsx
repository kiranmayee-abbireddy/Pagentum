import { useState } from 'react';
import { X, Download, FileText, Code, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageSection, ThemeConfig } from '../types';
import { generateHTML, generateStandaloneHTML, downloadFile, generateCSS } from '../utils/export';
import AlertDialog from './AlertDialog';

interface ExportModalProps {
  sections: PageSection[];
  theme: ThemeConfig;
  onClose: () => void;
}

export default function ExportModal({ sections, theme, onClose }: ExportModalProps) {
  const [alertConfig, setAlertConfig] = useState<{title: string, message: string, type: 'success'} | null>(null);

  const handleExportSeparate = () => {
    const html = generateHTML(sections, theme);
    const css = generateCSS(theme);

    downloadFile('index.html', html);
    setTimeout(() => downloadFile('style.css', css), 100);

    setAlertConfig({
      title: 'Export Successful',
      message: 'Files downloaded! You now have index.html and style.css. Place them in the same folder and open index.html.',
      type: 'success'
    });
  };

  const handleExportStandalone = () => {
    const html = generateStandaloneHTML(sections, theme);
    downloadFile('page.html', html);
    setAlertConfig({
      title: 'Export Successful',
      message: 'Single HTML file downloaded! Open it directly in any browser.',
      type: 'success'
    });
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

          <button
            onClick={() => {
              const projectData = {
                id: `project-${Date.now()}`,
                name: 'My Exported Page',
                sections,
                theme,
                createdAt: Date.now(),
                updatedAt: Date.now()
              };
              downloadFile('project.json', JSON.stringify(projectData, null, 2));
              setAlertConfig({
                title: 'Export Successful',
                message: 'Project JSON downloaded! You can re-import this file later using the Import button.',
                type: 'success'
              });
            }}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-yellow-50 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <Download className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Project Data (JSON)
                </h3>
                <p className="text-sm text-gray-600">
                  Save your work-in-progress. Import this file later to continue editing.
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600 font-medium">
                  <Download className="w-4 h-4" />
                  Download project.json
                </div>
              </div>
            </div>
          </button>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">What's included in your export?</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Clean, production-ready code',
                'Fully responsive layout',
                'Zero external dependencies',
                'Works perfectly offline'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-xl border border-white/80">
                  <div className="p-1 bg-white rounded-full shadow-sm border border-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {alertConfig && (
        <AlertDialog
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={() => setAlertConfig(null)}
        />
      )}
    </div>
  );
}
