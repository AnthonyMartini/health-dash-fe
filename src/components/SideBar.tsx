import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgGym } from "react-icons/cg";
import { FaCheckSquare, FaRegSquare, FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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
  const [newGoal, setNewGoal] = useState<string>(""); // ✅ New goal state
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null); // ✅ Track hover state

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

  const handleToggleGoal = async (title: string) => {
    const previousGoals = [...goals];
    
    // Step 1: Update state immediately for responsive UI
    const updatedGoals = goals.map((goal) =>
      goal.title === title ? { ...goal, status: !goal.status } : goal
    );
    setGoals(updatedGoals);
  
    try {
      // Step 2: Send the entire array of goals to the backend
      await apiRequest("UPDATE_GOALS", {
        body: {
          goal: updatedGoals, // ✅ Send the whole list of goals
        },
      });
  
      console.log("Goals updated successfully!");
    } catch (error) {
      console.error("Failed to update goals:", error);
  
      // ✅ Roll back state only on real failure
      setGoals(previousGoals);
    }
  };

  // ✅ Add new goal to the list
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    setGoals((prevGoals) => [
      ...prevGoals,
      { title: newGoal, status: false },
    ]);
    setNewGoal("");
  };

  
  // ✅ Delete goal logic
  const handleDeleteGoal = async (title: string) => {
    const previousGoals = [...goals];
    const updatedGoals = goals.filter((goal) => goal.title !== title); // ✅ Remove goal from state
    setGoals(updatedGoals);

    try {
      console.log(`Deleting goal: ${title}`);
      await apiRequest("UPDATE_GOALS", {
        body: {
          goal: updatedGoals, // ✅ Send updated list after deletion
        },
      });
      console.log("Goal deleted successfully!");
    } catch (error) {
      console.error("Failed to delete goal:", error);
      setGoals(previousGoals); // ✅ Rollback on failure
    }
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
        </div>

        {/* ✅ New Goal Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAddGoal();
            }}
            className="flex-1 border border-gray-300 w-[180px] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#DF1111]"
            placeholder="Add a new goal..."
          />
          <button
            type="button"
            onClick={handleAddGoal} // ✅ Add goal on click
            className="flex items-center justify-center"
          >
            <FaCheck
              className="text-[#34C759] w-6 h-6 cursor-pointer"
            />
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
                .map((goal) => (
                  <div key={goal.title} className="flex justify-between items-center mt-2">
                    <span className="text-[12px] text-black leading-[16px] w-[156px]">
                      {goal.title}
                    </span>
                    <FaRegSquare
                      className="text-[#FF3B30] w-6 h-6 cursor-pointer"
                      onClick={() => handleToggleGoal(goal.title)}
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
                .map((goal) => (
                  <div
                    key={goal.title}
                    className="flex justify-between items-center mt-2"
                  >
                    <span className="text-[12px] text-black leading-[16px] w-[156px]">
                      {goal.title}
                    </span>
                    <button
                      onMouseEnter={() => setHoveredGoal(goal.title)}
                      onMouseLeave={() => setHoveredGoal(null)}
                      onClick={() => handleDeleteGoal(goal.title)}
                      className="flex items-center justify-center"
                    >
                      {hoveredGoal === goal.title ? (
                        <MdDelete className="text-[#FF3B30] w-6 h-6 cursor-pointer" />
                      ) : (
                        <FaCheckSquare className="text-[#34C759] w-6 h-6 cursor-pointer" />
                      )}
                    </button>
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
