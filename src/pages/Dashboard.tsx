import React, { ReactElement, useState, useEffect } from "react";
import { IoFootsteps } from "react-icons/io5";
import { IoIosWater } from "react-icons/io";
import { GiNightSleep } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { RiDrinks2Fill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import SideBar from "../components/SideBar";
import { CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import { apiRequest, ApiRoute } from "../utils/APIService";

import { FoodItemProps, WorkoutPlanProps, DashboardDataProps } from "../utils";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
interface DashboardProps {
  Page?: string;
}

//removes unwanted properties from data to send to api
const filterData = (data: any): DashboardDataProps => {
  return {
    day_calories: data.day_calories ?? 0,
    day_steps: data.day_steps ?? 0,
    day_food: Array.isArray(data.day_food) ? data.day_food : [],
    day_workout_plan: Array.isArray(data.day_workout_plan)
      ? data.day_workout_plan
      : [],
    day_macros: {
      protein: data.day_macros?.protein ?? 0,
      carb: data.day_macros?.carb ?? 0,
      fat: data.day_macros?.fat ?? 0,
    },
    day_water: data.day_water ?? 0,
    day_sleep: data.day_sleep ?? 0,
    day_weight: data.day_weight ?? 0,
  };
};

//Define Card Array
interface MetricCardProps {
  metric: string;
  units: string;
  value: number;
  icon: ReactElement;
  trend: number;
  setMetric: (metric: string) => void;
}
const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  value,
  icon,
  trend,
  units,
  setMetric,
}) => {
  return (
    <div className="w-[145px] sm:w-[180px] xl:w-[220px] h-[110px] sm:h-[130px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-xl bg-white p-3 flex flex-col">
      <div className="w-full h-[30px] text-lg flex text-[#5C6670] ">
        <span className={`flex-1 text-[16px] sm:text-[18px]`}>{metric}</span>
        <div className="hidden sm:block">{icon}</div>
      </div>
      <div className="w-full flex-1  items-end flex gap-1 ">
        <span className="text-3xl sm:text-4xl font-bold">{value}</span>
        {units && <span className="text-slate-500 font-bold">{units}</span>}
        <CiEdit
          onClick={() => setMetric(metric)}
          className="w-[18px] h-[18px] cursor-pointer"
        />
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
  action?: () => void;
}
const ContentCard: React.FC<ContentCardProps> = ({
  content,
  title,
  actionText,
  action,
}) => {
  return (
    <div className="w-[310px] sm:w-[380px] xl:w-[460px] min-h-[310px] sm:min-h-[380px] xl:min-h-[460px] bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-xl p-2 flex flex-col">
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

const Dashboard: React.FC<DashboardProps> = () => {
  const [logMetric, setLogMetric] = useState("");
  const [logMetricValue, setLogMetricValue] = useState(0.0);
  const [logConsumption, setLogConsumption] = useState(false);
  const [logConsumptionValue, setLogConsumptionValue] = useState({
    title: "",
    macros: { protein: 0.0, carb: 0.0, fat: 0.0 },
    calories: 0.0,
  });
  const [logPlan, setLogPlan] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] =
    useState<FetchUserAttributesOutput | null>(null);
  const [data, setData] = useState<DashboardDataProps>(filterData({}));

  //On screen load, grab user details and health data
  useEffect(() => {
    async function fetchData() {
      const hold = await fetchUserAttributes();
      setUserDetails(hold);
      try {
        const result = await apiRequest("GET_HEALTH_DATA", {
          queryParams: { date: "2025-03-06" },
        });
        setData(filterData(result.data));
      } catch {
        //blank data
        setData(filterData({}));
      }
    }

    fetchData();
  }, []);

  //Update DB with new data
  async function updateDB(update: DashboardDataProps) {
    await apiRequest("UPDATE_HEALTH_DATA", {
      queryParams: {
        date: "2025-03-06",
      },
      body: update,
    });
  }

  const Consumption: FoodItemProps[] | undefined = data?.day_food;
  const Workouts: WorkoutPlanProps[] | undefined = data?.day_workout_plan;
  return (
    <div className="h-full w-full flex md:flex-row flex-col ">
      <SideBar SelectedPage="Dashboard" />
      <div className="h-full flex-1 p-4 overflow-clip bg-gray-50/90 overflow-y-scroll">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold h-[40px]">
            Welcome Back, {userDetails?.name}
          </h1>
          <h3 className=" text-[13px] sm:text-[18px] font-semibold text-[#5C6670] h-[40px]">
            Here is your health overview for the day:
          </h3>
          <div>
            <div className="flex flex-row gap-[20px] w-full  justify-center flex-wrap ">
              <MetricCard
                metric="Calories Burnt"
                value={data?.day_calories ?? 0}
                icon={<FaFire fill="#fc7703" />}
                trend={13.1}
                units=""
                setMetric={() => setLogMetric("Calories")}
              />
              <MetricCard
                metric="Steps"
                value={data?.day_steps ?? 0}
                icon={<IoFootsteps />}
                trend={-2.1}
                units=""
                setMetric={() => setLogMetric("Steps")}
              />
              <MetricCard
                metric="Sleep Duration"
                value={data?.day_sleep ?? 0}
                icon={<GiNightSleep fill="#c603fc" />}
                trend={1.8}
                units="h"
                setMetric={() => setLogMetric("Sleep")}
              />
              <MetricCard
                metric="Water Intake"
                value={data?.day_water ?? 0}
                icon={<IoIosWater fill="#5555FF" />}
                trend={5.3}
                units="L"
                setMetric={() => setLogMetric("Water")}
              />
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <ContentCard
                title="Weight"
                content={
                  <div>
                    <h2>Amazon Quicksight visual to be implemented</h2>
                    <div className="w-full h-[200px] flex justify-center items-end ">
                      <button
                        title="log weight"
                        className="bg-red-400 p-2 rounded-2xl h-[40px] cursor-pointer "
                        onClick={() => setLogMetric("Weight")}
                      >
                        Log Weight
                      </button>
                    </div>
                  </div>
                }
              />
              <ContentCard
                title="Macros"
                content={<div>Amazon Quicksight visual to be implemented</div>}
              />
            </div>
            <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap ">
              <ContentCard
                title="Today's Consumption"
                action={() => setLogConsumption(true)}
                actionText="+ Add"
                content={
                  <div className="w-full  flex-1 rounded-lg  gap-2 flex flex-col p-2">
                    {Consumption?.map((item, index) => (
                      <div
                        key={`item-${index}`}
                        className="w-full h-[50px] text-[11px] sm:text-[14px] flex items-center shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg "
                      >
                        {item.title === "food" ? (
                          <FaBowlFood fill="#964B00" />
                        ) : (
                          <RiDrinks2Fill fill="blue" />
                        )}
                        <div className="flex-1 ">
                          <span className="font-semibold">{item.title}</span>
                          <div className="flex font-bold gap-2 ">
                            <span className="text-[#FFA500]">
                              {item.macros.protein}g protein
                            </span>
                            <span className="text-[#007AFF]">
                              {item.macros.carb}g carbs
                            </span>
                            <span className="text-[#AF52DE]">
                              {item.macros.fat}g fat
                            </span>
                          </div>
                        </div>
                        <span className="font-bold ">
                          {item.calories} kCal{" "}
                        </span>
                        <CiTrash
                          size={20}
                          color="red"
                          className="cursor-pointer"
                          onClick={() => {
                            setData((prev) => {
                              const updatedData: DashboardDataProps = {
                                ...prev,

                                day_food: prev.day_food.filter(
                                  (rem, idx) =>
                                    idx !==
                                    prev.day_food.findIndex(
                                      (rem) => rem.title === item.title
                                    )
                                ),
                              };

                              // Call API immediately after updating state
                              updateDB(updatedData);

                              return updatedData; // Ensure the new state is returned
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                }
              />
              <ContentCard
                title="Today's Workout Plan"
                actionText="Edit Workout Plan"
                action={() => navigate("/workout-plan")}
                content={
                  <div className="w-full flex-1 rounded-lg  gap-2 flex flex-col p-2 ">
                    {Workouts?.map((workout, index) => (
                      <div
                        key={`item-${index}`}
                        className="w-full flex flex-col shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg "
                      >
                        <div className="flex-1 flex text-[14px] sm:text-[16px]">
                          <span className="font-semibold flex-1">
                            {workout.workout_title}
                          </span>
                          <span
                            className={`flex-1 ${
                              workout.status //=== "Completed"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {workout.status ? "Completed" : "Not Completed"}
                          </span>
                          <span
                            className=" flex-1 text-right text-red-500 hover:underline hover:cursor-pointer"
                            onClick={() => setLogPlan(true)}
                          >
                            Log Plan
                          </span>
                        </div>
                        <div className="flex flex-col text-sm font-bold gap-2 text-[12px] sm:text-[14px]">
                          {workout.exercises.map((item, index) => (
                            <div
                              key={`item-${index}`}
                              className="text-[#FFA500] bg-[#FCF2E9] h-[30px] flex items-center rounded-lg px-2"
                            >
                              <span className="flex-1">{item.title}</span>
                              <span className="">
                                {item.set_count}{" "}
                                {workout.workout_title === "cardio" //Wrong
                                  ? "minutes"
                                  : "sets"}
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
      {logMetric != "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[200px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setLogMetric("")}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Log Today's {logMetric}</h2>

              <input
                type="number"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a number"
                onChange={(e) => setLogMetricValue(Number(e.target.value))}
              />
              <button
                title="Submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
                onClick={() => {
                  //update data with new values and call API
                  setData((prev) => {
                    const updatedData: DashboardDataProps = {
                      ...prev,

                      day_calories:
                        logMetric === "Calories"
                          ? logMetricValue
                          : prev.day_calories,
                      day_sleep:
                        logMetric === "Sleep" ? logMetricValue : prev.day_sleep,
                      day_steps:
                        logMetric === "Steps" ? logMetricValue : prev.day_steps,
                      day_water:
                        logMetric === "Water" ? logMetricValue : prev.day_water,
                      day_weight:
                        logMetric === "Weight"
                          ? logMetricValue
                          : prev.day_weight,
                    };

                    // Call API immediately after updating state
                    updateDB(updatedData);
                    setLogMetricValue(0);
                    setLogMetric("");

                    return updatedData; // Ensure the new state is returned
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {logConsumption && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[270px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setLogConsumption(false)}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Log Consumption</h2>
              <div className="flex flex-col text-left w-full font-bold text-gray-700">
                <label className="text-sm">Name</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  onChange={(e) => {
                    setLogConsumptionValue((prev) => {
                      const updatedData = {
                        ...prev,
                        title: e.target.value,
                      };
                      return updatedData;
                    });
                  }}
                />
              </div>

              <div className="rounded-lg  w-full flex space-x-4 text-left font-bold ">
                <div className="flex flex-col w-[80px] text-[#FFA500]">
                  <label className="text-sm">Protein</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            protein: Number(e.target.value),
                            carb: prev.macros.carb,
                            fat: prev.macros.fat,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-[#007AFF]">
                  <label className="text-sm">Carbs</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            carb: Number(e.target.value),
                            protein: prev.macros.carb,
                            fat: prev.macros.fat,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-[#AF52DE]">
                  <label className="text-sm">Fat</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            fat: Number(e.target.value),
                            carb: prev.macros.carb,
                            protein: prev.macros.fat,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-gray-700">
                  <label className="text-sm">Calories</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          calories: Number(e.target.value),
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>
              </div>

              <button
                title="Submit"
                onClick={() => {
                  setData((prev) => {
                    const updatedData: DashboardDataProps = {
                      ...prev,

                      day_food: [...prev.day_food, logConsumptionValue],
                    };

                    // Call API immediately after updating state
                    updateDB(updatedData);
                    setLogConsumption(false);
                    setLogConsumptionValue({
                      title: "",
                      macros: { protein: 0.0, carb: 0.0, fat: 0.0 },
                      calories: 0.0,
                    });

                    return updatedData; // Ensure the new state is returned
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {logPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[200px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setLogPlan(false)}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Log Today's {logMetric}</h2>

              <input
                type="number"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a number"
              />
              <button
                title="Close"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
