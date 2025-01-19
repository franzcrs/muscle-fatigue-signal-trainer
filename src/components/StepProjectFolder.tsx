import { useState } from 'react'
import { Search, ChevronsUpDown, FolderOpen } from 'lucide-react'

type StepProjectFolderProps = {
  folderPath: string;
  setFolderPath: React.Dispatch<React.SetStateAction<string>>;
  isFolderOpen: boolean;
  setIsFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepProjectFolder = ({ folderPath, setFolderPath, isFolderOpen, setIsFolderOpen }: StepProjectFolderProps) => {
  const [folderName, setFolderName] = useState('Choose your folder');

  const selectFolder = () => {
    const folderPath = '.../muscle_fatigue_isometric_elbow_flexion';
    let folderName = folderPath.split('/').pop();
    folderName
      ? folderName = folderName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
      : folderName = folderPath;
    setFolderPath(folderPath);
    setFolderName(folderName);
  }

  const handlerClick = () => {
    selectFolder();
    setIsFolderOpen(true);
  }

  return (
    <div className='flex flex-col space-y-1 text-start'>
      <h2 className="font-light text-xs">
        Project Folder
      </h2>
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
          <p className='font-normal text-sm truncate'>{folderName}</p>
          <p className='font-extralight text-[11px] truncate'>{folderPath}</p>
        </div>
        <ChevronsUpDown className="flex-none text-gray-700" size={20} width={16} height={20} />
      </button>
    </div>
  )
}

export default StepProjectFolder