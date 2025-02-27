import React from "react";

import caloriesIcon from "../assets/calories.svg";
import stepsIcon from "../assets/walking.svg";
import sleepIcon from "../assets/sleep.svg";
import waterIcon from "../assets/water.svg";
import chartImage from "../assets/chart.jpg";

interface DashboardProps {
  Page?: string;
  Goals?: object; //need shape?
}

//Define Card Array
interface CardProps {
  metric: string;
  value: number;
  icon: string;
  trend: number;
}
const Card: React.FC<CardProps> = ({ metric, value, icon, trend }) => {
  return (
    <div className="w-[180px] h-[130px] shadow-lg rounded-xl bg-white p-4 flex flex-col">
      <div className="w-full h-[30px] text-lg flex text-[#5C6670] ">
        <span className="flex-1">{metric}</span>
        <img className="w-[15px]" title="calories" src={icon}></img>
      </div>
      <div className="w-full flex-1 text-4xl font-bold items-center flex">
        {value}
      </div>
      <div
        className={`w-full h-[30px] text-[12px] font-bold flex items-center ${
          trend > 0 ? "text-green-400" : "text-red-400"
        } `}
      >
        {trend > 0 ? "↑ " : "↓ "}
        {trend}% from yesterday
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({}) => {
  return (
    <div className="h-full w-[full] p-2 overflow-clip">
      <div>
        <h1 className="text-3xl font-bold h-[40px]">Welcome Back, Peter</h1>
        <h3 className="text-md font-semibold text-[#5C6670] h-[40px]">
          Here is your health overview for the day:
        </h3>
        <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
          <Card
            metric="Calories Burnt"
            value={858}
            icon={caloriesIcon}
            trend={13.1}
          />
          <Card metric="Steps" value={858} icon={stepsIcon} trend={-2.1} />
          <Card
            metric="Sleep Duration"
            value={858}
            icon={sleepIcon}
            trend={1.8}
          />
          <Card
            metric="Water Intake"
            value={858}
            icon={waterIcon}
            trend={5.3}
          />
          <div className="w-[380px] h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
            <span className="text-[#5C6670] text-lg">Weight</span>
            <div className="w-full flex-1 border-2 rounded-lg border-blue-400">
              <img
                src={chartImage}
                title="fdsafds"
                className="w-full h-full"
              ></img>
            </div>
          </div>
          <div className="w-[380px] h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
            <span className="text-[#5C6670] text-lg">Macros</span>
            <div className="w-full flex-1 border-2 rounded-lg border-blue-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
