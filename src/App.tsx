import { useState, useRef, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import StepProjectFolder from './components/StepProjectFolder';
import StepDataCollection from './components/StepDataCollection';
import DataCollectionScreen from './components/DataCollectionScreen';

const SIDE_BAR_MIN_WIDTH = 230;
const SIDE_BAR_MAX_WIDTH = 320;
const SIDE_BAR_DEFAULT_WIDTH = 280;

// fill-gray-50	fill: #f9fafb;
// fill-gray-100	fill: #f3f4f6;
// fill-gray-200	fill: #e5e7eb;
// fill-gray-300	fill: #d1d5db;
// fill-gray-400	fill: #9ca3af;
// fill-gray-500	fill: #6b7280;
// fill-gray-600	fill: #4b5563;
// fill-gray-700	fill: #374151;
// fill-gray-800	fill: #1f2937;
// fill-gray-900	fill: #111827;
// fill-gray-950	fill: #030712;

// text-xs	font-size: 0.75rem; /* 12px */ line-height: 1rem; /* 16px */
// text-sm	font-size: 0.875rem; /* 14px */ line-height: 1.25rem; /* 20px */
// text-base	font-size: 1rem; /* 16px */ line-height: 1.5rem; /* 24px */
// text-lg	font-size: 1.125rem; /* 18px */  line-height: 1.75rem; /* 28px */
// text-xl	font-size: 1.25rem; /* 20px */ line-height: 1.75rem; /* 28px */
// text-2xl	font-size: 1.5rem; /* 24px */ line-height: 2rem; /* 32px */
// text-3xl	font-size: 1.875rem; /* 30px */ line-height: 2.25rem; /* 36px */
// text-4xl	font-size: 2.25rem; /* 36px */ line-height: 2.5rem; /* 40px */
// text-5xl	font-size: 3rem; /* 48px */ line-height: 1;
// text-6xl	font-size: 3.75rem; /* 60px */ line-height: 1;

// font-thin	font-weight: 100;
// font-extralight	font-weight: 200;
// font-light	font-weight: 300;
// font-normal	font-weight: 400;
// font-medium	font-weight: 500;
// font-semibold	font-weight: 600;
// font-bold	font-weight: 700;
// font-extrabold	font-weight: 800;
// font-black	font-weight: 900;

function App() {
  // Sidebar width adjustment variables
  const [sidebarWidth, setSidebarWidth] = useState(SIDE_BAR_DEFAULT_WIDTH);
  const isDragging = useRef(false);
  // Project folder selection variables
  const [projectFolderPath, setProjectFolderPath] = useState('');
  const [isProjectFolderOpen, setIsProjectFolderOpen] = useState(false);
  // Data collection folder selection variables
  const [isDataCollectionActive, setIsDataCollectionActive] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-white from-80% to-gray-100 flex flex-row justify-center divide-x-[1px] py-2">
      <div
        style={{ width: `${sidebarWidth}px`, }}
        className={`min-w-[${SIDE_BAR_MIN_WIDTH}px] px-4 pt-3 pb-2 relative flex-none`}
      >
        <div className='space-y-4 text-start'>
          <StepProjectFolder
            folderPath={projectFolderPath}
            setFolderPath={setProjectFolderPath}
            isFolderOpen={isProjectFolderOpen}
            setIsFolderOpen={setIsProjectFolderOpen}
          />

          {isProjectFolderOpen && (
            <StepDataCollection
              projectFolderPath={projectFolderPath}
              isFolderOpen={isDataCollectionActive}
              setIsFolderOpen={setIsDataCollectionActive}
            />
          )}

          {isProjectFolderOpen && (
            <div>Other Objects</div>
          )}

        </div>

        <div
          id="divider"
          className="absolute right-[-4px] top-0 bottom-0 cursor-col-resize w-[8px] bg-transparent"
          onMouseDown={handleMouseDownDivider}
        >
          {/* 
          TODO: Add elements of sidebar
        */}
        </div>
      </div>
      <div
        className={`flex-1 flex flex-col`}
      >
        {!isProjectFolderOpen ? (
          <HomeScreen />
        ) : (
          <DataCollectionScreen
            isActive={isDataCollectionActive}
            setIsActive={setIsDataCollectionActive} />
        )}
        {/* <DataCollectionScreen
            isActive={isDataCollectionActive}
            setIsActive={setIsDataCollectionActive} /> */}
      </div>
    </div>
  );
}

export default App;
