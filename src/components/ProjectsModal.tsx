import { useState, useEffect, useRef } from 'react';
import { X, FolderOpen, Clock, Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { getProjectsList, deleteProject } from '../utils/storage';
import AlertDialog from './AlertDialog';
import PromptDialog from './PromptDialog';

interface ProjectsModalProps {
  currentProjectId: string;
  onLoadProject: (id: string) => void;
  onNewProject: () => void;
  onClose: () => void;
  onImportProject: (file: File) => void;
  onRenameProject: (id: string, newName: string) => void;
}

export default function ProjectsModal({
  currentProjectId,
  onLoadProject,
  onNewProject,
  onClose,
  onImportProject,
  onRenameProject
}: ProjectsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; updatedAt: number }>>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [promptRename, setPromptRename] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    getProjectsList().then(list => {
      setProjects(list.sort((a, b) => b.updatedAt - a.updatedAt));
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportProject(file);
      onClose();
    }
  };

  const handleRenameClick = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptRename({id, name: currentName});
  };

  const handleConfirmRename = async (newName: string) => {
    if (promptRename && newName.trim() !== promptRename.name) {
      await onRenameProject(promptRename.id, newName.trim());
      getProjectsList().then(list => {
        setProjects(list.sort((a, b) => b.updatedAt - a.updatedAt));
      });
    }
    setPromptRename(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId) {
      await deleteProject(confirmDeleteId);
      const updatedProjects = projects.filter(p => p.id !== confirmDeleteId);
      setProjects(updatedProjects);
      if (confirmDeleteId === currentProjectId) {
         onNewProject();
      }
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-sm text-gray-500">Manage and load your saved pages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={onNewProject}
              className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create New Project</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Import Project</span>
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No saved projects found.
              </div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onLoadProject(project.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    project.id === currentProjectId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      project.id === currentProjectId ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`} >
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(project.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {project.id === currentProjectId && (
                      <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        Current
                      </span>
                    )}
                    <button
                      onClick={(e) => handleRenameClick(project.id, project.name, e)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Rename project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(project.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {confirmDeleteId && (
        <AlertDialog
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          type="error"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
          confirmText="Delete"
        />
      )}

      {promptRename && (
        <PromptDialog
          title="Rename Project"
          message="Enter a new name for your project:"
          defaultValue={promptRename.name}
          onConfirm={handleConfirmRename}
          onCancel={() => setPromptRename(null)}
        />
      )}
    </div>
  );
}
