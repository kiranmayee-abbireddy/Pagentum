import { useState } from 'react';
import { Sparkles, Upload } from 'lucide-react';

interface InputBarProps {
  onGenerate: (input: string) => void;
  onImport: (file: File) => void;
}

export default function InputBar({ onGenerate, onImport }: InputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
      setInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your page: 'hero, features, pricing, footer' or 'landing page with testimonials'"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Sparkles className="w-5 h-5" />
            Generate
          </button>

          <label className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-2 font-medium">
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Try: "hero banner with CTA, 3 feature cards, testimonials, pricing table, footer"
        </p>
      </form>
    </div>
  );
}
