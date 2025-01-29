import React, { useRef, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { NodeConnection } from './NodeConnection';

export type MindMapNode = {
  id: string;
  content: string;
  parentId: string | null;
  level: number;
}

type MindMapProps = {
  nodes: MindMapNode[];
  onNodeClick: (nodeId: string) => void;
  onNodeAdd: (parentId: string, level: number) => void;
}

type NodePosition = {
  id: string;
  x: number;
  y: number;
}

export const MindMap = ({ nodes, onNodeClick, onNodeAdd }: MindMapProps) => {
  const [renderedNodes, setRenderedNodes] = useState<MindMapNode[]>(nodes);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const positionsOrigin = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const positions: NodePosition[] = [];
    renderedNodes.forEach((node) => {
      const element = nodeRefs.current[node.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        if (node.parentId === null) {
          positionsOrigin.current = { x: rect.left, y: rect.top };
        }
        positions.push({
          id: node.id,
          x: rect.left - positionsOrigin.current.x + rect.width / 2,
          y: rect.top - positionsOrigin.current.y + rect.height / 2,
        });
      }
    });
    setNodePositions(positions);
  }, [renderedNodes]);

  const getNodeChildren = (nodeId: string) => {
    return nodes.filter((node) => node.parentId === nodeId);
  };

  const renderNode = (node: MindMapNode) => {
    let children = getNodeChildren(node.id);
    if (!node.id.includes('add-child')) {
      const addChildNode: MindMapNode = {
        id: `add-child-${node.id}`,
        content: 'Add Child',
        parentId: node.id,
        level: node.level + 1
       }
      children.push(addChildNode);
    }
    if (!renderedNodes.find((n) => n.id === node.id)) {
      setRenderedNodes([...renderedNodes, node]);
    }
    const NODE_WIDTH = 144;
    const NODE_HEIGHT = 20;
    const HORIZONTAL_SPACING = 80;
    const VERTICAL_SPACING = 32;

    return (
      <div
        key={node.id}
        className="flex flex-row items-start"
      >
        <div className="flex flex-col items-center">
          {/* Use fixed width/height classes instead of min-w/min-h to ensure rendering */}
          <div
            ref={(el) => (nodeRefs.current[node.id] = el)}
            className={`text-center flex flex-row items-center justify-center min-w-[144px] h-[20px] bg-white rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onNodeClick(node.id)}
          >
            <p className='font-light text-[0.7rem] truncate' title={`${node.content}`}>{node.content}</p>
          </div>
          {node.level < 3 && (
            <button
              className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-white/80 transition-colors duration-500 shadow-md hover:shadow-lg"
              onClick={() => onNodeAdd(node.id, node.level + 1)}
            >
              <Plus size={16}/>
            </button>
          )}
        </div>
        {children.length > 0 && (
          <div className={`flex flex-col space-y-[32px] ml-16 lg:ml-[100px]`}>
            {children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const renderConnections = () => {
    return renderedNodes
      .filter((node) => node.parentId !== null)
      .map((node) => {
        const parentPosition = nodePositions.find((pos) => pos.id === node.parentId);
        const childPosition = nodePositions.find((pos) => pos.id === node.id);

        if (!parentPosition || !childPosition) return null;

        return (
          <NodeConnection
            key={`${node.parentId}-${node.id}`}
            startX={parentPosition.x}
            startY={parentPosition.y}
            endX={childPosition.x}
            endY={childPosition.y}
          />
        );
      });
  };

  return (
    <div className="relative w-full">
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {renderConnections()}
      </svg>
      <div className="relative">
        {nodes
          .filter((node) => node.parentId === null)
          .map((node) => renderNode(node))}
      </div>
    </div>
  );
};