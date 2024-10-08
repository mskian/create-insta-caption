import { FC, useState, useCallback, useEffect } from 'preact/compat';
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
        const filteredSuggestions = fuse.search(lastPart.slice(1)).map(result => result.item);
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

      const tags = input
      .split(/[\s,]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('#') && tag.length > 1 && !hashtags.includes(tag));

      const uniqueTags = Array.from(new Set(tags));
      uniqueTags.forEach(tag => {
        if (tag.length <= 36) {
          if (!hashtags.includes(tag)) {
            onAddHashtag(tag);
            setInput('');
            setError(null);
          } else {
            setError('Hashtag already added.');
          }
        } else {
          setError('Hashtag cannot exceed 100 characters.');
        }
      });

      setInput('');
      setSuggestions([]);
    }
  };

  const handleChange = (e: any) => {
    const value = e.currentTarget.value;
    handleInputChange(value);

    if (value.endsWith(',')) {
      handleKeyDown({ key: ',' });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!hashtags.includes(suggestion)) {
      onAddHashtag(suggestion);
    }
    setInput('');
    setSuggestions([]);
  };

  const handleRemoveHashtag = (hashtag: string) => {
    onRemoveHashtag(hashtag);
  };

  useEffect(() => {
    handleInputChange(input);
  }, [input]);

  return (
    <div class="relative mb-8 w-full mx-auto">
      <div class="p-4 mb-6 text-sm text-black bg-yellow-300 border border-rose-300 rounded-lg" role="alert">
        <p>
          Add a new tag by searching or just typing text with 
          <span class="font-semibold text-yellow-900 bg-purple-200 px-1 py-0.5 rounded-md mx-1">#</span>
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
        class="w-full mb-4 h-12 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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
        <div class="flex flex-wrap gap-1 mt-2">
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
