import { FunctionalComponent } from 'preact';

interface HashtagSuggestionsProps {
  suggestions: string[];
  onSelect: (hashtag: string) => void;
}

const HashtagSuggestions: FunctionalComponent<HashtagSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div class="mt-4 w-full max-w-lg mx-auto">
      <div class="flex flex-wrap gap-3 bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {suggestions.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out"
            onClick={() => onSelect(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HashtagSuggestions;
