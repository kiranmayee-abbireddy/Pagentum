import { Palette, Eye, Download, Save, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface TopBarProps {
  onThemeClick: () => void;
  onPreviewClick: () => void;
  onExportClick: () => void;
  onSaveClick: () => void;
  isPreviewMode: boolean;
  isHeaderCollapsed: boolean;
  onCollapseToggle: () => void;
}

export default function TopBar({
  onThemeClick,
  onPreviewClick,
  onExportClick,
  onSaveClick,
  isPreviewMode,
  isHeaderCollapsed,
  onCollapseToggle
}: TopBarProps) {
  return (
    <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Pagentum</h1>
        </div>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Whirl your ideas into pages
        </span>

        {!isPreviewMode && (
          <button 
            onClick={onCollapseToggle}
            className="ml-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 flex items-center gap-1 text-xs font-medium"
            title={isHeaderCollapsed ? "Show magic bar" : "Hide magic bar"}
          >
            {isHeaderCollapsed ? (
              <><Sparkles className="w-4 h-4 text-blue-600" /> <ChevronDown className="w-4 h-4" /></>
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">

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
