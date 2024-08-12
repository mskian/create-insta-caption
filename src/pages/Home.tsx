import { FC, useState, useEffect } from 'preact/compat';
import CaptionInput from '../components/CaptionInput';
import HashtagInput from '../components/HashtagInput';
import OutputSection from '../components/OutputSection';

const Home: FC = () => {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    const storedHashtags = JSON.parse(localStorage.getItem('hashtags') || '[]');
    setHashtags(storedHashtags);
  }, []);

  useEffect(() => {
    localStorage.setItem('hashtags', JSON.stringify(hashtags));
  }, [hashtags]);

  const addHashtag = (hashtag: string) => {
    if (!hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag]);
    }
  };

  const removeHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter(h => h !== hashtag));
  };

  const clearAll = () => {
    setCaption('');
    setHashtags([]);
    localStorage.removeItem('caption');
    localStorage.removeItem('hashtags');
  };

  return (
    <div class="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-100 via-purple-200 to-purple-400 p-5">
      <header class="bg-gradient-to-r from-rose-500 to-purple-600 text-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-center mb-8">
        <h1 class="text-2xl font-extrabold">Instagram Caption Maker</h1>
      </header>

      <main class="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <CaptionInput caption={caption} onChange={setCaption} />
        <HashtagInput 
          hashtags={hashtags} 
          onAddHashtag={addHashtag} 
          onRemoveHashtag={removeHashtag}
        />

        {(caption || hashtags.length > 0) && (
          <div class="mt-6">
            <OutputSection caption={caption} hashtags={hashtags} />
          </div>
        )}

        {(caption || hashtags.length > 0) && (
          <div class='flex flex-col items-center'>
          <button 
            onClick={clearAll} 
            class="w-7/12 mt-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-rose-600 hover:to-purple-700 transition-colors duration-200"
          >
            Clear Data
          </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
