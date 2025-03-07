import React, { ReactElement } from "react";
import { IoFootsteps } from "react-icons/io5";
import { IoIosWater } from "react-icons/io";
import { GiNightSleep } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { RiDrinks2Fill } from "react-icons/ri";
import SideBar from "../components/SideBar";
import { BiDrink } from "react-icons/bi";

interface DashboardProps {
  Page?: string;
  Goals?: object; //need shape?
}

const Consumption = [
  {
    type: "food",
    name: "Eggs",
    calories: 352,
    protein: 30,
    carbs: 20,
    fat: 20,
  },
  {
    type: "drink",
    name: "Protein Shake",
    calories: 352,
    protein: 30,
    carbs: 20,
    fat: 20,
  },
];

const Workouts = [
  {
    name: "Cardio Plan",
    type: "cardio",
    status: "Completed",
    items: [{ name: "Treadmill", number: 30 }],
  },
  {
    name: "God-Like Pull",
    type: "strength",
    status: "In-Progress",
    items: [
      { name: "Cable Pull-downs", number: 3 },
      { name: "Cable Rows", number: 3 },
      { name: "Bicep Curls", number: 3 },
      { name: "Rear Delt Machine", number: 2 },
    ],
  },
];

//Define Card Array
interface MetricCardProps {
  metric: string;
  units: string;
  value: number;
  icon: ReactElement;
  trend: number;
}
const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  value,
  icon,
  trend,
  units,
}) => {
  return (
    <div className="w-[145px] sm:w-[180px] xl:w-[220px] h-[110px] sm:h-[130px] shadow-lg rounded-xl bg-white p-3 flex flex-col">
      <div className="w-full h-[30px] text-lg flex text-[#5C6670] ">
        <span className={`flex-1 text-[16px] sm:text-[18px]`}>{metric}</span>
        <div className="hidden sm:block">{icon}</div>
      </div>
      <div className="w-full flex-1  items-end flex gap-1 ">
        <span className="text-3xl sm:text-4xl font-bold">{value}</span>
        <span className="text-slate-500 font-bold">{units}</span>
      </div>
      <div
        className={`w-full h-[30px] text-[10px] sm:text-[12px] font-bold flex items-center ${
          trend > 0 ? "text-green-400" : "text-red-400"
        } `}
      >
        {trend > 0 ? "↑ " : "↓ "}
        {trend}% from yesterday
      </div>
    </div>
  );
};
interface ContentCardProps {
  content: ReactElement;
  title: string;
  actionText?: string;
  action?: () => null;
}
const ContentCard: React.FC<ContentCardProps> = ({
  content,
  title,
  actionText,
  action,
}) => {
  return (
    <div className="w-[310px] sm:w-[380px] xl:w-[460px] min-h-[310px] sm:min-h-[380px] xl:min-h-[460px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[#5C6670] text-[16px] sm:text-lg font-semibold">
          {title}
        </span>
        {actionText && (
          <span
            className="text-red-500 text-[13px] sm:text-md  hover:underline hover:cursor-pointer"
            onClick={action}
          >
            {actionText}
          </span>
        )}
      </div>
      <div className="w-full flex-1  rounded-lg">{content}</div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({}) => {
  return (
    <div className="h-full w-full flex md:flex-row flex-col ">
      <SideBar SelectedPage="Dashboard" />
      <div className="h-full flex-1 p-4 overflow-clip bg-gray-100 overflow-y-scroll">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold h-[40px]">
            Welcome Back, Peter
          </h1>
          <h3 className=" text-[13px] sm:text-[18px] font-semibold text-[#5C6670] h-[40px]">
            Here is your health overview for the day:
          </h3>
          <div>
            <div className="flex flex-row gap-[20px] w-full  justify-center flex-wrap ">
              <MetricCard
                metric="Calories Burnt"
                value={858}
                icon={<FaFire fill="#fc7703" />}
                trend={13.1}
                units=""
              />
              <MetricCard
                metric="Steps"
                value={9912}
                icon={<IoFootsteps />}
                trend={-2.1}
                units=""
              />
              <MetricCard
                metric="Sleep Duration"
                value={7.6}
                icon={<GiNightSleep fill="#c603fc" />}
                trend={1.8}
                units="h"
              />
              <MetricCard
                metric="Water Intake"
                value={2.1}
                icon={<IoIosWater fill="#5555FF" />}
                trend={5.3}
                units="L"
              />
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <ContentCard title="Weight" content={<IoIosWater />} />
              <ContentCard title="Macros" content={<IoIosWater />} />
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <ContentCard
                title="Today's Consumption"
                actionText="+ Add"
                content={
                  <div className="w-full flex-1 rounded-lg  gap-2 flex flex-col p-2">
                    {Consumption.map((item) => (
                      <div className="w-full h-[50px] text-[11px] flex items-center shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg ">
                        {item.type === "food" ? (
                          <FaBowlFood fill="#964B00" />
                        ) : (
                          <RiDrinks2Fill fill="blue" />
                        )}
                        <div className="flex-1 ">
                          <span className="font-semibold">{item.name}</span>
                          <div className="flex font-bold gap-2 ">
                            <span className="text-[#FFA500]">
                              {item.protein}g protein
                            </span>
                            <span className="text-[#007AFF]">
                              {item.carbs}g carbs
                            </span>
                            <span className="text-[#AF52DE]">
                              {item.fat}g fat
                            </span>
                          </div>
                        </div>
                        <span className="font-bold ">
                          {item.calories} kCal{" "}
                        </span>
                      </div>
                    ))}
                  </div>
                }
              />
              <ContentCard
                title="Today's Workout Plan"
                actionText="Edit Workout Plan"
                content={
                  <div className="w-full flex-1 rounded-lg  gap-2 flex flex-col p-2 ">
                    {Workouts.map((workout) => (
                      <div className="w-full flex flex-col shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg ">
                        <div className="flex-1 flex text-[14px] sm:text-[16px]">
                          <span className="font-semibold flex-1">
                            {workout.name}
                          </span>
                          <span
                            className={`flex-1 ${
                              workout.status === "Completed"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {workout.status}
                          </span>
                          <span className=" flex-1 text-right text-red-500 hover:underline hover:cursor-pointer">
                            Log Plan
                          </span>
                        </div>
                        <div className="flex flex-col text-sm font-bold gap-2 text-[12px] sm:text-[14px]">
                          {workout.items.map((item) => (
                            <div className="text-[#FFA500] bg-[#FCF2E9] h-[30px] flex items-center rounded-lg px-2">
                              <span className="flex-1">{item.name}</span>
                              <span className="">
                                {item.number}{" "}
                                {workout.type === "cardio" ? "minutes" : "sets"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
