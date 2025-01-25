import Logo from "../assets/Muscle Fatigue Signal Trainer.svg?react";
import CustomYScrollContainer from './CustomYScrollContainer';
import { Trash2 } from 'lucide-react';

const HomeScreen = () => {
  const retrieveRecentResults = () => {
    // TODO: Convert this to a real API call
    return [
      {
        id: 1,
        folder: '.../muscle_fatigue_isometric_elbow_flexion',
        modified: '2024-09-01',
      },
      {
        id: 2,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy',
        modified: '2024-10-01',
      },
      {
        id: 3,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 4,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 5,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 6,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 7,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 8,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 9,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
      {
        id: 10,
        folder: '.../muscle_fatigue_isometric_elbow_flexion_copy_2',
        modified: '2024-10-01',
      },
    ]
  }

  const recentResults = retrieveRecentResults();

  return (
    <div className="px-8 pt-8 pb-12 space-y-3 my-auto text-center">
      <h1 className="text-xl flex items-center justify-center">
        <Logo width={300} fill={'#111827'} />
      </h1>
      <h2 className="font-extralight text-sm">
        A training tool for ML prediction of muscle fatigue signals
      </h2>
      <p className="font-extralight text-base text-gray-300">
        by Franz Chuquirachi
      </p>
      <h3 className="font-light text-xs text-left">
        Recent projects
      </h3>

      <div
        id="recent-projects-chart"
        // className="bg-gray-100 rounded-md flex flex-col divide-y divide-gray-200 min-h-[40dvh] max-h-[45vh] overflow-y-auto"
        className="bg-gray-100 rounded-md flex flex-col divide-y divide-gray-200 min-h-[273px] max-h-[47vh] overflow-y-auto custom-scrollbar"
      >
        <div
          id="recent-projects-header"
          // className="flex flex-row flex-nowrap space-x-2 px-4 pb-1 pt-2"
          className="flex flex-row flex-nowrap space-x-1 lg:space-x-2 px-4 pb-1 pt-2 bg-gradient-to-b from-gray-100 from-80% to-gray-100/20 sticky top-0"
        >
          <p className="flex-auto basis-3/5 font-extralight text-[0.7rem] text-left overflow-hidden whitespace-nowrap">
            Folder Name
          </p>
          <p className="flex-initial basis-1/5 font-extralight text-[0.7rem] text-left overflow-hidden whitespace-nowrap">
            Modified
          </p>
          <p className="flex-initial basis-[6%] font-extralight text-[0.7rem] text-center overflow-hidden whitespace-nowrap">
            Action
          </p>
        </div>
        {recentResults.map((recentResults) => (
          <div
            id="recent-projects-item"
            key={recentResults.id.toString()}
            className="flex flex-row flex-nowrap space-x-1 lg:space-x-2 p-4 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
          >
            <h3 className="flex-auto basis-3/5 font-light text-xs text-left overflow-hidden whitespace-nowrap">
              {recentResults.folder}
            </h3>
            <h3 className="flex-initial basis-1/5 font-light text-xs text-left overflow-hidden whitespace-nowrap">
              {recentResults.modified}
            </h3>
            <Trash2 className="flex-initial basis-[6%] text-gray-400 hover:text-gray-100 transition-colors duration-100" size={16} />
          </div>
        )
        )}
      </div>
    </div>
  )
}

export default HomeScreen