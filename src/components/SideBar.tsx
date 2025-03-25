import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgGym } from "react-icons/cg";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { apiRequest } from "../utils/APIService";

interface SideBarProps {
  SelectedPage?: string;
}

interface Goal {
  title: string;
  status: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ SelectedPage }) => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Start loading
      try {
        const result = await apiRequest("GET_GOALS");
        console.log("API Result:", result); // ✅ Check full response structure

        // ✅ Extract the goals correctly from the nested structure
        if (
          result &&
          result.data &&
          Array.isArray(result.data) &&
          result.data[0]?.goal
        ) {
          setGoals(result.data[0].goal);
        } else {
          console.warn("Unexpected data structure:", result);
          setGoals([]);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
        setGoals([]);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    }
    fetchData();
  }, []);

  const handleToggleGoal = (index: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal, i) =>
        i === index ? { ...goal, status: !goal.status } : goal
      )
    );
  };

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

        {loading ? (
          // ✅ Activity Indicator (spinner)
          <div className="flex justify-center items-center w-full py-10">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#DF1111] rounded-full animate-spin"></div>
          </div>
        ) : goals.length > 0 ? (
          <>
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
                    <FaCheckSquare
                      className="text-[#34C759] w-6 h-6 cursor-pointer"
                      onClick={() => handleToggleGoal(index)}
                    />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-[14px] mt-4">
            No goals found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
