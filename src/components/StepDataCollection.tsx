import { useEffect, useState } from 'react'
import { CornerDownRight, Folder } from 'lucide-react'
import { exists, readDir, mkdir } from '@tauri-apps/plugin-fs';

type StepDataCollectionProps = {
  projectFolderPath: string;
  isFolderOpen: boolean;
  setIsFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Reads the contents of the specified project folder.
 *
 * @param projectFolderPath - The path to the project folder.
 */
async function readProjectFolder(projectFolderPath: string) {
  console.log('Reading project folder:', projectFolderPath);
  const entries = await readDir(projectFolderPath, {});
  for (const entry of entries) {
    console.log('Entry:', entry);
  }
}

const StepDataCollection = ({ projectFolderPath, isFolderOpen, setIsFolderOpen }: StepDataCollectionProps) => {
  const [changeOpacity, setChangeOpacity] = useState(false);

  /**
   * Searches for the 'data_collection' folder within the project folder.
   */
  const searchDataCollectionFolder = async () => {
    const folderExists = await exists(`${projectFolderPath}/data_collection`, {});
    console.log('Data collection folder exists:', folderExists);
    setIsFolderOpen(folderExists);
  }

  useEffect(() => {
    // Define an async initialize function inside useEffect
    const initialize = async () => {
      // await readProjectFolder(projectFolderPath);
      await searchDataCollectionFolder();
      setChangeOpacity(true); // Trigger opacity change after initialization
    };
    initialize();
  }, []);

  const handlerCreateFolder =  async () => {
    await mkdir(`${projectFolderPath}/data_collection`, {});
    searchDataCollectionFolder();
  }

  return (
    <div
      className={`flex flex-col space-y-1 text-start transition-opacity duration-200 ease-in-out ${changeOpacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <h3 className="font-light text-xs">
        Data Collection
      </h3>
      <div
        className={`transition-colors duration-300 rounded py-2 px-3 flex flex-col space-y-2 ${ isFolderOpen ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        <div className='flex flex-row flex-nowrap space-x-2 items-center'>
          <CornerDownRight className='text-gray-700' width={18} />
          {isFolderOpen ? (
            <div className='flex flex-row flex-nowrap space-x-2 items-center'>
              <Folder size={18} />
              <h4 className='font-normal text-sm truncate'>Data collection</h4>
            </div>
          ) : (
            <p className='font-extralight text-[0.7rem]'>
              No Data collection folder could be found
            </p>
          )}
        </div>
        {!isFolderOpen && (
          <button
            onClick={handlerCreateFolder}
            className='bg-white transition-colors duration-300 hover:bg-gray-400/50 p-2 rounded-sm text-gray-900 hover:text-white font-light text-[0.7rem]'>
            Create folder
          </button>
        )}
      </div>
    </div>
  )
}

export default StepDataCollection