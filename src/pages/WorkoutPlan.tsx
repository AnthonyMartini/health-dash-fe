import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
// import { FaFireAlt } from "react-icons/fa";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { CiTrash } from "react-icons/ci";
import { apiService } from "../utils/APIService";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

// Single exercise item displayed on plan cards
interface ExerciseProps {
  title: string;
  weight: number;
  sets: number;
  reps: number;
}

interface PlanProps {
  workoutcard_title: string;
  workoutbucket_id: string;
  workoutcard_favcount: number;
  workoutcard_id: string;
  username: string; // e.g. "@TheRock"
  favorite?: boolean; // whether to show the heart icon
  workoutcard_content: { exercises: ExerciseProps[] };
  trash: boolean;
  is_favorited?: boolean;
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
    is_favorited: data.is_favorited ?? false,
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
  onFavorite?: (plan: PlanProps) => void;
  showFavoriteButton?: boolean;
}
const SmallPlanCard: React.FC<SmallPlanCardProps> = ({
  plan,
  onAddToWeekPlan,
  setConfirmDelete,
  onFavorite,
  showFavoriteButton = false,
}) => {
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only allow unfavoriting if it's a favorited card (not user-created)
    if (onFavorite && (plan.is_favorited || !plan.trash)) {
      onFavorite(plan);
    }
  };

  return (
    <div className="w-full sm:w-[230px] bg-white shadow-md rounded-xl p-3 flex flex-col gap-2 justify-between relative">
      {/* Heart Icon - Absolute Positioned */}
      {(plan.trash || showFavoriteButton) && (
        <div
          className="absolute top-3 right-3 cursor-pointer"
          onMouseEnter={() => setIsHeartHovered(true)}
          onMouseLeave={() => setIsHeartHovered(false)}
          onClick={handleHeartClick}
        >
          {plan.is_favorited ? (
            isHeartHovered ? (
              <BsSuitHeart className="text-gray-500" />
            ) : (
              <BsSuitHeartFill className="text-red-500" />
            )
          ) : isHeartHovered ? (
            <BsSuitHeartFill className="text-red-500" />
          ) : (
            <BsSuitHeart className="text-gray-500" />
          )}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col pr-8">
        <span className="text-sm font-bold text-black w-full">
          {plan.workoutcard_title}
        </span>
        {plan.username && (
          <span className="text-xs text-gray-500">
            by @{plan.username.slice(0, 10)}
          </span>
        )}
      </div>

      {/* Items (chips) */}
      <div className="flex flex-wrap gap-2 h-[115px] overflow-y-auto px-1 content-start">
        {plan.workoutcard_content.exercises.map((item, idx) => {
          // Define the three color combinations
          const colorCombinations = [
            { bg: "bg-[#E6EEFE]", text: "text-[#007AFF]" }, // Blue
            { bg: "bg-[#D6F5DB]", text: "text-[#34C759]" }, // Green
            { bg: "bg-[#FCF2E9]", text: "text-[#FF9500]" }, // Orange
          ];
          const colors = colorCombinations[idx % colorCombinations.length];

          return (
            <div
              key={idx}
              className={`rounded-[10px] px-3 py-2 w-full flex items-center justify-between ${colors.bg}`}
            >
              <span
                className={`text-xs ${colors.text} flex-1 pr-2 break-words`}
              >
                {item.title}
              </span>
              <span className={`text-xs ${colors.text} whitespace-nowrap`}>
                {item.sets} Sets
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer row: delete icon + + button */}
      <div className="flex justify-between items-center">
        <div>
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
        {onAddToWeekPlan && (
          <button
            className="text-blue-600 text-lg hover:scale-105 cursor-pointer"
            onClick={() => onAddToWeekPlan(plan.workoutcard_title)}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

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

  const handleFavorite = async (plan: PlanProps) => {
    try {
      // Call the favorite API with appropriate action
      await apiService.request("FAVORITE_WORKOUT", {
        queryParams: { action: plan.is_favorited ? "unfav" : "fav" },
        body: {
          workoutcard_id: plan.workoutcard_id,
        },
      });

      if (plan.is_favorited) {
        // If unfavoriting, remove from favorites
        setFavoritePlans((prev) =>
          prev.filter((p) => p.workoutcard_id !== plan.workoutcard_id)
        );
      } else {
        // If favoriting, remove from discover/popular and add to favorites
        setDiscoverPlans((prev) =>
          prev.filter((p) => p.workoutcard_id !== plan.workoutcard_id)
        );
        setPopularPlans((prev) =>
          prev.filter((p) => p.workoutcard_id !== plan.workoutcard_id)
        );

        // Add to favorites with is_favorited flag
        const favoritedPlan = {
          ...plan,
          is_favorited: true,
          trash: true, // This allows it to show in the favorites section
        };
        setFavoritePlans((prev) => [...prev, favoritedPlan]);
      }
    } catch (error) {
      console.error("Failed to favorite/unfavorite workout:", error);
    }
  };

  //On screen load, grab user details and health data
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiService.request("GET_WORKOUT_CARD", {
          queryParams: { action: "user" },
        });
        // Combine user_cards and favorited_cards, marking favorited ones
        const userCards = result.data.user_cards.map((card: any) => ({
          ...card,
          is_favorited: false,
        }));
        const favoritedCards = result.data.favorited_cards.map((card: any) => ({
          ...card,
          is_favorited: true,
        }));
        setFavoritePlans(filterPlans(true, [...userCards, ...favoritedCards]));
      } catch {
        /*NOOP*/
      }
      try {
        const result2 = await apiService.request("GET_WEEKLY_PLAN", {
          queryParams: {},
        });

        setWeeklyPlan(filterWeekly(result2.data));
      } catch {
        /*NOOP*/
      }
      try {
        const result2 = await apiService.request("GET_WORKOUT_CARD", {
          queryParams: { action: "discover" },
        });
        setDiscoverPlans(filterPlans(false, result2.data.discover));
        setPopularPlans(filterPlans(false, result2.data.popular));
      } catch {
        /*NOOP*/
      }
    }

    fetchData();
  }, []);

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <SideBar SelectedPage="Workout Plan" />

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
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
                onFavorite={handleFavorite}
                showFavoriteButton={true}
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
                onFavorite={handleFavorite}
                showFavoriteButton={true}
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
                onFavorite={handleFavorite}
                showFavoriteButton={true}
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
                console.log("Log Workout clicked!");
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Log Workout
            </button>
          </div>
          <div className="bg-white shadow p-4 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
              {weeklyPlan.map((wDay) => (
                <div
                  key={wDay.day}
                  className="flex flex-col items-center gap-2"
                >
                  <h3 className="text-gray-600 font-bold text-center text-xs sm:text-sm">
                    {wDay.day}
                  </h3>
                  <div className="bg-white shadow p-2 rounded-lg w-full min-h-[60px] space-y-1 text-center">
                    {wDay.plans.length === 0 && (
                      <p className="text-xs text-gray-400">No plans</p>
                    )}
                    {wDay.plans.map((pName, idx) => (
                      <div
                        key={idx}
                        className="bg-red-100 text-red-500 text-xs rounded px-2 py-1 font-semibold flex justify-between items-center"
                      >
                        <span className="whitespace-normal break-words w-full text-left">
                          {pName.workoutcard_title}
                        </span>

                        <CiTrash
                          size={16}
                          className="cursor-pointer shrink-0"
                          onClick={() => {
                            async function sendData() {
                              try {
                                await apiService.request("DELETE_WEEKLY_PLAN", {
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
                        await apiService.request("STORE_WEEKLY_PLAN", {
                          body: {
                            workoutcard_id: selectedPlan.workoutcard_id,
                            day_of_week: dayMapping[dayData.day],
                            workoutbucket_id: selectedPlan.workoutbucket_id,
                            workoutcard_favcount:
                              selectedPlan.workoutcard_favcount,
                          },
                        });
                      } catch {
                        /*NOOP*/
                      }
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
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white border border-gray-700 p-2 w-16 rounded text-center"
                          value={exercise.sets ? exercise.sets : ""}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value < 0 || value > 15) {
                              value = 0; // Reset to 1 if out of range
                            }
                            setExercises(
                              exercises.map((ex, i) =>
                                i === index ? { ...ex, sets: value } : ex
                              )
                            );
                          }}
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
                      const result = await apiService.request(
                        "UPDATE_WORKOUT_CARD",
                        {
                          body: {
                            workoutcard_title: workoutName,
                            workoutcard_content: { exercises: exercises },
                          },
                        }
                      );
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
                    } catch {
                      /*NOOP*/
                    }
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
                      await apiService.request("DELETE_WORKOUT_CARD", {
                        body: { workoutcard_id: confirmDelete },
                      });
                      //Remove Card from front end
                      setFavoritePlans((prev) =>
                        prev.filter(
                          (plan) => plan.workoutcard_id !== confirmDelete
                        )
                      );
                    } catch {
                      /*NOOP*/
                    }
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
