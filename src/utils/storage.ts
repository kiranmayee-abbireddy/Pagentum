import { Project } from '../types';

const STORAGE_KEY = 'pagentum_project';
const PROJECTS_LIST_KEY = 'pagentum_projects_list';

export function saveProject(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));

    const projectsList = getProjectsList();
    const existingIndex = projectsList.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {
      projectsList[existingIndex] = {
        id: project.id,
        name: project.name,
        updatedAt: project.updatedAt
      };
    } else {
      projectsList.push({
        id: project.id,
        name: project.name,
        updatedAt: project.updatedAt
      });
    }

    localStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(projectsList));
  } catch (error) {
    console.error('Failed to save project:', error);
    throw new Error('Failed to save project. Storage might be full.');
  }
}

export function loadProject(): Project | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

export function getProjectsList(): Array<{ id: string; name: string; updatedAt: number }> {
  try {
    const data = localStorage.getItem(PROJECTS_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects list:', error);
    return [];
  }
}

export function exportProjectJSON(project: Project): void {
  const dataStr = JSON.stringify(project, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importProjectJSON(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string);
        if (!project.id || !project.sections || !project.theme) {
          throw new Error('Invalid project file format');
        }
        resolve(project);
      } catch {
        reject(new Error('Failed to parse project file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
