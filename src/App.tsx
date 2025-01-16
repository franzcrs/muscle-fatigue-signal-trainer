import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Logo from "./assets/Muscle Fatigue Signal Trainer.svg?react";

const SIDE_BAR_MIN_WIDTH = 250;
const SIDE_BAR_MAX_WIDTH = 350;
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

function App() {
  // Sidebar width adjustment variables
  const [sidebarWidth, setSidebarWidth] = useState(SIDE_BAR_DEFAULT_WIDTH);
  const isDragging = useRef(false);
  // Recent projects chart scroll variables
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  // Custom thumb drag variables
  const isDraggingThumb = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

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

  const retrieveRecentResults = () => {
    return [
      {
        id: 1,
        folder: '.../muscle_fatigue_isometric_elbow_flexion',
        modified: '2024-09-01',
      },
      {
        id: 2,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy',
        modified: '2024-10-01',
      },
      {
        id: 3,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 4,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 5,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 6,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 7,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
    ]
  }

  const recentResults = retrieveRecentResults();

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMoveDivider);
    document.addEventListener('mouseup', handleMouseUpDivider);
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDivider);
      document.removeEventListener('mouseup', handleMouseUpDivider);
    };
  }, []);

  // Handle Scroll of Recent Projects Chart
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const newThumbTop = scrollTop + (scrollTop / scrollHeight) * clientHeight;
      console.log("newThumbTop", newThumbTop);
      setTimeout(() => {
        setThumbTop(newThumbTop);
      }, 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log("useEffect", "handleScroll");
      console.log("scrollTop", scrollTop, "scrollHeight", scrollHeight, "clientHeight", clientHeight);
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      const container = scrollContainerRef.current;
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

   // Calculation of thumb height
   const calculateThumbHeight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollHeight, clientHeight } = container;
      const newThumbHeight = (clientHeight / scrollHeight) * clientHeight;
      setThumbHeight(newThumbHeight);
      console.log("thumbHeight", newThumbHeight);
    }
  }

  useEffect(() => {
    console.log("useEffect", "calculateThumbHeight");
    calculateThumbHeight();
    window.addEventListener("resize", calculateThumbHeight);
    return () => {
      window.removeEventListener("resize", calculateThumbHeight);
    }
  }, []);

  // Handle Drag of Custom Thumb
  const handleMouseDownThumb = (e:MouseEvent) => {
    e.preventDefault();
    if (!isDraggingThumb.current) {
      dragStartY.current = e.clientY;
      // if (dragStartY.current) console.log("dragStartY.current", dragStartY.current);
      const container = scrollContainerRef.current;
      if (container) { dragStartScrollTop.current = container.scrollTop; }
    }
    isDraggingThumb.current = true;
    document.body.classList.add('select-none'); // Disable text selection
  };

  const handleMouseMoveThumb = (e: MouseEvent) => {
    if (!isDraggingThumb.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollHeight, clientHeight } = container;
    const draggedVector = e.clientY - dragStartY.current;

    const newScrollTop = dragStartScrollTop.current + draggedVector * (scrollHeight / clientHeight);
    container.scrollTop = newScrollTop;
  };

  const handleMouseUpThumb = () => {
    if (isDraggingThumb.current) {
      isDraggingThumb.current = false;
      document.body.classList.remove('select-none'); // Enable text selection
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMoveThumb);
    document.addEventListener('mouseup', handleMouseUpThumb);
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveThumb);
      document.removeEventListener('mouseup', handleMouseUpThumb);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white from-80% to-gray-100 flex flex-row items-normal justify-center divide-x-[1px] py-2">
      <div
        style={{ width: `${sidebarWidth}px`, }}
        className={`min-w-[${SIDE_BAR_MIN_WIDTH}px] px-4 py-2 relative flex-none`}
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
        <div className="px-8 pt-8 pb-12 space-y-3 text-center">
          <h1 className="text-xl flex items-center justify-center">
            <Logo width={300} fill={'#111827'}/>
          </h1>
          <h2 className="font-extralight text-sm">
          A training tool for ML prediction of muscle fatigue signals
          </h2>
          <p className="font-extralight text-base text-gray-300">
            by Franz Chuquirachi
          </p>
          <h3 className="font-light text-xs text-left">
            Recent projects
          </h3>
          <div 
          id="recent-projects-chart"
          ref={scrollContainerRef}
          className="bg-gray-100 rounded-md flex flex-col divide-y divide-gray-200 overflow-y-auto min-h-[40dvh] max-h-[45vh] relative overscroll-none
          pr-[11px]"
          >
            <div 
            id="recent-projects-header"
            className="flex flex-row flex-nowrap space-x-2 items-center px-4 pb-1 pt-2"
            >
              <div className="flex-auto basis-3/5 font-extralight text-[0.7rem] text-left overflow-hidden whitespace-nowrap">
                Folder Name
              </div>
              <div className="flex-initial basis-1/5 font-extralight text-[0.7rem] text-left overflow-hidden whitespace-nowrap">
                Modified
              </div>
              <div className="flex-initial basis-[6%] font-extralight text-[0.7rem] text-center overflow-hidden whitespace-nowrap">
                Action
              </div>
            </div>
            {recentResults.map((recentResults) => (
              <div 
                id="recent-projects-item"
                key={recentResults.id.toString()}
                className="flex flex-row flex-nowrap space-x-2 items-center p-4 hover:bg-gray-200 transition-colors duration-300"
              >
                <h3 className="flex-auto basis-3/5 font-light text-xs text-left overflow-hidden whitespace-nowrap">
                  {recentResults.folder}
                </h3>
                <h3 className="flex-initial basis-1/5 font-light text-xs text-left overflow-hidden whitespace-nowrap">
                  {recentResults.modified}
                </h3>
                <Trash2 className="flex-initial basis-[6%] text-gray-400 hover:text-gray-100 transition-colors duration-100" size={16} />
              </div>
            )
            )}
            <div 
              id="custom-thumb"
              ref={thumbRef}
              style={{ height:`${thumbHeight-7}px`, top: `${thumbTop+3.5}px`, }}
              className="absolute top-0 right-[2.5px] w-[6px] rounded-full bg-gray-200 cursor-pointer"
              onMouseDown={handleMouseDownThumb}
            >
            </div>
          </div>
          {/* 
          TODO: Update thumb height upon change of clientHeight
          TODO: Transform custom thumb to an automatic feature when scrollHeight is greater than clientHeight
          TODO: Add elements of sidebar
           */}
        </div>
      </div>
    </div>
  );
}

export default App;
