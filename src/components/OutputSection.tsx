import { FC, useState } from 'preact/compat';

interface OutputSectionProps {
  caption: string;
  hashtags: string[];
}

const OutputSection: FC<OutputSectionProps> = ({ caption, hashtags }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!caption && hashtags.length === 0) {
      return;
    }

    navigator.clipboard.writeText(`${caption}\n\n${hashtags.join(' ')}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!caption && hashtags.length === 0) {
    return null;
  }

  return (
    <div class="relative mt-8 p-11 bg-white border border-gray-300 rounded-xl shadow-xl max-w-2xl mx-auto">
      {/* Copy Button */}
      {(caption || hashtags.length > 0) && (
        <button
          onClick={handleCopy}
          class="absolute top-2 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white p-2 rounded-full shadow-lg hover:bg-gradient-to-l transition duration-150"
        >
          {isCopied ? (
            <span class="text-sm font-medium">✓ Copied</span>
          ) : (
            <span class="text-xs" aria-label="Copy">
              &#x1F4CB; {/* Clipboard emoji */}
            </span>
          )}
        </button>
      )}

      {/* Caption and Hashtags Display */}
      <div class="pt-6">
        {caption && (
          <p class="text-gray-800 text-base font-medium leading-relaxed whitespace-pre-line text-wrap break-words mb-6">
            {caption}
          </p>
        )}
        {hashtags.length > 0 && (
          <div class="flex flex-wrap gap-3">
            {hashtags.map((hashtag) => (
              <span
                key={hashtag}
                class="bg-gradient-to-r from-pink-400 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md whitespace-pre-line "
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputSection;
