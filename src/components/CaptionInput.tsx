import { FC, useState, ChangeEvent, useRef, useEffect } from 'preact/compat';

interface CaptionInputProps {
  caption: string;
  onChange: (caption: string) => void;
}

const emojis = [
  '🥳', '🥤', '🔥', '👋', '😢', '😎', '🥳', '👋', '😅', '😜', '😱', '😡', '✅', '💩', '👻', '⚡', '🍻', '🦊'
];

const CaptionInput: FC<CaptionInputProps> = ({ caption, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [symbolType, setSymbolType] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiClick = (emoji: string) => {
    if (textareaRef.current) {
      const startPos = textareaRef.current.selectionStart;
      const endPos = textareaRef.current.selectionEnd;
      const newCaption = `${caption.substring(0, startPos)}${emoji}${caption.substring(endPos)}`;
      onChange(newCaption);
      textareaRef.current.focus();
      setShowPicker(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.currentTarget.value);
  };

  useEffect(() => {
    const storedCaption = localStorage.getItem('caption') || '';
    onChange(storedCaption);
  }, [onChange]);

  const togglePicker = () => setShowPicker(prev => !prev);

  const addSymbol = (symbol: string) => {
    if (textareaRef.current) {
      const startPos = textareaRef.current.selectionStart;
      const endPos = textareaRef.current.selectionEnd;
      const newCaption = `${caption.substring(0, startPos)}${symbol} ${caption.substring(endPos)}`;
      onChange(newCaption);
      textareaRef.current.focus();
      setSymbolType(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('caption', caption);
  }, [caption]);

  const handleSymbolClick = (symbol: string) => {
    if (symbolType === symbol) {
      setSymbolType(null);
    } else {
      setSymbolType(symbol);
      addSymbol(symbol);
    }
  };

  return (
    <div class="relative mb-6">
      <textarea
        placeholder="Type your caption here..."
        value={caption}
        onInput={handleInputChange}
        ref={textareaRef}
        class="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        rows={8}
      />
      <div class="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => handleSymbolClick('*')}
          class={`flex items-center justify-center px-2 py-1 rounded-md focus:outline-none transition-colors duration-200 ${symbolType === '*' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-200'}`}
          title="Add Bullet Symbol"
        >
          *️⃣
        </button>
        <button
          type="button"
          onClick={() => handleSymbolClick('#')}
          class={`flex items-center justify-center px-2 py-1 rounded-md focus:outline-none transition-colors duration-200 ${symbolType === '#' ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-200'}`}
          title="Add Number Symbol"
        >
          #️⃣
        </button>
        <button
          type="button"
          onClick={togglePicker}
          class="flex items-center justify-center px-2 py-1 rounded-md focus:outline-none transition-colors duration-200 text-yellow-600 bg-gray-900 hover:bg-gray-900"
          title="Emoji Picker"
        >
          🙂
        </button>
      </div>
      {showPicker && (
        <div class="absolute bottom-0 left-0 z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-2 grid grid-cols-6 gap-2 max-h-40 overflow-y-auto mt-2 transition-transform duration-200 transform translate-y-full">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              class="text-xl bg-gray-100 hover:bg-gray-200 p-1 rounded-lg focus:outline-none transition-colors duration-200"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaptionInput;
