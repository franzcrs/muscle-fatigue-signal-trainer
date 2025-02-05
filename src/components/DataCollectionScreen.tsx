import React, { useEffect, useState } from 'react'
import { MindMapNode, MindMap } from '../lib/mindmap-comp/MindMap';
import { createNode, generateNodeId } from '../lib/mindmap';
import CustomScrollableContainer from './CustomScrollableContainer';

type DataCollectionScreenProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

type MindMapNodes = MindMapNode[];

const DataCollectionScreen = ({ isActive, setIsActive }: DataCollectionScreenProps) => {
  useEffect(() => {
    console.log('DataCollectionScreen isActive:', isActive)
  }, [isActive])

  const getMindMapsNodes = (): MindMapNodes[] => {
    // TODO: Read project folder and generate nodes
    const nodes_0 = [
      createNode('0-1', 'User 01', null, 0),
      createNode('0-2', 'Max endurance elbow flexion standing 01', '0-1', 1),
      createNode('0-3', 'Max endurance elbow flexion standing 02', '0-1', 1),
      createNode('0-4', 'Emg.csv', '0-2', 2),
      createNode('0-5', 'Body_composition.csv', '0-3', 2),
    ]
    const nodes_1 = [
      createNode('1-1', 'User 02', null, 0),
      createNode('1-2', 'Max endurance elbow flexion standing 01', '1-1', 1),
      createNode('1-3', 'Dynamic endurance bicep curls standing 01', '1-1', 1),
      createNode('1-4', 'Emg.csv', '1-2', 2),
      createNode('1-5', 'Skeleton.csv', '1-2', 2),
      createNode('1-6', 'Emg.csv', '1-3', 2),
    ]
    return [
      nodes_0,
      nodes_1,
    ];
  }

  const [mindMapsNodes, setMindMapsNodes] = useState<MindMapNodes[]>(getMindMapsNodes());

  const handleNodeClick = (nodeId: string) => {
    // You can implement node editing or other interactions here
    console.log('Node clicked:', nodeId);
  };

  async function promptNewFolder(): Promise<string | null> {
    const folderName = window.prompt("Please enter a new folder name:");
    return folderName;
  }

  const handleNodeAdd = async (parentId: string, level: number) => {
    const newFolderName = await promptNewFolder();
    if (newFolderName) {
      console.log("User entered folder name:", newFolderName);
      // You can now use newFolderName to create a folder or update state
    } else {
      console.log("No folder name was provided.");
    }

    const updateMindMapsNodes = (mindMaps: MindMapNodes[], parentId: string, level: number): MindMapNodes[] => {
      const index = parseInt(parentId.split('-')[0]);
      const newNode = createNode(
        parentId.split('-')[0] + '-' + generateNodeId(),
        `New Node ${mindMaps[index].length}`,
        parentId,
        level
      );
      const updatedMindMapNodes = [...mindMaps[index], newNode];
      return mindMaps.map((nodes, i) => i === index ? updatedMindMapNodes : nodes);
    }
    setMindMapsNodes((previousMindMapsNodes) => updateMindMapsNodes(previousMindMapsNodes, parentId, level));
    // const newNode = createNode(
    //   generateNodeId(),
    //   `New Node ${nodes.length + 1}`,
    //   parentId,
    //   level
    // );
    // setNodes([...nodes, newNode]);
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
              {mindMapsNodes.map((nodes, index) => (
                <MindMap
                  key={index}
                  nodes={nodes}
                  onNodeClick={handleNodeClick}
                  onNodeAdd={handleNodeAdd}
                  headers={index === 0 ? ['Users', 'Activities', 'Data files'] : undefined}
                />
              ))}
              <div
                style={{ margin: '0' }}
                className='min-h-[calc(100%)] invisible select-none'
              > hidden</div>
            </div>
            {/* <div className='relative inset-[100%] p-0 pr-[calc(632px+100%)] h-full overflow-visible flex flex-col space-y-16'>
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
            </div> */}
          </CustomScrollableContainer>
        </div>
      </div>
    </div>
  )
}

export default DataCollectionScreen