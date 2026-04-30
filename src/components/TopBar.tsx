import { Palette, Eye, Download, Save, Sparkles, FolderOpen } from 'lucide-react';

interface TopBarProps {
  onThemeClick: () => void;
  onPreviewClick: () => void;
  onExportClick: () => void;
  onSaveClick: () => void;
  onProjectsClick: () => void;
  isPreviewMode: boolean;
}

export default function TopBar({
  onThemeClick,
  onPreviewClick,
  onExportClick,
  onSaveClick,
  onProjectsClick,
  isPreviewMode
}: TopBarProps) {
  return (
    <div className="h-16 bg-white flex items-center justify-between px-3 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Pagentum</h1>
        </div>
        <span className="text-sm text-gray-500 hidden lg:inline">
          Whirl your ideas into pages
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">

        <button
          onClick={onThemeClick}
          className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Change theme"
        >
          <Palette className="w-5 h-5" />
          <span className="hidden md:inline">Theme</span>
        </button>

        <button
          onClick={onPreviewClick}
          className={`flex items-center gap-2 p-2 md:px-4 md:py-2 rounded-lg transition-colors ${
            isPreviewMode
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Preview page"
        >
          <Eye className="w-5 h-5" />
          <span className="hidden md:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
        </button>

        <button
          onClick={onProjectsClick}
          className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Your projects"
        >
          <FolderOpen className="w-5 h-5" />
          <span className="hidden md:inline">Projects</span>
        </button>

        <button
          onClick={onSaveClick}
          className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Save project"
        >
          <Save className="w-5 h-5" />
          <span className="hidden md:inline">Save</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          title="Export HTML/CSS"
        >
          <Download className="w-5 h-5" />
          <span className="hidden md:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
