import { useState, useRef, useEffect } from 'react';
import { DraftingCompass } from 'lucide-react';

const SIDE_BAR_MIN_WIDTH = 250;
const SIDE_BAR_MAX_WIDTH = 350;
const SIDE_BAR_DEFAULT_WIDTH = 280;

function App() {
  const [count, setCount] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(SIDE_BAR_DEFAULT_WIDTH);
  const isDragging = useRef(false);

  const handleMouseDownDivider = () => {
    isDragging.current = true;
    document.body.classList.add('select-none'); // Disable text selection
  };

  const handleMouseMoveDivider = (e: MouseEvent) => {
    if (isDragging.current) {
      if (e.clientX < SIDE_BAR_MIN_WIDTH) {
        setSidebarWidth(SIDE_BAR_MIN_WIDTH);
        return;
      }
      else if (e.clientX > SIDE_BAR_MAX_WIDTH) {
        setSidebarWidth(SIDE_BAR_MAX_WIDTH);
        return;
      }
      setSidebarWidth(e.clientX);
    }
  };

  const handleMouseUpDivider = () => {
    isDragging.current = false;
    document.body.classList.remove('select-none'); // Enable text selection
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMoveDivider);
    document.addEventListener('mouseup', handleMouseUpDivider);
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDivider);
      document.removeEventListener('mouseup', handleMouseUpDivider);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white from-70% to-gray-200 flex flex-row items-normal justify-center divide-x-[1px] py-2">
      <div
        style={{ width: `${sidebarWidth}px`, }}
        className={`min-w-[${SIDE_BAR_MIN_WIDTH}px] px-4 py-2 relative`}
      >
        Sidebar
        <div 
          id="divider"
          className="absolute right-[-4px] top-0 bottom-0 cursor-col-resize w-[8px] bg-transparent"
          onMouseDown={handleMouseDownDivider}
        >
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-around">
        <div className="px-8 pt-8 pb-12 space-y-4 text-center">
          <div className="text-xl flex items-center justify-center">
            This is my app <DraftingCompass className="ml-2 text-blue-500" />
          </div>
          <button
            className="rounded-lg px-5 py-2 text-base bg-gray-300 cursor-pointer transition-colors duration-200 hover:bg-gray-200"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="text-sm text-gray-500">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
