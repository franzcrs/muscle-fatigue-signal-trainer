import { useState } from 'react';
import { DraftingCompass } from 'lucide-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white from-70% to-gray-200 flex items-center justify-center">
      <div className="max-w-5xl mx-auto p-8 text-center space-y-4">
        <div className="text-xl text-gray-900 flex items-center justify-center">
          This is my app <DraftingCompass className="ml-2 text-blue-500"/>
        </div>
        <button className="rounded-lg px-5 py-2 text-base text-gray-900 bg-gray-300 cursor-pointer transition-colors duration-200 hover:bg-gray-200" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="text-sm text-gray-500">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
