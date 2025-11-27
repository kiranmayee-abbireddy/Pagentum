import { useState } from 'react';
import { X } from 'lucide-react';
import { PageSection } from '../types';
import { sectionTemplates } from '../data/templates';

interface EditModalProps {
  section: PageSection;
  onSave: (section: PageSection) => void;
  onClose: () => void;
}

export default function EditModal({ section, onSave, onClose }: EditModalProps) {
  const [content, setContent] = useState(section.content);
  const template = sectionTemplates.find(t => t.id === section.templateId);

  if (!template) return null;

  const handleSave = () => {
    onSave({ ...section, content });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit {template.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.keys(template.defaultContent).map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {content[key] && content[key].length > 50 ? (
                <textarea
                  value={content[key]}
                  onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={content[key]}
                  onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
