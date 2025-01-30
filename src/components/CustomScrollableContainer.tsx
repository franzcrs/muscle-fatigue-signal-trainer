import React, { useState, useRef, useEffect } from 'react'

type CustomScrollableContainerProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  scrollbars?: boolean;
  enablePan?: boolean;
}

const CustomScrollableContainer = ({ children, id, className, scrollbars = true, enablePan = false }: CustomScrollableContainerProps) => {
  // Drag variables
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const dragStartScrollTop = useRef(0);
  const [cursorGrabbing, setCursorGrabbing] = useState(false);

  const [initialized, setInitialized] = useState(false);

  // Handle for the start of drag action
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (enablePan) {
      console.log('Drag start');
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      dragStartScrollLeft.current = containerRef.current?.scrollLeft || 0;
      dragStartScrollTop.current = containerRef.current?.scrollTop || 0;
      isDragging.current = true;
    }
    document.body.classList.add('select-none'); // Disable text selection
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setCursorGrabbing(true);
    console.log('Dragging');
    e.preventDefault();
    const walkX = (e.clientX - dragStartX.current) * 1.0;
    const walkY = (e.clientY - dragStartY.current) * 1.0;
    if (!containerRef.current) return;
    // const { scrollWidth, scrollHeight, clientWidth, clientHeight } = containerRef.current;
    containerRef.current.scrollLeft = dragStartScrollLeft.current - walkX;// * (scrollWidth / clientWidth);
    containerRef.current.scrollTop = dragStartScrollTop.current - walkY;// * (scrollHeight / clientHeight);
  };
  const handleMouseUp = () => {
    if (enablePan && isDragging.current) {
      console.log('Drag end');
      isDragging.current = false;
      setCursorGrabbing(false);
    }
    document.body.classList.remove('select-none'); // Enable text selection
  };

  // Execute functions on component mount with cleanup
  useEffect(() => {
    if (!enablePan) { isDragging.current = false; }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    if (containerRef.current && enablePan && !initialized) {
      const container = containerRef.current;
      const scrollableWidth = container.scrollWidth - container.clientWidth;
      // const scrollableHeight = container.scrollHeight - container.clientHeight;
      // Get the first child's vertical inset value
      const firstChild = container.firstElementChild as HTMLElement;
      const firstChildStyle = window.getComputedStyle(firstChild);
      const firstChildVerticalInset = parseInt(firstChildStyle.inset.split(' ')[0]) || 0;
      
      container.scrollLeft = scrollableWidth / 2;
      container.scrollTop = firstChildVerticalInset - 40;
      setInitialized(true);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Check if child has padding-right
  const hasPaddingRight = (child: React.ReactElement): boolean => {
    const style = child.props.style;
    const className = child.props.className || '';

    return (
      // Check inline styles
      (style?.paddingRight !== undefined) ||
      (style?.padding !== undefined) ||
      // Check Tailwind classes
      className.match(/\b(pr-|px-)\d+/) !== null ||
      // Check regular CSS classes
      className.includes('padding-right') ||
      className.includes('has-padding')
    );
  };
  // Check if child has cursor style is not default
  const hasCursorStyle = (child: React.ReactElement): boolean => {
    const style = child.props.style;
    const className = child.props.className || '';

    return (
      // Check inline styles
      (style?.cursor !== undefined) ||
      // Check Tailwind classes
      className.match(/\bcursor-\w+/) !== null ||
      // Check regular CSS classes
      className.includes('cursor')
    );
  };

  // Style the children with padding-right
  const styleTopChildren = (): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childElement = child as React.ReactElement;
        return hasPaddingRight(childElement)
          ? React.cloneElement(childElement, {
            className: `${childElement.props.className || ''} pr-2`.trim()
          })
          : child; // Return unchanged style
      }
      return child;
    });
  }
  // Style the children with padding-right and erasing cursor style
  const styleTopChildrenSpanEnabled = (): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childElement = child as React.ReactElement;
        if (hasPaddingRight(childElement) && hasCursorStyle(childElement)) {
          const classNameWithoutCursor = childElement.props.className?.split(' ').filter((cls: string | string[]) => !cls.includes('cursor')).join(' ') || '';
          return React.cloneElement(childElement, {
            className: classNameWithoutCursor + ' pr-2'
          });
        } else if (hasPaddingRight(childElement)) {
          return React.cloneElement(childElement, {
            className: `${childElement.props.className || ''} pr-2`.trim()
          });
        } else if (hasCursorStyle(childElement)) {
          const classNameWithoutCursor = childElement.props.className?.split(' ').filter((cls: string | string[]) => !cls.includes('cursor')).join(' ') || '';
          return React.cloneElement(childElement, {
            className: classNameWithoutCursor.trim()
          });
        }
        return child; // Return unchanged style
      }
      return child;
    });
  }

  return (
    <div
      id={id}
      ref={containerRef}
      className={`${className} overflow-auto 
                  ${scrollbars ? 'custom-scrollbar' : 'hidden-scrollbar'} 
                  ${enablePan ? 'cursor-grab' : ''} 
                  ${enablePan && cursorGrabbing ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {enablePan ? styleTopChildrenSpanEnabled() : styleTopChildren()}
    </div>
  )
}

export default CustomScrollableContainer