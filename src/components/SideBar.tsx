import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgGym } from "react-icons/cg";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { apiRequest, ApiOptions } from "../utils/APIService";
import { fetchUserAttributes } from "@aws-amplify/auth";

// Mock Data
const MOCK_DATA = {
  username: "001",
  goal: [
    { title: "100 pushups", status: true },
    { title: "10000 steps", status: true },
    { title: "Log health data 5 days in a row", status: false },
  ],
};

const testHealthDataTables = async () => {
  try {
    const data = await apiRequest("LIST_TABLE");
    console.log("Health Data Tables:", data.json());
  } catch (error) {
    console.error("Error fetching health data tables:", error);
  }
};

interface SideBarProps {
  SelectedPage?: string;
}

const SideBar: React.FC<SideBarProps> = ({ SelectedPage }) => {
  const navigate = useNavigate();

  // ✅ Manage goal state to reflect updates
  const [goals, setGoals] = useState(MOCK_DATA.goal);

  // ✅ Handle checkbox click event
  const handleToggleGoal = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index].status = !updatedGoals[index].status;
    setGoals(updatedGoals);

    console.log(
      `Goal "${updatedGoals[index].title}" toggled to:`,
      updatedGoals[index].status
    );

    // ✅ Test the API call after toggling
    testHealthDataTables();
  };

  /*
  useEffect(() => {
    //WIP
    async function fetchData() {
      const hold = await fetchUserAttributes();
      try {
        const result = await apiRequest("GET_GOALS", {
          queryParams: { username: hold?.sub, date: "2025-03-06" },
        });
        setGoals(result.data);
      } catch {
        setGoals(MOCK_DATA.goal);
      }
    }
    fetchData();
  }, []);
*/
  const buttons = [
    {
      page: "Dashboard",
      icon: <LuLayoutDashboard />,
      selected: true,
      path: "/dashboard",
    },
    {
      page: "Workout Plan",
      icon: <CgGym />,
      selected: false,
      path: "/workout-plan",
    },
  ];

  return (
    <div className="bg-white md:h-full flex-shrink-0 md:w-auto min-w-[150px] max-w-[300px] w-full flex md:flex-col items-center gap-[10px] py-[20px] px-5 justify-center md:justify-start">
      {/* Navigation Buttons */}
      {buttons.map((item, index) => (
        <button
          key={`item-${index}`}
          className={`${
            item.page === SelectedPage
              ? "bg-[#FCE9E9] hover:bg-[#FCE9E9] text-[#DF1111]"
              : "bg-[#FFFFFF] hover:bg-[#FCE9E9] text-[#DF1111]"
          } sm:w-[230px] w-[150px] h-[44px] rounded-[10px] flex gap-[10px] items-center p-2 cursor-pointer`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          {item.page}
        </button>
      ))}

      {/* Goals Section */}
      <div className="flex flex-col items-center w-full mt-6">
        {/* Header */}
        <div className="flex justify-between items-center w-[230px] mb-4">
          <span className="text-[#DF1111] font-semibold text-[16px]">
            Goals
          </span>
          <button className="text-[#FF3B30] text-[16px] hover:underline">
            + Add Goal
          </button>
        </div>

        {/* In Progress Goals */}
        <div className="bg-gray-50/90 bg-opacity-30 rounded-[15px] p-[10px] w-[230px] mb-4">
          <span className="text-[#FF3B30] text-[16px] font-normal mb-2">
            In Progress:
          </span>
          {goals
            .filter((goal) => !goal.status)
            .map((goal, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-2"
              >
                <span className="text-[12px] text-black leading-[16px] w-[156px]">
                  {goal.title}
                </span>
                {/* ✅ Add click event to toggle the state */}
                <FaRegSquare
                  className="text-[#FF3B30] w-6 h-6 cursor-pointer"
                  onClick={() => handleToggleGoal(index)}
                />
              </div>
            ))}
        </div>

        {/* Completed Goals */}
        <div className="bg-gray-50/90 bg-opacity-30 rounded-[15px] p-[10px] w-[230px]">
          <span className="text-[#34C759] text-[16px] font-normal mb-2">
            Completed:
          </span>
          {goals
            .filter((goal) => goal.status)
            .map((goal, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-2"
              >
                <span className="text-[12px] text-black leading-[16px] w-[156px]">
                  {goal.title}
                </span>
                {/* ✅ Add click event to toggle the state */}
                <FaCheckSquare
                  className="text-[#34C759] w-6 h-6 cursor-pointer"
                  onClick={() => handleToggleGoal(index)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
