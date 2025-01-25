import React, { useEffect } from 'react'
import CustomYScrollContainer from './CustomYScrollContainer'

type Props = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataCollectionScreen = ({ isActive, setIsActive }: Props) => {
  useEffect(() => {
    console.log('DataCollectionScreen isActive:', isActive)
  }, [isActive])

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
            <CustomYScrollContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1'>
              <h3 className="font-light text-xs text-gray-800">
                User
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Demo
              </h3>
            </CustomYScrollContainer>
          </div>
          <div className='flex-auto flex flex-col space-y-1'>
            <h5 className="font-normal text-xs text-gray-400">
              Activities
            </h5>
            <CustomYScrollContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1'>
              <h3 className="font-light text-xs text-gray-800">
                Max endurance elbow flexion standing
              </h3>
              <h3 className="font-light text-xs text-gray-800">
                Dynamic endurance bicep curls standing
              </h3>
            </CustomYScrollContainer>
          </div>
          <div className='flex-auto flex flex-col space-y-1'>
            <h5 className="font-normal text-xs text-gray-400">
              Data files
            </h5>
            <CustomYScrollContainer className='bg-gray-100 rounded px-3 py-2 h-[70px] max-h-[70px] space-y-1 overflow-y-auto'>
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
            </CustomYScrollContainer>
          </div>
        </div>
      </div>
      <div className='space-y-3 flex-1 flex flex-col'>
        <h3 className="font-light text-xs">
          Add instances and files interactively
        </h3>
        <div className='bg-gray-100 rounded-md p-2 w-full flex-1'>
        </div>
      </div>
    </div>
  )
}

export default DataCollectionScreen