import { useState, useEffect, useRef } from 'react';
import { Sparkles, Upload, Command, X } from 'lucide-react';
import { generateSectionSuggestions } from '../utils/parser';

interface InputBarProps {
  onGenerate: (input: string) => void;
  onImport: (file: File) => void;
}

export default function InputBar({ onGenerate, onImport }: InputBarProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Smart PROMPT suggestions as you type
    if (input.trim().length > 1) {
      const parts = input.split(/[,\n]/);
      const lastPart = parts[parts.length - 1].trim().toLowerCase();
      
      if (lastPart.includes('hero')) {
        setSuggestions(['Hero, Features, Pricing', 'Hero with Image, 3 Column Features', 'Hero and Testimonials']);
      } else if (lastPart.includes('feature')) {
        setSuggestions(['Features, Pricing and CTA', 'Features, Testimonials, Footer']);
      } else if (lastPart.includes('price') || lastPart.includes('pricing')) {
        setSuggestions(['Pricing, FAQ, Footer', 'Pricing and CTA']);
      } else {
        const keywords = generateSectionSuggestions(lastPart);
        setSuggestions(keywords.map(k => `${k}, Features, Footer`).slice(0, 3));
      }
    } else {
      setSuggestions([
        'Hero with image, features and pricing',
        'Professional landing page with testimonials',
        'Product carousel showcase with features',
        'Detailed pricing table with benefits and CTA',
        'Landing page with hero, features, testimonials and footer'
      ]);
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
      setInput('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const parts = input.split(/[,\n]/).map(p => p.trim());
    if (parts[parts.length - 1] === '') {
      parts[parts.length - 1] = suggestion;
    } else {
      parts.push(suggestion);
    }
    const newValue = parts.filter(Boolean).join(', ');
    setInput(newValue + ', ');
    inputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className={`bg-white rounded-3xl shadow-[0_10px_40px_rgba(37,99,235,0.08)] border-2 transition-all p-2 ${
        isFocused ? 'border-blue-200 ring-8 ring-blue-500/5 scale-[1.005]' : 'border-transparent'
      }`}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className={`p-1.5 rounded-lg transition-all ${isFocused ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-500'}`}>
                <Sparkles className={`w-5 h-5 ${isFocused ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Magic generate: 'hero, features, pricing, footer'..."
              className="w-full bg-transparent pl-14 pr-12 sm:pl-16 sm:pr-14 py-4 sm:py-5 text-base sm:text-lg font-medium text-gray-900 border-none outline-none focus:outline-none focus:ring-0 placeholder:text-gray-400 focus:border-none ring-0 shadow-none"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                <Command className="w-3 h-3" /> G
              </div>
              
              {input && (
                <button 
                  type="button" 
                  onClick={() => setInput('')}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <label className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer group">
              <Upload className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" />
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>
            
            <button
              type="submit"
              disabled={!input.trim()}
              className="group relative px-4 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-2xl font-bold transition-all overflow-hidden flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                <span className="hidden sm:inline">Generate</span> <Sparkles className="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>

        {isFocused && (
          <div className="mt-2 px-4 sm:px-16 pb-3 flex flex-wrap gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] w-full text-gray-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Intelligence Suggestions</span>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-blue-100 hover:text-blue-700 text-gray-600 text-xs font-semibold rounded-xl border border-gray-100 transition-all hover:scale-105 active:scale-95"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
