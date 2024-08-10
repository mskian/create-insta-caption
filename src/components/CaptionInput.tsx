import { FC } from 'preact/compat';

interface CaptionInputProps {
  caption: string;
  onChange: (caption: string) => void;
}

const CaptionInput: FC<CaptionInputProps> = ({ caption, onChange }) => {
  return (
    <div class="mb-6">
      <textarea
        placeholder="Type your caption here..."
        value={caption}
        onInput={(e) => onChange(e.currentTarget.value)}
        class="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={8}
      />
    </div>
  );
};

export default CaptionInput;
