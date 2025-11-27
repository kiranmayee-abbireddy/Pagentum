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
    Object.entries(section.content).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
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
              className={`relative group mb-4 transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onEditSection(section)}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50"
                  title="Edit section"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="border-2 border-dashed border-transparent group-hover:border-blue-400 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {template?.name}
                  </span>
                </div>
                {renderSection(section)}
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
