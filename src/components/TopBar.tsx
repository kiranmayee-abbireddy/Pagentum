import { Palette, Eye, Download, Save, Grid3x3, Sparkles } from 'lucide-react';

interface TopBarProps {
  onThemeClick: () => void;
  onPreviewClick: () => void;
  onExportClick: () => void;
  onSaveClick: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  isPreviewMode: boolean;
}

export default function TopBar({
  onThemeClick,
  onPreviewClick,
  onExportClick,
  onSaveClick,
  showGrid,
  onGridToggle,
  isPreviewMode
}: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">PageWhirl</h1>
        </div>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Whirl your ideas into pages
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isPreviewMode && (
          <button
            onClick={onGridToggle}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Toggle grid overlay"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onThemeClick}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Change theme"
        >
          <Palette className="w-5 h-5" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        <button
          onClick={onPreviewClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPreviewMode
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Preview page"
        >
          <Eye className="w-5 h-5" />
          <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
        </button>

        <button
          onClick={onSaveClick}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Save project"
        >
          <Save className="w-5 h-5" />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          title="Export HTML/CSS"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
