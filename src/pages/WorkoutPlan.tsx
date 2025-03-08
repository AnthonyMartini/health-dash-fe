import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaFireAlt } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

// Single exercise item displayed on plan cards
interface PlanItem {
  label: string;      // e.g. "Bench Press"
  detail: string;     // e.g. "3 sets" or "30 min"
  color: string;      // background color for the chip
}

// A plan card: name, influencer, optional favorite, totalCal, items array
interface Plan {
  name: string;
  influencer?: string; // e.g. "@TheRock"
  favorite?: boolean;  // whether to show the heart icon
  totalCal: number;
  items: PlanItem[];
}

// “Your Favorite Plans”
const FavoritePlans: Plan[] = [
  {
    name: "John's Push Day",
    influencer: "@JohnJohn",
    favorite: true,
    totalCal: 640,
    items: [
      { label: "DB Incline Press", detail: "3 sets", color: "#E6EEFE" },
      { label: "Tricep Extensions", detail: "3 sets", color: "#D6F5DB" },
      { label: "Lateral Raises", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
  {
    name: "God-like Push",
    influencer: "@TheRock",
    favorite: true,
    totalCal: 640,
    items: [
      { label: "Bench Press", detail: "3 sets", color: "#E6EEFE" },
      { label: "Tricep Extensions", detail: "3 sets", color: "#D6F5DB" },
      { label: "Lateral Raises", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
  {
    name: "God-like Pull",
    influencer: "@Saitama",
    favorite: true,
    totalCal: 640,
    items: [
      { label: "Cable Pull-downs", detail: "3 sets", color: "#E6EEFE" },
      { label: "Cable Rows", detail: "3 sets", color: "#D6F5DB" },
      { label: "Bicep Curls", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
];

// “Popular Plans”
const PopularPlans: Plan[] = [
  {
    name: "God-like Push",
    influencer: "@TheRock",
    totalCal: 640,
    favorite: true,
    items: [
      { label: "Bench Press", detail: "3 sets", color: "#E6EEFE" },
      { label: "Tricep Extensions", detail: "3 sets", color: "#D6F5DB" },
      { label: "Lateral Raises", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
  {
    name: "God-like Pull",
    influencer: "@Saitama",
    totalCal: 640,
    favorite: true,
    items: [
      { label: "Cable Pull-downs", detail: "3 sets", color: "#E6EEFE" },
      { label: "Cable Rows", detail: "3 sets", color: "#D6F5DB" },
      { label: "Bicep Curls", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
  {
    name: "Cardio Plan",
    influencer: "@Saitama",
    totalCal: 320,
    items: [
      { label: "Treadmill", detail: "30 min", color: "#E6EEFE" },
    ],
  },
];

// “Discover Plans”
const DiscoverPlans: Plan[] = [
  {
    name: "John's Push Day",
    influencer: "@JohnJohn",
    favorite: true,
    totalCal: 640,
    items: [
      { label: "DB Incline Press", detail: "3 sets", color: "#E6EEFE" },
      { label: "Tricep Extensions", detail: "3 sets", color: "#D6F5DB" },
    ],
  },
  {
    name: "God-like Pull",
    influencer: "@BrianGriffin",
    totalCal: 640,
    items: [
      { label: "Pull Ups", detail: "3 sets", color: "#E6EEFE" },
      { label: "Cable Rows", detail: "3 sets", color: "#D6F5DB" },
      { label: "T Bar Rows", detail: "3 sets", color: "#FCF2E9" },
    ],
  },
];

// Week plan type
interface WeeklyDayPlan {
  day: string;
  plans: string[]; // array of plan names
}

// Example “Your Week Plan”
const initialWeeklyPlan: WeeklyDayPlan[] = [
  { day: "Monday", plans: ["God-like Push", "Cardio Plan"] },
  { day: "Tuesday", plans: ["God-like Pull"] },
  { day: "Wednesday", plans: [] },
  { day: "Thursday", plans: ["God-like Push"] },
  { day: "Friday", plans: ["God-like Pull", "God-like Push"] },
  { day: "Saturday", plans: ["Cardio Plan"] },
  { day: "Sunday", plans: [] },
];

/* ------------- SMALL CARD COMPONENT ------------- */
interface SmallPlanCardProps {
  plan: Plan;
  onAddToWeekPlan?: (planName: string) => void;
}
const SmallPlanCard: React.FC<SmallPlanCardProps> = ({ plan, onAddToWeekPlan }) => (
  <div className="w-full sm:w-[250px] bg-white shadow-md rounded-xl p-3 flex flex-col gap-2">
    {/* Title & Heart */}
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-semibold text-sm">
        {plan.name}{" "}
        {plan.influencer && <span className="text-xs text-gray-500">by {plan.influencer}</span>}
      </span>
      {plan.favorite && <BsSuitHeartFill className="text-red-500" />}
    </div>

    {/* Items (chips) */}
    <div className="flex flex-wrap gap-2">
      {plan.items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg px-2 py-1 text-xs font-semibold"
          style={{ backgroundColor: item.color }}
        >
          {item.label} <span className="ml-1 text-gray-700">{item.detail}</span>
        </div>
      ))}
    </div>

    {/* Footer row: calorie + + button */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1 text-sm text-black">
        <FaFireAlt />
        <span>{plan.totalCal} cal</span>
      </div>
      {onAddToWeekPlan && (
        <button
          className="text-blue-600 text-lg hover:scale-105"
          onClick={() => onAddToWeekPlan(plan.name)}
        >
          +
        </button>
      )}
    </div>
  </div>
);

/* ------------- MAIN PAGE ------------- */
const WorkoutPlan: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyDayPlan[]>(initialWeeklyPlan);

  // Modal for adding a plan
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  // Open modal
  const handleAddToWeekPlan = (planName: string) => {
    setSelectedPlan(planName);
    setShowAddModal(true);
  };

  // Add plan to a specific day
  const handleAddPlanToDay = (day: string) => {
    const updated = weeklyPlan.map((w) =>
      w.day === day ? { ...w, plans: [...w.plans, selectedPlan] } : w
    );
    setWeeklyPlan(updated);
    setShowAddModal(false);
    setSelectedPlan("");
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <SideBar SelectedPage="WorkoutPlan" />

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Workout Plan</h1>
        <h3 className="text-sm sm:text-md font-semibold text-gray-600 mb-6">
          Customize your workouts and discover new plans
        </h3>

        {/* SECTION 1: Your Favorite Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Your Favorite Plans</h2>
            <button
              onClick={() => navigate("/create-plan")}
              className="text-red-500 text-sm hover:underline"
            >
              + Create Your Own
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {FavoritePlans.map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={handleAddToWeekPlan}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Popular Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Popular Plans</h2>
            <button
              onClick={() => navigate("/create-plan")}
              className="text-red-500 text-sm hover:underline"
            >
              + Create Your Own
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {PopularPlans.map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={handleAddToWeekPlan}
              />
            ))}
          </div>
        </div>

        {/* SECTION 3: Discover Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Discover Plans</h2>
            <button
              onClick={() => navigate("/create-plan")}
              className="text-red-500 text-sm hover:underline"
            >
              + Create Your Own
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {DiscoverPlans.map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={handleAddToWeekPlan}
              />
            ))}
          </div>
        </div>

        {/* SECTION 4: Your Week Plan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Your Week Plan</h2>
            <button
              onClick={() => {
                // e.g. open a "Log Workout" modal, or navigate somewhere
                console.log("Log Workout clicked!");
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Log Workout
            </button>
          </div>
          <div className="bg-white shadow p-4 rounded-xl">
            <div className="grid grid-cols-7 gap-3 text-sm">
              {weeklyPlan.map((wDay) => (
                <div key={wDay.day} className="flex flex-col items-center gap-2">
                  <h3 className="text-gray-600 font-bold">{wDay.day}</h3>
                  <div className="bg-white shadow p-2 rounded-lg w-full min-h-[60px] space-y-1">
                    {wDay.plans.length === 0 && (
                      <p className="text-xs text-gray-400 text-center">No plans</p>
                    )}
                    {wDay.plans.map((pName, idx) => (
                      <div
                        key={idx}
                        className="bg-red-100 text-red-500 text-xs rounded px-2 py-1 text-center font-semibold"
                      >
                        {pName}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Add a plan to a day */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-md w-[300px] h-[220px] relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setSelectedPlan("");
              }}
              className="text-red-500 absolute top-2 right-2 text-sm hover:underline"
            >
              Close
            </button>
            <h2 className="text-xl font-bold text-center mb-2">
              Add "{selectedPlan}" to…
            </h2>
            <div className="flex flex-col items-center gap-2">
              {weeklyPlan.map((dayData) => (
                <button
                  key={dayData.day}
                  onClick={() => handleAddPlanToDay(dayData.day)}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm"
                >
                  {dayData.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
