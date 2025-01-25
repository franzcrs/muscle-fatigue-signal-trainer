import { useState } from 'react'
import { Search, ChevronsUpDown, FolderOpen } from 'lucide-react'
import { open } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, resourceDir, dirname } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/core';

type StepProjectFolderProps = {
  folderPath: string;
  setFolderPath: React.Dispatch<React.SetStateAction<string>>;
  isFolderOpen: boolean;
  setIsFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Resolves all directories defined in the API's Path BaseDirectory enum.
 */
async function resolveAllDirectories() {
  const promises = Object.values(BaseDirectory)
    .filter((value) => typeof value === 'number') // Filter numeric values (enum entries)
    .map((directory) =>
      invoke('plugin:path|resolve_directory', { directory })
        .then((path) => ({ directory, path }))
        .catch((error) => ({ directory, error: error.message }))
    );

  const results = await Promise.all(promises);

  results.forEach((result) => {
    if ('path' in result) {
      console.log(`Directory ${result.directory}: ${result.path}`);
    } else if ('error' in result) {
      console.error(`Error resolving directory ${result.directory}: ${result.error}`);
    }
  });
}

const StepProjectFolder = ({ folderPath, setFolderPath, isFolderOpen, setIsFolderOpen }: StepProjectFolderProps) => {
  const [folderName, setFolderName] = useState('Choose your folder');
  const [reducedFolderPath, setReducedFolderPath] = useState('.../your_project_folder_path');
  // const [tooltipFolderPath, setTooltipFolderPath] = useState('');

  const selectFolder = async (absoluteFolderPath: string | null) => {
    // const absoluteFolderPath = '.../muscle_fatigue_isometric_elbow_flexion';
    if (!absoluteFolderPath) return;
    setFolderPath(absoluteFolderPath);
    // setTooltipFolderPath(absoluteFolderPath);
    let folderName = absoluteFolderPath.split('/').pop();
    const folderParent = await dirname(absoluteFolderPath)
      .then((path) => path.split('/').pop())
      .catch((error) => console.error(error));
    setReducedFolderPath('.../' + folderParent as string + '/' + folderName);
    folderName
      ? folderName = folderName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
      : folderName = reducedFolderPath;
    setFolderName(folderName);
    console.log('Folder path set to:', absoluteFolderPath);
    console.log('Folder name set to:', folderName);
    if (!isFolderOpen) { setIsFolderOpen(true) };
  }

  const handlerClick = async () => {
    // Evaluate the retrievable directories from path API
    console.log('Verify the BaseDirectory Members at: https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/path.ts');
    resolveAllDirectories();
    // Resolve the resource directory which is also the root folder of the binary
    const resourceDirPath = await resourceDir();
    console.log('api.path.resourceDir()', resourceDirPath);
    // Open a Directory selection dialog
    const directoryPath = await open({
      canCreateDirectories: true,
      // defaultPath: '/Users/franz/Documents/master_thesis/muscle-fatigue-signal-trainer',
      defaultPath: resourceDirPath,
      directory: true,
      multiple: false,
      title: 'Confirm your project folder',
    });
    console.log('plugin-dialog.open()', directoryPath);
    // Set the project folder according to the user selection
    selectFolder(directoryPath);
  }

  return (
    <div className='flex flex-col space-y-1 text-start'>
      <h3 className="font-light text-xs">
        Project Folder
      </h3>
      <button
        onClick={handlerClick}
        className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300 rounded p-2 flex flex-row flex-nowrap space-x-2 items-center"
      >
        <div className="p-2 bg-gray-100 rounded-sm flex-none">
          {isFolderOpen ? (
            <FolderOpen className="text-gray-700" size={22} />
          ) : (
            <Search className="text-gray-700" size={22} />
          )}
        </div>
        <div className='flex-auto overflow-hidden text-left truncate'>
          <h4 className='font-normal text-sm truncate'>{folderName}</h4>
          <p className='font-extralight text-[0.7rem] truncate' title={`${folderPath}`}>{reducedFolderPath}</p>
        </div>
        <ChevronsUpDown className="flex-none text-gray-700" size={20} width={16} height={20} />
      </button>
    </div>
  )
}

export default StepProjectFolder