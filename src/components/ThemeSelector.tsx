import { X, Check } from 'lucide-react';
import { ThemeConfig } from '../types';
import { themePresets } from '../data/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onClose: () => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose Theme</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {Object.values(themePresets).map(theme => {
              const isSelected = currentTheme.name === theme.name;

              return (
                <button
                  key={theme.name}
                  onClick={() => onThemeChange(theme)}
                  className={`relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                    isSelected
                      ? 'border-blue-600 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <h3 className="font-semibold text-gray-900 mb-3">{theme.name}</h3>

                  <div className="flex gap-2 mb-3">
                    <div
                      className="w-12 h-12 rounded border border-gray-200"
                      style={{ backgroundColor: theme.primaryColor }}
                      title="Primary Color"
                    />
                    <div
                      className="w-12 h-12 rounded border border-gray-200"
                      style={{ backgroundColor: theme.secondaryColor }}
                      title="Secondary Color"
                    />
                    <div
                      className="w-12 h-12 rounded border border-gray-200"
                      style={{ backgroundColor: theme.backgroundColor }}
                      title="Background Color"
                    />
                    <div
                      className="w-12 h-12 rounded border border-gray-200"
                      style={{ backgroundColor: theme.textColor }}
                      title="Text Color"
                    />
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Font Size:</span>
                      <span className="font-medium">{theme.fontSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spacing:</span>
                      <span className="font-medium">{theme.spacing}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Custom Adjustments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={currentTheme.primaryColor}
                  onChange={(e) =>
                    onThemeChange({ ...currentTheme, primaryColor: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={currentTheme.secondaryColor}
                  onChange={(e) =>
                    onThemeChange({ ...currentTheme, secondaryColor: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={currentTheme.backgroundColor}
                  onChange={(e) =>
                    onThemeChange({ ...currentTheme, backgroundColor: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={currentTheme.textColor}
                  onChange={(e) =>
                    onThemeChange({ ...currentTheme, textColor: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
