import React, { useEffect, useState } from 'react'
import { MindMapNode, MindMap } from '../lib/mindmap-comp/MindMap';
import { createNode, generateNodeId } from '../lib/mindmap';
import CustomScrollableContainer from './CustomScrollableContainer';

type DataCollectionScreenProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataCollectionScreen = ({ isActive, setIsActive }: DataCollectionScreenProps) => {
  useEffect(() => {
    console.log('DataCollectionScreen isActive:', isActive)
  }, [isActive])

  const getInitialNodes = (): MindMapNode[] => {
    return [
      createNode('1', 'Root Node', null, 0),
      createNode('2', 'Child 1', '1', 1),
      createNode('3', 'Child 2', '1', 1),
      createNode('4', 'Subchild 1', '2', 2),
      createNode('5', 'Subchild 2', '3', 2),
    ];
  }

  const [nodes, setNodes] = useState<MindMapNode[]>(getInitialNodes());

  const handleNodeClick = (nodeId: string) => {
    // You can implement node editing or other interactions here
    console.log('Node clicked:', nodeId);
  };

  const handleNodeAdd = (parentId: string | null, level: number) => {
    const newNode = createNode(
      generateNodeId(),
      `New Node ${nodes.length + 1}`,
      parentId,
      level
    );
    setNodes([...nodes, newNode]);
  };

  return (
    <div className={`px-8 pt-3 pb-12 space-y-5 flex-1 flex flex-col ${isActive ? 'opacity-100' : 'opacity-50'}`}>
      <div className='space-y-3'>
        <h3 className="font-light text-xs">
          Register the allowed instances names for each of the following collections
        </h3>
        <div className='flex flex-row flex-nowrap space-x-4 lg:space-x-8'>
          <div className='flex-auto flex flex-col space-y-1'>
            <h5 className="font-normal text-xs text-gray-400">
              Roles
            </h5>
            <CustomScrollableContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1'>
              <h3 className="font-light text-xs text-gray-800">
                User
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Demo
              </h3>
            </CustomScrollableContainer>
          </div>
          <div className='flex-auto flex flex-col space-y-1'>
            <h5 className="font-normal text-xs text-gray-400">
              Activities
            </h5>
            <CustomScrollableContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1'>
              <h3 className="font-light text-xs text-gray-800">
                Max endurance elbow flexion standing
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Dynamic endurance bicep curls standing
              </h3>
            </CustomScrollableContainer>
          </div>
          <div className='flex-auto flex flex-col space-y-1'>
            <h5 className="font-normal text-xs text-gray-400">
              Data files
            </h5>
            <CustomScrollableContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1'>
              <h3 className="font-light text-xs text-gray-800">
                Emg
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Skeleton
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Body composition
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Body composition
              </h3>
            </CustomScrollableContainer>
          </div>
        </div>
      </div>
      <div className='space-y-3 flex-1 flex flex-col'>
        <h3 className="font-light text-xs">
          Add instances and files interactively
        </h3>
        <div className='relative bg-gray-100 rounded-md p-2 flex-1'>
          {/* Canvas */}
          <CustomScrollableContainer
            className='absolute left-0 top-0 w-full h-full'
            scrollbars={true}
            enablePan={true}
          >
            {/* TODO: Create project json containing registered instance names
                TODO: Generate initial nodes reading directories and files with tauri API */}
            <div className='relative inset-[100%] p-0 pr-[calc(632px+100%)] h-full overflow-visible flex flex-col space-y-16'>
              <MindMap
                nodes={nodes}
                onNodeClick={handleNodeClick}
                onNodeAdd={handleNodeAdd}
                headers={['Users', 'Activities', 'Data files']}
              />
              <MindMap
                nodes={nodes}
                onNodeClick={handleNodeClick}
                onNodeAdd={handleNodeAdd}
              />
              <div 
              style={{ margin: '0' }} 
              className='min-h-[calc(100%)] invisible select-none'
              > hidden</div>
            </div>
          </CustomScrollableContainer>
        </div>
      </div>
    </div>
  )
}

export default DataCollectionScreen