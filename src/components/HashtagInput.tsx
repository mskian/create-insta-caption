import { FC, useState, useCallback } from 'preact/compat';
import Fuse from 'fuse.js';
import hashtagsData from '../data/hashtags.json';

const fuse = new Fuse(hashtagsData, {
  includeScore: true,
  threshold: 0.2,
  keys: ['tag'],
  shouldSort: true,
  distance: 100,
});

interface HashtagInputProps {
  hashtags: string[];
  onAddHashtag: (hashtag: string) => void;
  onRemoveHashtag: (hashtag: string) => void;
}

const HashtagInput: FC<HashtagInputProps> = ({ hashtags, onAddHashtag, onRemoveHashtag }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleInputChange = useCallback(
    debounce((value: string) => {
      setInput(value);
      setError(null);

      const lastPart = value.split(/[\s,]+/).pop() || '';
      if (lastPart.startsWith('#')) {
        const query = lastPart.slice(1).toLowerCase();
        const filteredSuggestions = fuse.search(query).map(result => result.item);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 250),
    []
  );

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();

      let tags = input
        .split(/[\s,]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#') && tag.length > 1 && !hashtags.includes(tag));

      if (suggestions.length > 0) {
        const suggestion = suggestions[0];
        tags = [`${suggestion}`];
      }

      if (tags.length > 0) {
        tags.forEach(tag => {
          if (tag.length <= 36) {
            onAddHashtag(tag);
            setInput('');
            setError(null);
          } else {
            setError('Hashtag cannot exceed 36 characters.');
          }
        });
        setSuggestions([]);
      } else if (input.trim() !== '') {
        setError('Hashtag already added or invalid.');
      }
    }
  };

  const handleChange = (e: any) => {
    const value = e.currentTarget.value;
    setInput(value);
    handleInputChange(value);
  };

  const handleBlur = () => {
    if (!input.trim()) {
      setError(null);
    } else {
      handleKeyDown({ key: 'Enter', preventDefault: () => {} });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const lastPart = input.split(/[\s,]+/).pop() || '';
    const newInput = input.slice(0, input.length - lastPart.length) + `#${suggestion}`;

    if (!hashtags.includes(`#${suggestion}`)) {
      onAddHashtag(`#${suggestion}`);
      setInput('');
      setError(null);
    }
    setSuggestions([]);
  };

  const handleRemoveHashtag = (hashtag: string) => {
    onRemoveHashtag(hashtag);
  };

  return (
    <div class="relative mb-6 w-full max-w-lg mx-auto">
      <div class="p-4 mb-4 text-sm text-black bg-yellow-100 border border-yellow-300 rounded-lg" role="alert">
        <p>
          Add a new tag by searching or just typing text with 
          <span class="font-semibold text-yellow-900 bg-yellow-200 px-1 py-0.5 rounded-md mx-1">#</span>
          and use 
          <span class="font-semibold"> Enter</span> or 
          <span class="font-semibold"> Comma</span> to insert a hashtag.
        </p>
      </div>

      <input
        type="text"
        placeholder="#AddHashtag"
        value={input}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        class="w-full h-12 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
      {error && <p class="text-red-500 text-sm mt-1">{error}</p>}

      {suggestions.length > 0 && (
        <div class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <span
              key={`${suggestion}-${index}`}
              class="block px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-900 truncate transition duration-150 ease-in-out"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </span>
          ))}
        </div>
      )}

      {hashtags.length > 0 && (
        <div class="flex flex-wrap gap-2 mt-2">
          {hashtags.map((hashtag, index) => (
            <div key={`${hashtag}-${index}`} class="flex items-center gap-1">
              <span
                class="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-4 py-1 rounded-full cursor-default text-sm font-medium shadow-md whitespace-pre-line text-wrap break-words"
              >
                {hashtag}
                <button 
                  onClick={() => handleRemoveHashtag(hashtag)} 
                  class="ml-2 text-red-800 text-lg font-bold focus:outline-none hover:text-red-600"
                >
                  &times;
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagInput;
