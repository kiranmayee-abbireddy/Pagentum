import { useState, useEffect } from 'react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
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
import AlertDialog from './components/AlertDialog';

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
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

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
      setAlertConfig({ title: 'Success', message: 'Project saved successfully!', type: 'success' });
    } catch (error) {
      setAlertConfig({ title: 'Save Failed', message: 'Failed to save project. Please try exporting as JSON instead.', type: 'error' });
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
      setAlertConfig({ title: 'Success', message: 'Project imported successfully!', type: 'success' });
    } catch (error) {
      setAlertConfig({ title: 'Import Failed', message: 'Failed to import project. Please check the file format.', type: 'error' });
    }
  };

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] via-white to-blue-50/50">
      <div className="bg-white/80 backdrop-blur-md border-b border-white/40 relative z-20">
        <TopBar
          onThemeClick={() => setShowThemeSelector(true)}
          onPreviewClick={() => setShowPreview(!showPreview)}
          onExportClick={() => setShowExportModal(true)}
          onSaveClick={handleSave}
          onProjectsClick={() => setShowProjectsModal(true)}
          isPreviewMode={showPreview}
        />

        {!showPreview && (
          <div className={`bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/40 overflow-hidden transition-all duration-500 ease-in-out ${isHeaderCollapsed ? 'max-h-0' : 'max-h-[500px]'
            }`}>
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-12">
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3 sm:mb-8">
                Design with <span className="text-blue-600">Magic.</span>
              </h2>
              <InputBar onGenerate={handleGenerate} onImport={handleImport} />
            </div>
          </div>
        )}

        {!showPreview && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex justify-center z-30">
            <button
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="bg-white border border-gray-200 text-gray-400 hover:text-blue-600 shadow-sm rounded-full p-1 transition-all hover:scale-110 hover:shadow-md flex items-center justify-center"
              title={isHeaderCollapsed ? "Show magic bar" : "Hide magic bar"}
            >
              {isHeaderCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`
          fixed inset-x-0 bottom-0 z-50 h-[80vh] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 overflow-hidden transform transition-transform duration-300 ease-out flex flex-col
          ${showMobileLibrary ? 'translate-y-0' : 'translate-y-full'}
          lg:relative lg:inset-auto lg:h-full lg:w-72 lg:translate-y-0 lg:rounded-none lg:shadow-none lg:bg-white/40 lg:border-r lg:border-t-0 lg:border-white/20 lg:z-auto lg:flex
        `}>
          <div className="sticky top-0 w-full flex justify-center py-3 bg-white/95 backdrop-blur-md lg:hidden z-10 cursor-pointer" onClick={() => setShowMobileLibrary(false)}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden relative">
            {!showPreview && (
              <SectionLibrary onAddSection={(id) => {
                handleAddSection(id);
                setShowMobileLibrary(false);
              }} />
            )}
          </div>
        </div>

        {showMobileLibrary && !showPreview && (
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setShowMobileLibrary(false)}
          />
        )}

        <Canvas
          sections={project.sections}
          onSectionsChange={handleSectionsChange}
          onEditSection={handleEditSection}
        />

        {!showPreview && (
          <button
            onClick={() => setShowMobileLibrary(true)}
            className="lg:hidden absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-colors z-20 flex items-center justify-center group"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        )}
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

export default App;
