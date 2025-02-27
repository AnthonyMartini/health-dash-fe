import React from "react";

interface WorkoutPlanProps {
  test?: string;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({}) => {
  return (
    <div className="h-[400px] w-[400px] p-2">
      <div>
        <h1 className="text-3xl font-bold h-[60px]">Workout Plan</h1>
      </div>
    </div>
  );
};

export default WorkoutPlan;
