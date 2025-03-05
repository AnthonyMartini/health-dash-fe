import React from "react";
import SideBar from "../components/SideBar";

interface WorkoutPlanProps {
  test?: string;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({}) => {
  return (
    <div className="h-full w-full flex">
      <SideBar SelectedPage="Workout Plan" />
      <div className="h-full flex-1 p-4 overflow-clip bg-gray-100">
        <div>
          <h1 className="text-3xl font-bold h-[40px]">Welcome Back, Peter</h1>
          <h3 className="text-md font-semibold text-[#5C6670] h-[40px]">
            Here is your health overview for the day:
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
