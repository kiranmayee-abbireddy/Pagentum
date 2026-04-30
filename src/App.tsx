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
import ProjectsModal from './components/ProjectsModal';

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
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  useEffect(() => {
    loadProject().then(savedProject => {
      if (savedProject) {
        setProject(savedProject);
      }
    });
  }, []);

  const handleLoadProject = async (id: string) => {
    const loaded = await loadProject(id);
    if (loaded) {
      setProject(loaded);
      setShowProjectsModal(false);
    }
  };

  const handleRenameProject = async (id: string, newName: string) => {
    if (project.id === id) {
      const updated = { ...project, name: newName, updatedAt: Date.now() };
      setProject(updated);
      await saveProject(updated);
    } else {
      const target = await loadProject(id);
      if (target) {
        target.name = newName;
        target.updatedAt = Date.now();
        await saveProject(target);
      }
    }
  };

  const handleNewProject = async () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'New Page',
      sections: [],
      theme: themePresets.clean,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProject(newProject);
    await saveProject(newProject);
    setShowProjectsModal(false);
  };

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

  const handleSave = async () => {
    try {
      await saveProject(project);
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

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] via-white to-blue-50/50">
      <div className="bg-white/80 backdrop-blur-md border-b border-white/40">
        <TopBar
          onThemeClick={() => setShowThemeSelector(true)}
          onPreviewClick={() => setShowPreview(!showPreview)}
          onExportClick={() => setShowExportModal(true)}
          onSaveClick={handleSave}
          onProjectsClick={() => setShowProjectsModal(true)}
          isPreviewMode={showPreview}
          isHeaderCollapsed={isHeaderCollapsed}
          onCollapseToggle={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        />

        {!showPreview && (
          <div className={`bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/40 overflow-hidden transition-all duration-500 ease-in-out ${isHeaderCollapsed ? 'max-h-0' : 'max-h-[500px]'
            }`}>
            <div className="max-w-5xl mx-auto w-full px-6 py-12">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-8">
                Design with <span className="text-blue-600">Magic.</span>
              </h2>
              <InputBar onGenerate={handleGenerate} onImport={handleImport} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-white/40 backdrop-blur-xl border-r border-white/20 overflow-y-auto">
          {!showPreview && (
            <SectionLibrary onAddSection={handleAddSection} />
          )}
        </div>

        <Canvas
          sections={project.sections}
          onSectionsChange={handleSectionsChange}
          onEditSection={handleEditSection}
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

      {showProjectsModal && (
        <ProjectsModal
          currentProjectId={project.id}
          onLoadProject={handleLoadProject}
          onNewProject={handleNewProject}
          onClose={() => setShowProjectsModal(false)}
          onImportProject={handleImport}
          onRenameProject={handleRenameProject}
        />
      )}
    </div>
  );
}

export default App;
