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
    ],
  },
];

//Define Card Array
interface CardProps {
  metric: string;
  value: number;
  icon: ReactElement;
  trend: number;
}
const Card: React.FC<CardProps> = ({ metric, value, icon, trend }) => {
  return (
    <div className="sm:w-[180px] w-[145px] h-[130px] shadow-lg rounded-xl bg-white p-3 flex flex-col">
      <div className="w-full h-[30px] text-lg flex text-[#5C6670] ">
        <span className={`flex-1 text-[16px] sm:text-[18px]`}>{metric}</span>
        <div className="hidden sm:hidden">{icon}</div>
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
    <div className="h-full w-full flex md:flex-row flex-col ">
      <SideBar SelectedPage="Dashboard" />
      <div className="h-full flex-1 p-4 overflow-clip bg-gray-100 overflow-y-scroll">
        <div>
          <h1 className="text-3xl font-bold h-[40px]">Welcome Back, Peter</h1>
          <h3 className="text-md font-semibold text-[#5C6670] h-[40px]">
            Here is your health overview for the day:
          </h3>
          <div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <Card
                metric="Calories Burnt"
                value={858}
                icon={<FaFire fill="#fc7703" />}
                trend={13.1}
              />
              <Card
                metric="Steps"
                value={858}
                icon={<IoFootsteps />}
                trend={-2.1}
              />
              <Card
                metric="Sleep Duration"
                value={858}
                icon={<GiNightSleep fill="#c603fc" />}
                trend={1.8}
              />
              <Card
                metric="Water Intake"
                value={858}
                icon={<IoIosWater fill="#5555FF" />}
                trend={5.3}
              />
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <div className="w-[380px] h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
                <span className="text-[#5C6670] text-lg font-semibold">
                  Weight
                </span>
                <div className="w-full flex-1 border-2 rounded-lg border-blue-400">
                  <IoIosWater />
                </div>
              </div>
              <div className="sm:w-[380px] sm:h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
                <span className="text-[#5C6670] text-lg font-semibold">
                  Macros
                </span>
                <div className="w-full flex-1 border-2 rounded-lg border-blue-400"></div>
              </div>
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <div className="w-[380px] h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6670] text-lg font-semibold">
                    Today's Consumption
                  </span>
                  <span className="text-red-500">+ Add</span>
                </div>
                <div className="w-full flex-1 rounded-lg  gap-2 flex flex-col p-2">
                  {Consumption.map((item) => (
                    <div className="w-full h-[50px] flex items-center shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg">
                      {item.type === "food" ? (
                        <FaBowlFood fill="#964B00" />
                      ) : (
                        <RiDrinks2Fill fill="blue" />
                      )}
                      <div className="flex-1 ">
                        <span className="font-semibold">{item.name}</span>
                        <div className="flex text-sm font-bold gap-2 ">
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
                      <span className="font-bold ">{item.calories} kCal </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[380px] h-[380px] bg-white shadow-lg rounded-xl p-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6670] text-lg font-semibold">
                    Today's Workout Plan
                  </span>
                  <span className="text-red-500">Edit Workout Plan</span>
                </div>
                <div className="w-full flex-1 rounded-lg  gap-2 flex flex-col p-2">
                  {Workouts.map((workout) => (
                    <div className="w-full flex flex-col shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg">
                      <div className="flex-1 flex">
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
                        <span className=" flex-1 text-right text-red-500">
                          Log Plan
                        </span>
                      </div>
                      <div className="flex flex-col text-sm font-bold gap-2 ">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
