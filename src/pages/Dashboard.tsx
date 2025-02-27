import React from "react";

import caloriesIcon from "../assets/calories.svg";

interface DashboardProps {
  Page?: string;
  Goals?: object; //need shape?
}
//Define Card Array
interface CardProps {
  metric: string;
  value: number;
}
const Card: React.FC<CardProps> = ({}) => {
  return (
    <div className="w-[180px] h-[130px] shadow-lg rounded-xl bg-white p-4 flex flex-col">
      <div className="w-full h-[30px] text-lg flex ">
        <span className="flex-1">Calories</span>
        <img className="w-[15px]" title="calories" src={caloriesIcon}></img>
      </div>
      <div className="w-full flex-1 text-4xl font-bold items-center flex">
        859{" "}
      </div>
      <div className="w-full h-[30px]"> </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({}) => {
  return (
    <div className="h-[400px]  w-[full] p-2 overflow-clip">
      <div>
        <h1 className="text-3xl font-bold h-[60px]">Welcome Back, Peter</h1>
        <h3 className="text-md font-semibold text-slate-700">
          Here is your health overview for the day:
        </h3>
        <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
          <Card metric="calories" value={858} />
          <Card metric="calories" value={858} />
          <Card metric="calories" value={858} />
          <Card metric="calories" value={858} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
