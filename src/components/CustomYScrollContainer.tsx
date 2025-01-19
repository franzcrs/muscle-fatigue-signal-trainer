import React, { useState, useRef, useEffect } from 'react';

interface CustomScrollContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const CustomYScrollContainer: React.FC<CustomScrollContainerProps> = ({ children, id, className, }) => {
  // Scroll bar visibility state
  const [isScrollRequired, setIsScrollRequired] = useState(false);
  // Container scroll action variables
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  // Custom thumb drag variables
  const isDraggingThumb = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  // Evaluate if the custom scroll bar is required
  const evaluateScrollRequired = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollHeight, clientHeight } = container;
      setIsScrollRequired(false);
      setIsScrollRequired(scrollHeight > clientHeight);
      console.log("isScrollRequired", scrollHeight > clientHeight);
    }
  };

  // Evaluate visibility of custom scroll bar after the component is mounted and on every window resize
  useEffect(() => {
    evaluateScrollRequired();
    window.addEventListener("resize", evaluateScrollRequired);
    return () => {
      window.removeEventListener("resize", evaluateScrollRequired);
    }
  }, []);

  // Handle for the scroll action on container
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

  // Handle for the start of drag action of custom thumb
  const handleMouseDownThumb = (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Configure functions to execute after first render and cleanup after unmount
  useEffect(() => {
    // Call the scroll handler on every scroll event of the container
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log("useEffect", "handleScroll");
      console.log("scrollTop", scrollTop, "scrollHeight", scrollHeight, "clientHeight", clientHeight);
      container.addEventListener('scroll', handleScroll);
    }
    // Initial calculation of thumb height
    console.log("useEffect", "calculateThumbHeight");
    calculateThumbHeight();
    // Call the thumb height calculation on every window resize
    window.addEventListener("resize", calculateThumbHeight);
    // Call the respective thumb actions on mouse events
    document.addEventListener('mousemove', handleMouseMoveThumb);
    document.addEventListener('mouseup', handleMouseUpThumb);
    return () => {
      // Cleanup scroll event listener
      const container = scrollContainerRef.current;
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      // Cleanup window resize event listener
      window.removeEventListener("resize", calculateThumbHeight);
      // Cleanup mouse event listeners
      document.removeEventListener('mousemove', handleMouseMoveThumb);
      document.removeEventListener('mouseup', handleMouseUpThumb);
    };
  }, [thumbRef]);

  return (
    <div
      id={id}
      ref={scrollContainerRef}
      style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent transparent' }}
      className={`${className} custom-scroll-container ${isScrollRequired ? 'relative overflow-y-auto overscroll-none pr-[11px]' : ''}`}
    >
        {children}
        {isScrollRequired && (
          <div 
            id="custom-thumb"
            ref={thumbRef}
            style={{ height:`${thumbHeight-7}px`, top: `${thumbTop+3.5}px`, }}
            className="absolute top-0 right-[2.5px] w-[6px] rounded-full bg-gray-200 cursor-pointer"
            onMouseDown={handleMouseDownThumb}
          />
        )}
    </div>
  );
};

export default CustomYScrollContainer;