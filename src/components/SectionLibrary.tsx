import { Plus } from 'lucide-react';
import { sectionTemplates } from '../data/templates';

interface SectionLibraryProps {
  onAddSection: (templateId: string) => void;
}

export default function SectionLibrary({ onAddSection }: SectionLibraryProps) {
  const categories = Array.from(new Set(sectionTemplates.map(t => t.category)));

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50/30 via-white to-blue-50/30 backdrop-blur-xl overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">Section Library</h2>
        <p className="text-sm text-gray-500 mt-1">Drag or click to add</p>
      </div>

      <div className="p-4 space-y-6">
        {categories.map(category => {
          const categoryTemplates = sectionTemplates.filter(t => t.category === category);

          return (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {categoryTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => onAddSection(template.id)}
                    className="w-full text-left p-3 hover:bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div className="flex-1 flex items-center justify-center bg-transparent">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-700">
                          {template.name}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
