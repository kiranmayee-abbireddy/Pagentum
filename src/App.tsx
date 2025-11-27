import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import InputBar from './components/InputBar';
import SectionLibrary from './components/SectionLibrary';
import Canvas from './components/Canvas';
import EditModal from './components/EditModal';
import ThemeSelector from './components/ThemeSelector';
import ExportModal from './components/ExportModal';
import PreviewModal from './components/PreviewModal';
import { PageSection, Project, ThemeConfig } from './types';
import { themePresets } from './data/themes';
import { sectionTemplates } from './data/templates';
import { parseInputToSections } from './utils/parser';
import { saveProject, loadProject, importProjectJSON } from './utils/storage';

function App() {
  const [project, setProject] = useState<Project>({
    id: `project-${Date.now()}`,
    name: 'My Page',
    sections: [],
    theme: themePresets.clean,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const savedProject = loadProject();
    if (savedProject) {
      setProject(savedProject);
    }
  }, []);

  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({
      ...prev,
      ...updates,
      updatedAt: Date.now()
    }));
  };

  const handleGenerate = (input: string) => {
    const newSections = parseInputToSections(input);
    if (newSections.length > 0) {
      updateProject({
        sections: [...project.sections, ...newSections]
      });
    }
  };

  const handleAddSection = (templateId: string) => {
    const template = sectionTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      templateId: template.id,
      order: project.sections.length,
      content: { ...template.defaultContent }
    };

    updateProject({
      sections: [...project.sections, newSection]
    });
  };

  const handleSectionsChange = (sections: PageSection[]) => {
    updateProject({ sections });
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
  };

  const handleSaveEdit = (updatedSection: PageSection) => {
    updateProject({
      sections: project.sections.map(s =>
        s.id === updatedSection.id ? updatedSection : s
      )
    });
  };

  const handleThemeChange = (theme: ThemeConfig) => {
    updateProject({ theme });
  };

  const handleSave = () => {
    try {
      saveProject(project);
      alert('Project saved successfully!');
    } catch (error) {
      alert('Failed to save project. Please try exporting as JSON instead.');
    }
  };

  const handleImport = async (file: File) => {
    try {
      const importedProject = await importProjectJSON(file);
      setProject({
        ...importedProject,
        id: `project-${Date.now()}`,
        updatedAt: Date.now()
      });
      alert('Project imported successfully!');
    } catch (error) {
      alert('Failed to import project. Please check the file format.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar
        onThemeClick={() => setShowThemeSelector(true)}
        onPreviewClick={() => setShowPreview(!showPreview)}
        onExportClick={() => setShowExportModal(true)}
        onSaveClick={handleSave}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
        isPreviewMode={showPreview}
      />

      {!showPreview && <InputBar onGenerate={handleGenerate} onImport={handleImport} />}

      <div className="flex-1 flex overflow-hidden">
        {!showPreview && (
          <SectionLibrary onAddSection={handleAddSection} />
        )}

        <Canvas
          sections={project.sections}
          onSectionsChange={handleSectionsChange}
          onEditSection={handleEditSection}
          showGrid={showGrid}
        />
      </div>

      {editingSection && (
        <EditModal
          section={editingSection}
          onSave={handleSaveEdit}
          onClose={() => setEditingSection(null)}
        />
      )}

      {showThemeSelector && (
        <ThemeSelector
          currentTheme={project.theme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          sections={project.sections}
          theme={project.theme}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showPreview && (
        <PreviewModal
          sections={project.sections}
          theme={project.theme}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export default App;
