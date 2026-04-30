import { get, set, del } from 'idb-keyval';
import { Project } from '../types';

const STORAGE_KEY_PREFIX = 'pagentum_project_';
const PROJECTS_LIST_KEY = 'pagentum_projects_list';
const LAST_ACTIVE_KEY = 'pagentum_last_active';
const MIGRATION_KEY = 'pagentum_migrated_to_idb';

async function migrateFromLocalStorage() {
  try {
    const isMigrated = await get(MIGRATION_KEY);
    if (isMigrated) return;

    const listStr = localStorage.getItem(PROJECTS_LIST_KEY);
    if (listStr) {
      const list = JSON.parse(listStr);
      await set(PROJECTS_LIST_KEY, list);
      
      for (const p of list) {
        const projectStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}${p.id}`);
        if (projectStr) {
          await set(`${STORAGE_KEY_PREFIX}${p.id}`, JSON.parse(projectStr));
        }
      }
    }
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      await set(LAST_ACTIVE_KEY, lastActive);
    }
    
    await set(MIGRATION_KEY, true);
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrateFromLocalStorage();

export async function saveProject(project: Project): Promise<void> {
  try {
    await set(`${STORAGE_KEY_PREFIX}${project.id}`, project);

    const projectsList = await getProjectsList();
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

    await set(PROJECTS_LIST_KEY, projectsList);
    await set(LAST_ACTIVE_KEY, project.id);
  } catch (error) {
    console.error('Failed to save project:', error);
    throw new Error('Failed to save project. Storage might be full.');
  }
}

export async function loadProject(id?: string): Promise<Project | null> {
  try {
    let targetId = id;
    if (!targetId) {
      targetId = (await get(LAST_ACTIVE_KEY)) || '';
    }
    
    let data = null;
    if (targetId) {
      data = await get(`${STORAGE_KEY_PREFIX}${targetId}`);
    }
    
    if (!data) {
      const legacy = localStorage.getItem('pagentum_project');
      if (legacy) {
        data = JSON.parse(legacy);
        await set(`${STORAGE_KEY_PREFIX}${data.id}`, data);
      }
    }
    
    return data || null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

export async function getProjectsList(): Promise<Array<{ id: string; name: string; updatedAt: number }>> {
  try {
    const data = await get(PROJECTS_LIST_KEY);
    return data || [];
  } catch (error) {
    console.error('Failed to load projects list:', error);
    return [];
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await del(`${STORAGE_KEY_PREFIX}${id}`);
    const projectsList = await getProjectsList();
    const updated = projectsList.filter(p => p.id !== id);
    await set(PROJECTS_LIST_KEY, updated);
  } catch (error) {
    console.error('Failed to delete project:', error);
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
