import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { FaFireAlt } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";
import { apiRequest } from "../utils/APIService";
import { CiTrash } from "react-icons/ci";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

// Single exercise item displayed on plan cards
interface ExerciseProps {
  title: string;
  weight: Number;
  sets: Number;
  reps: Number;
}

interface PlanProps {
  workoutcard_title: string;
  workoutbucket_id: string;
  workoutcard_favcount: Number;
  workoutcard_id: string;
  username: string; // e.g. "@TheRock"
  favorite?: boolean; // whether to show the heart icon
  workoutcard_content: { exercises: ExerciseProps[] };
  trash: boolean;
}

const filterPlans = (edit: boolean, dataArray: any[]): PlanProps[] => {
  return dataArray.map((data) => ({
    workoutbucket_id: data.workoutbucket_id ?? "",
    workoutcard_favcount: data.workoutcard_favcount ?? 0,
    workoutcard_title: data.workoutcard_title ?? "",
    workoutcard_id: data.workoutcard_id ?? "",
    username: data.username ?? "",
    favorite: true,
    trash: edit,
    workoutcard_content: {
      exercises: Array.isArray(data.workoutcard_content?.exercises)
        ? data.workoutcard_content.exercises
        : [],
    },
  }));
};

const filterWeekly = (data: any): WeeklyPlan[] => {
  return [
    { day: "Monday", plans: data.MON ?? [] },
    { day: "Tuesday", plans: data.TUE ?? [] },
    { day: "Wednesday", plans: data.WED ?? [] },
    { day: "Thursday", plans: data.THU ?? [] },
    { day: "Friday", plans: data.FRI ?? [] },
    { day: "Saturday", plans: data.SAT ?? [] },
    { day: "Sunday", plans: data.SUN ?? [] },
  ];
};
const dayMapping: Record<string, string> = {
  Monday: "MON",
  Tuesday: "TUE",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
  Saturday: "SAT",
  Sunday: "SUN",
};

interface dailyPlanProps {
  workoutcard_title: string;
  workoutcard_id: string;
  workoutcard_content: { exercises: ExerciseProps[] };
}
interface WeeklyPlan {
  day: string;
  plans: dailyPlanProps[];
}

/* ------------- SMALL CARD COMPONENT ------------- */
interface SmallPlanCardProps {
  plan: PlanProps;
  onAddToWeekPlan?: (planName: string) => void;
  setConfirmDelete: (planID: string) => void;
}
const SmallPlanCard: React.FC<SmallPlanCardProps> = ({
  plan,
  onAddToWeekPlan,
  setConfirmDelete,
}) => (
  <div className="w-full sm:w-[230px] bg-white shadow-md rounded-xl p-3 flex flex-col gap-2 justify-between">
    {/* Title & Heart */}
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-black w-full">
          {plan.workoutcard_title}
        </span>
        {plan.username && (
          <span className="text-xs text-gray-500">
            by @{plan.username.slice(0, 10)}
          </span>
        )}
      </div>

      {plan.trash && <BsSuitHeartFill className="text-red-500" />}
    </div>

    {/* Items (chips) */}
    <div className="flex flex-wrap gap-1 h-[100px] overflow-y-auto px-1 content-start">
      {plan.workoutcard_content.exercises.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg px-2 py-1 text-sm font-semibold w-full h-[30px] flex bg-[#42b0f5]"
        >
          <span className="flex-1 ">{item.title}</span>

          <span className="ml-2 text-gray-700">
            {item.sets.toString()} Sets
          </span>
        </div>
      ))}
    </div>

    {/* Footer row: calorie + + button */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1 text-sm text-black">
        <div className="stroke-amber-700">
          {plan.trash && (
            <CiTrash
              size={20}
              color="red"
              className="cursor-pointer"
              onClick={() => {
                setConfirmDelete(plan.workoutcard_id);
              }}
            />
          )}
        </div>
        <FaFireAlt />
        <span>{120} cal</span>
      </div>
      {onAddToWeekPlan && (
        <button
          className="text-blue-600 text-lg hover:scale-105"
          onClick={() => onAddToWeekPlan(plan.workoutcard_title)}
        >
          +
        </button>
      )}
    </div>
  </div>
);

/* ------------- MAIN PAGE ------------- */
const WorkoutPlan: React.FC = () => {
  //User Data
  const [FavoritePlans, setFavoritePlans] = useState<PlanProps[]>(
    filterPlans(true, [])
  );
  const [discoverPlans, setDiscoverPlans] = useState<PlanProps[]>(
    filterPlans(false, [])
  );
  const [popularPlans, setPopularPlans] = useState<PlanProps[]>(
    filterPlans(false, [])
  );
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan[]>(filterWeekly([]));

  //Modal for deleting workout:
  const [confirmDelete, setConfirmDelete] = useState("");

  //Modal for creating a new workout:
  const [createWorkout, setCreateWorkout] = useState(false);
  const [exercises, setExercises] = useState([
    { title: "", sets: 0, reps: 0, weight: 0 },
  ]);
  const [workoutName, setWorkoutName] = useState("");

  // Modal for adding a plan
  const [selectedPlan, setSelectedPlan] = useState<PlanProps>({
    workoutcard_title: "",
    workoutbucket_id: "",
    workoutcard_favcount: 0,
    username: "",
    workoutcard_id: "",
    trash: false,
    workoutcard_content: { exercises: [] },
  });

  // Add plan to a specific day
  const handleAddPlanToDay = (day: string) => {
    const updated = weeklyPlan.map((w) =>
      w.day === day ? { ...w, plans: [...w.plans, selectedPlan] } : w
    );
    setWeeklyPlan(updated);
    setSelectedPlan({
      workoutcard_title: "",
      workoutbucket_id: "",
      workoutcard_favcount: 0,
      username: "",
      trash: false,
      workoutcard_id: "",
      workoutcard_content: { exercises: [] },
    });
  };

  //On screen load, grab user details and health data
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiRequest("GET_WORKOUT_CARD", {
          queryParams: { action: "user" },
        });
        setFavoritePlans(filterPlans(true, result.data));
      } catch {}
      try {
        const result2 = await apiRequest("GET_WEEKLY_PLAN", {
          queryParams: {},
        });

        setWeeklyPlan(filterWeekly(result2.data));
      } catch {}
      try {
        const result2 = await apiRequest("GET_WORKOUT_CARD", {
          queryParams: { action: "discover" },
        });
        setDiscoverPlans(filterPlans(false, result2.data.discover));
        setPopularPlans(filterPlans(false, result2.data.popular));
      } catch {}
    }

    fetchData();
  }, []);

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <SideBar SelectedPage="Workout Plan" />

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Workout Plan</h1>
        <h3 className="text-sm sm:text-md font-semibold text-gray-600 mb-6">
          Customize your workouts and discover new plans
        </h3>

        {/* SECTION 1: Your Favorite Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Your Favorite Plans
            </h2>
            <button
              onClick={() => setCreateWorkout(true)}
              className="text-red-500 text-sm hover:underline"
            >
              + Create Your Own
            </button>
          </div>
          <div className="flex flex-wrap gap-4 ">
            {FavoritePlans.map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={() => setSelectedPlan(plan)}
                setConfirmDelete={(planID) => setConfirmDelete(planID)}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Popular Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Popular Plans</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {popularPlans.slice(0, 5).map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={() => setSelectedPlan(plan)}
                setConfirmDelete={(planID) => setConfirmDelete(planID)}
              />
            ))}
          </div>
        </div>

        {/* SECTION 3: Discover Plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Discover Plans</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {discoverPlans.map((plan, idx) => (
              <SmallPlanCard
                key={idx}
                plan={plan}
                onAddToWeekPlan={() => setSelectedPlan(plan)}
                setConfirmDelete={(planID) => setConfirmDelete(planID)}
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
                <div
                  key={wDay.day}
                  className="flex flex-col items-center gap-2"
                >
                  <h3 className="text-gray-600 font-bold">{wDay.day}</h3>
                  <div className="bg-white shadow p-2 rounded-lg w-full min-h-[60px] space-y-1">
                    {wDay.plans.length === 0 && (
                      <p className="text-xs text-gray-400 text-center">
                        No plans
                      </p>
                    )}
                    {wDay.plans.map((pName, idx) => (
                      <div
                        key={idx}
                        className={`bg-red-100 text-red-500 text-xs rounded px-2 py-1 text-center font-semibold flex justify-between`}
                      >
                        <span>{pName.workoutcard_title}</span>

                        <CiTrash
                          size={16}
                          className="cursor-pointer"
                          onClick={() => {
                            async function sendData() {
                              try {
                                //delete card on DB
                                await apiRequest("DELETE_WEEKLY_PLAN", {
                                  body: {
                                    workoutcard_id: pName.workoutcard_id,
                                    day_of_week: dayMapping[wDay.day],
                                  },
                                });
                              } catch {}
                            }
                            sendData();
                            setWeeklyPlan((prevWeeklyPlan) =>
                              prevWeeklyPlan.map((day) =>
                                day.day === wDay.day
                                  ? {
                                      ...day,
                                      plans: day.plans.filter(
                                        (_, index) => index !== idx
                                      ),
                                    }
                                  : day
                              )
                            );
                          }}
                        />
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
      {selectedPlan.workoutcard_title != "" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-md w-[300px] h-[480px] relative">
            <div className="flex justify-end h-[30px] items-start">
              <button
                onClick={() => {
                  setSelectedPlan({
                    workoutcard_title: "",
                    username: "",
                    workoutbucket_id: "",
                    workoutcard_favcount: 0,
                    workoutcard_id: "",
                    trash: false,
                    workoutcard_content: { exercises: [] },
                  });
                }}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">
              Add "{selectedPlan.workoutcard_title}" to…
            </h2>
            <div className="flex flex-col items-center gap-2">
              {weeklyPlan.map((dayData) => (
                <button
                  key={dayData.day}
                  onClick={() => {
                    handleAddPlanToDay(dayData.day);
                    //here
                    async function sendData() {
                      try {
                        //delete card on DB
                        await apiRequest("STORE_WEEKLY_PLAN", {
                          body: {
                            workoutcard_id: selectedPlan.workoutcard_id,
                            day_of_week: dayMapping[dayData.day],
                            workoutbucket_id: selectedPlan.workoutbucket_id,
                            workoutcard_favcount:
                              selectedPlan.workoutcard_favcount,
                          },
                        });
                      } catch {}
                    }
                    sendData();
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm"
                >
                  {dayData.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {createWorkout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[400px] h-[700px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setCreateWorkout(false)}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center ">
              <h2 className="text-xl font-bold">Create Custom Workout</h2>

              {/* Workout Name Input */}
              <div className="mt-4">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <span>Workout Name:</span>
                  <input
                    type="text"
                    placeholder="My Epic Pull Day"
                    className=" rounded p-2 w-[200px] border border-gray-700"
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </label>
              </div>
              {/* Exercise List */}
              <div className="mt-4 space-y-2 text-left overflow-y-auto h-[420px]">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-3 shadow-lg rounded-lg flex items-center justify-between gap-2 ${
                      index % 2 === 0 ? "bg-blue-50" : "bg-green-50"
                    }`}
                  >
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-blue-500 block">
                        Exercise Name:
                      </label>
                      <input
                        type="text"
                        placeholder={index === 0 ? "Pull Downs" : "Placeholder"}
                        className="bg-white border border-gray-700 p-2 w-full rounded"
                        value={exercise.title}
                        onChange={(e) =>
                          setExercises(
                            exercises.map((ex, i) =>
                              i === index
                                ? { ...ex, title: e.target.value }
                                : ex
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block">
                          Sets:
                        </label>
                        <input
                          type="number"
                          placeholder="###"
                          className="bg-white border border-gray-700 p-2 w-16 rounded text-center"
                          value={exercise.sets}
                          onChange={(e) =>
                            setExercises(
                              exercises.map((ex, i) =>
                                i === index
                                  ? { ...ex, sets: Number(e.target.value) }
                                  : ex
                              )
                            )
                          }
                        />
                      </div>
                      <button
                        title="remove exercise"
                        onClick={() =>
                          setExercises(exercises.filter((_, i) => i !== index))
                        }
                        className="text-red-500"
                      >
                        <CiTrash size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add Exercise Button */}
              <button
                onClick={() =>
                  setExercises([
                    ...exercises,
                    { title: "", sets: 0, reps: 0, weight: 0 },
                  ])
                }
                className="text-red-500 mt-3 block text-sm font-semibold"
              >
                + Add Exercise
              </button>
              <button
                title="Close"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
                onClick={() => {
                  async function sendData() {
                    try {
                      //Create new card on backend
                      const result = await apiRequest("UPDATE_WORKOUT_CARD", {
                        body: {
                          workoutcard_title: workoutName,
                          workoutcard_content: { exercises: exercises },
                        },
                      });
                      //update favorite plans (our plans) with new workoutplan with ID from DB:
                      setFavoritePlans([
                        ...FavoritePlans,
                        {
                          username: "ME!",
                          workoutcard_id: result.workoutcard_id,
                          workoutcard_title: workoutName,
                          workoutbucket_id: "",
                          trash: true,
                          workoutcard_favcount: 0,
                          workoutcard_content: { exercises: exercises },
                        },
                      ]);
                    } catch {}
                  }

                  sendData();
                  //Reset everything
                  setCreateWorkout(false);
                  setExercises([{ title: "", sets: 0, reps: 0, weight: 0 }]);
                  setWorkoutName("");
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete != "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[150px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setConfirmDelete("")}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Confirm Delete Plan</h2>

              <button
                title="Close"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-[200px]"
                onClick={() => {
                  async function sendData() {
                    try {
                      //delete card on DB
                      await apiRequest("DELETE_WORKOUT_CARD", {
                        body: { workoutcard_id: confirmDelete },
                      });
                      //Remove Card from front end
                      setFavoritePlans((prev) =>
                        prev.filter(
                          (plan) => plan.workoutcard_id !== confirmDelete
                        )
                      );
                    } catch {}
                  }
                  sendData();
                  setConfirmDelete("");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
