import React from 'react';

interface NodeConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const NodeConnection: React.FC<NodeConnectionProps> = ({
  startX,
  startY,
  endX,
  endY,
}) => {
  const controlPointX = startX + (endX - startX) * 0.5;

  const path = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="#9ca3afa0" //0.7*255
      strokeWidth="2"
      className="transition-all duration-300 ease-in-out"
    />
  );
};