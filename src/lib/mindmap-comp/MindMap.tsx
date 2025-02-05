import React, { useRef, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { NodeConnection } from './NodeConnection';

const NODE_WIDTH = 134;
const NODE_WIDTH_LG = 244;
const NODE_HEIGHT = 20;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 32;

export type MindMapNode = {
  id: string;
  content: string;
  parentId: string;
  level: number;
}

type MindMapProps = {
  nodes: MindMapNode[];
  onNodeClick: (nodeId: string) => void;
  onNodeAdd: (parentId: string, level: number) => void;
  headers?: string[];
}

type NodePosition = {
  id: string;
  x: number;
  y: number;
}

export const MindMap = ({ nodes, onNodeClick, onNodeAdd, headers = [] }: MindMapProps) => {
  const [renderedNodes, setRenderedNodes] = useState<MindMapNode[]>(nodes);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const positionsOrigin = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    :root {
      --node-width: ${NODE_WIDTH}px;
      --node-width-lg: ${NODE_WIDTH_LG}px;
      --node-height: ${NODE_HEIGHT}px;
      --horizontal-spacing: ${HORIZONTAL_SPACING}px;
      --vertical-spacing: ${VERTICAL_SPACING}px;
    }`;
    // Append style to document head
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    }
  }, []);

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

  function renderNode(node: MindMapNode) {
    let children = getNodeChildren(node.id);
    if (!node.id.includes('add-child') && node.level < 2) {
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

    return (
      <div
        key={node.id}
        className="flex flex-row items-start"
      >
        <div className="flex flex-col items-center">
          <div
            ref={(el) => (nodeRefs.current[node.id] = el)}
            // style={node.content.length > 35 ? {
            //   width: 'var(--node-width-lg)',
            //   minHeight: 'var(--node-height)'
            // } : {
            //   width: 'var(--node-width)',
            //   minHeight: 'var(--node-height)'
            // }}
            style={node.content.length > 35 ? {
              width: `${NODE_WIDTH_LG}px`,
              minHeight: `${NODE_HEIGHT}px`
            } : {
              width: `${NODE_WIDTH}px`,
              minHeight: `${NODE_HEIGHT}px`
            }}
            className={`group text-center flex flex-row items-center justify-center rounded-full cursor-pointer transition-all ${node.id.includes('add-child') ? 'bg-gray-100 border-gray-400/70 border-dashed border-2 hover:border-3 hover:scale-105 origin-center' : 'bg-white shadow-md hover:shadow-lg'}`}
            onClick={node.id.includes('add-child') ? (() => onNodeAdd(node.parentId, node.level)) : (() => onNodeClick(node.id))}
          >
            <p
              className={`font-light text-[0.7rem] truncate transition-opacity ${node.id.includes('add-child') ? 'group-hover:opacity-0 text-gray-400/70' : ''}`}
              title={`${node.content}`}
            >
              {node.content}
            </p>
            {node.id.includes('add-child') && (
              <Plus
                className={`absolute text-gray-400 opacity-0 transition-opacity ${node.id.includes('add-child') ? 'group-hover:opacity-100' : 'hidden'}`}
                size={18} />
            )}
          </div>
          {/* {node.level < 3 && (
            <button
              className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-white/80 transition-colors duration-500 shadow-md hover:shadow-lg"
              onClick={() => onNodeAdd(node.id, node.level + 1)}
            >
              <Plus size={16}/>
            </button>
          )} */}
        </div>
        {children.length > 0 && (
          <div className={`flex flex-col space-y-[var(--vertical-spacing)] ml-[var(--horizontal-spacing)]`}>
          {/* <div className={`flex flex-col space-y-[${VERTICAL_SPACING}px] ml-[${HORIZONTAL_SPACING}px]`}> */}
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
    <div className="relative">
      <svg className="absolute inset-0 pointer-events-none overflow-visible">
        {renderConnections()}
      </svg>
      <div className={`absolute top-[-25px] flex flex-row space-x-[var(--horizontal-spacing)]`}>
        {/* TODO: Change the width of the headers according to the width of nodes */}
        {headers.map((header, index) => (
          <h5 
          key={index} 
          style={nodes
            .filter((node) => node.level === index)
            .map((node) => node.content)
            .reduce((allLong, content) => allLong || content.length > 35, false) ? {
              width: `${NODE_WIDTH_LG}px`
            } : {
              width: `${NODE_WIDTH}px`
            }}
          className='font-normal text-xs text-gray-400/70'>
            {header || ''}
          </h5>
        ))}
      </div>
      <div className="relative">
        {nodes
          .filter((node) => node.parentId === null)
          .map((node) => renderNode(node))}
      </div>
    </div>
  );
};